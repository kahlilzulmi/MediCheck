from pymongo import MongoClient
import random
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["medicheck"]
users_collection = db["users"]

class SuhuInput(BaseModel):
    suhu: float

@app.post("/suhu")
async def post_suhu(data: SuhuInput):
    entry = {
        "suhu": data.suhu,
        "timestamp": datetime.datetime.now()
    }
    users_collection.insert_one(entry)
    return {"message": "Data saved", "suhu": data.suhu}

"""
@app.get("/suhu")
def get_suhu():
    last = users_collection.find().sort("timestamp", -1).limit(1)
    return list(last)
"""

"""
@app.get("/suhu")
def get_dummy_suhu():
    return [{
        "suhu": round(random.uniform(36.0, 38.5), 2),
        "timestamp": datetime.utcnow().isoformat()
    }]
"""