from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio
from fastapi.middleware.cors import CORSMiddleware

from src.config.logger import log
from src.config.env import settings
from src.api.twitter import get_twitter_user_details, get_user_tweets, create_twitter_user_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TweetParams(BaseModel):
    username: str = ""
    number_of_tweets: int = 1
    
@app.get("/")
async def root():
    log.info(r"Probed the endpoint '/'")
    return {"message": "Parsing"}

@app.get("/api/v1/twitter/userdetails/{username}")
async def root(username: str):
    user_details = await get_twitter_user_details(username)
    return {"userdetails": user_details}

@app.post("/api/v1/twitter/usertweets")
async def root(tweet_input: TweetParams):
    user_tweets = await get_user_tweets(tweet_input.username, "user", tweet_input.number_of_tweets)
    return {"usertweets": user_tweets}

@app.post("/api/v1/twitter/generatereport")
async def root(tweet_input: TweetParams):
    coros = []
    coros.append(get_twitter_user_details(tweet_input.username))
    coros.append(get_user_tweets(tweet_input.username, "user", tweet_input.number_of_tweets))
    
    user_details, user_tweets = await asyncio.gather(*coros)
    print(user_details)
    pdf_name = create_twitter_user_pdf({"userdetails":user_details}, {"usertweets": user_tweets}, tweet_input.number_of_tweets)
    return {"user_reports": pdf_name}

def main():
    uvicorn.run(
        "api:app",
        host=settings.APP.API_HOST,
        port=settings.APP.API_PORT,
        log_level=settings.APP.LOG_LEVEL,
    )

if __name__ == "__main__":
    main()