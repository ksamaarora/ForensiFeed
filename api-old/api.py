from flask import Flask
import asyncio
import httpx
import json
app = Flask(__name__)

async def make_request(sem: asyncio.Semaphore, client, url: str):
    try:
        async with sem:
                r = await client.get(url)
                # print(r.json(), "\n\n")
                return r.json()
    except Exception as e:
        print("Failure!")

@app.route('/api/<lat>')
async def test(lat):
    sem = asyncio.Semaphore(20)
    coros = []
    async with httpx.AsyncClient() as client:
        coros.append(make_request(sem, client, f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude=13.41&current=temperature_2m"))
        res = await asyncio.gather(*coros)
    # res = json.dumps(res)
    return {"res":res}

@app.route('/api/')
async def errhandler():
    sem = asyncio.Semaphore(20)
    coros = []
    async with httpx.AsyncClient() as client:
        coros.append(make_request(sem, client, f"https://api.open-meteo.com/v1/forecast?latitude=52.2&longitude=13.41&current=temperature_2m"))
        res = await asyncio.gather(*coros)
    # res = json.dumps(res)

    return {"res":res}