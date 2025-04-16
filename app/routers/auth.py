from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

# Inisialisasi router
router = APIRouter()

# Inisialisasi context untuk hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key untuk JWT
SECRET_KEY = "your_secret_key"  # Ganti dengan secret key yang lebih aman
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token kadaluarsa dalam 30 menit

# Model untuk login
class UserLogin(BaseModel):
    username: str
    password: str

# Model untuk token
class Token(BaseModel):
    access_token: str
    token_type: str

# Simulasi pengguna (ganti dengan implementasi database nyata)
fake_users_db = {
    "user1": {
        "username": "user1",
        "password": "$2a$12$OFkPxfyaIV76w3X3AZE/B.9hLNDbl9fPochk0cl2zil8na1ePfHdG",  # hashed password: "password"
    }
}

# Fungsi untuk memverifikasi password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Fungsi untuk membuat token JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint login
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: UserLogin):
    # Validasi username dan password
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=401, detail="Incorrect username or password"
        )
    # Buat token akses
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
