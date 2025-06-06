from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["medicheck"]
users_collection = db["users"]
predictions_collection = db["predictions"]  # Koleksi untuk prediksi