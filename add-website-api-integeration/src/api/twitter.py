import pandas as pd
from ntscraper import Nitter
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import requests
from io import BytesIO
import json
import asyncio

from src.config.logger import log

scraper = Nitter()

async def get_twitter_user_details(username: str) -> dict:
    try:
        user_profile_info = scraper.get_profile_info(username)
        return user_profile_info
    except Exception as e:
        log.error("failed to fetch twitter details for user %s", username)
        log.exception(e)
        return {}

async def get_user_tweets(name: str, modes: str, no: int):
    try:
        tweets = scraper.get_tweets(name, mode = modes, number=no)
        final_tweets = []
        for x in tweets['tweets']:
            data = [x['link'], x['text'],x['date'],x['stats']['likes'],x['stats']['comments']]
            final_tweets.append(data)
        dat= pd.DataFrame(final_tweets, columns =['twitter_link','text','date','likes','comments'])
        return dat.to_json()
    except Exception as e:
        log.error("failed to fetch twitter tweets for user %s", name)
        log.exception(e)
        return {}
    
def fetch_image(image_url):
    response = requests.get(image_url)
    img = Image(BytesIO(response.content), width=100, height=100)
    return img

# Function to create PDF report
def create_twitter_user_pdf(data, tweet_data, num_tweets):
    try:
        # Extracting data from the input
        name = data['userdetails']['name']
        username = data['userdetails']['username']
        bio = data['userdetails']['bio']
        joined = data['userdetails']['joined']
        website = data['userdetails']['website']
        stats = data['userdetails']['stats']
        image_url = data['userdetails']['image']

        # Parse tweets JSON string into a dictionary
        tweet_data = json.loads(tweet_data['usertweets'])
        tweet_links = tweet_data['twitter_link']
        tweet_texts = tweet_data['text']
        tweet_dates = tweet_data['date']
        tweet_likes = tweet_data['likes']
        tweet_comments = tweet_data['comments']

        # Create PDF document
        pdf = SimpleDocTemplate(f"src/web/public/pdf_files/{name}_report.pdf", pagesize=A4)
        story = []
        styles = getSampleStyleSheet()

        # Add title
        title = Paragraph(f"<b>{name} - Profile Overview</b>", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 12))

        # Fetch and add image
        img = fetch_image(image_url)
        story.append(img)
        story.append(Spacer(1, 12))

        # Add user details
        user_details = f"""
        <b>Name:</b> {name}<br/>
        <b>Username:</b> {username}<br/>
        <b>Bio:</b> {bio}<br/>
        <b>Joined:</b> {joined}<br/>
        <b>Website:</b> <a href='{website}' color='blue'>{website}</a><br/>
        """
        story.append(Paragraph(user_details, styles['Normal']))
        story.append(Spacer(1, 12))

        # Add stats
        stats_details = f"""
        <b>Total Tweets:</b> {stats['tweets']}<br/>
        <b>Following:</b> {stats['following']}<br/>
        <b>Followers:</b> {stats['followers']}<br/>
        <b>Likes:</b> {stats['likes']}<br/>
        <b>Media:</b> {stats['media']}<br/>
        """
        story.append(Paragraph("<b>Statistics:</b>", styles['Heading2']))
        story.append(Paragraph(stats_details, styles['Normal']))

        story.append(Spacer(1, 12))

        # Add tweets section
        story.append(Paragraph("<b>Recent Tweets:</b>", styles['Heading2']))
        for i in range(num_tweets):
            tweet = f"""
            <b>Date:</b> {tweet_dates[str(i)]}<br/>
            <b>Tweet:</b> {tweet_texts[str(i)]}<br/>
            <b>Link:</b> <a href='{tweet_links[str(i)]}' color='blue'>{tweet_links[str(i)]}</a><br/>
            <b>Likes:</b> {tweet_likes[str(i)]} | <b>Comments:</b> {tweet_comments[str(i)]}<br/>
            """
            story.append(Paragraph(tweet, styles['Normal']))
            story.append(Spacer(1, 12))

        # Build PDF
        pdf.build(story)
        return f"{name}_report.pdf"
    
    except Exception as e:
        log.exception(e)
        return "Fail"