from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pymongo import MongoClient
from typing import Optional

# Inisialisasi router
router = APIRouter()

# Secret key dan algoritma untuk JWT
SECRET_KEY = "your_secret_key"  # Ganti dengan secret key yang aman
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Context hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB client
client = MongoClient("mongodb://localhost:27017")
db = client["medicheck"]
users_collection = db["users"]

# Model input dan output
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Fungsi bantu
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class UserSignup(BaseModel):
    username: str
    password: str

@router.post("/signup")
async def signup(user: UserSignup):
    # Cek apakah username sudah terdaftar
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username sudah terdaftar")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Simpan ke MongoDB
    users_collection.insert_one({
        "username": user.username,
        "password": hashed_password
    })

    return {"message": "Akun berhasil dibuat"}


# Endpoint login
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: UserLogin):
    user = users_collection.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Username tidak ditemukan")
    
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Password salah")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
