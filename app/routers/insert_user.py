from pymongo import MongoClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

client = MongoClient("mongodb://localhost:27017")
db = client["medicheck"]
users = db["users"]

hashed_pw = pwd_context.hash("abc123")
users.insert_one({"username": "John Doe", "password": hashed_pw})
