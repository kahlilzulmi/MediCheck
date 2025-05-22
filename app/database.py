from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["medicheck"]
users_collection = db["users"]
temp_collection = db["temp"]

class SuhuInput(BaseModel):
    suhu: float

@app.post("/suhu")
async def post_suhu(data: SuhuInput):
    entry = {
        "suhu": data.suhu,
        "timestamp": datetime.datetime.now()
    }
    temp_collection.insert_one(entry)
    return {"message": "Data saved", "suhu": data.suhu}

@app.get("/suhu")
def get_suhu():
    last = temp_collection.find().sort("timestamp", -1).limit(1)
    return list(last)