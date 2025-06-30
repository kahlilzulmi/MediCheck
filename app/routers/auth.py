from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from typing import Dict

# Inisialisasi router
router = APIRouter()

# Secret key dan algoritma untuk JWT
SECRET_KEY = os.getenv("SECRET_KEY", "a_default_secret_key_for_development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Context hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from ..database import users_collection

# Model input dan output
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    device_address: str | None = None

# Fungsi bantu
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username sudah terdaftar")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Simpan ke MongoDB
    users_collection.insert_one({
        "username": user.username,
        "password": hashed_password
    })

    return {"message": "Akun berhasil dibuat"}

async def get_current_active_user(token: str = Depends(oauth2_scheme)) -> Dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not isinstance(username, str):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# Endpoint to get current user info
@router.get("/users/me", response_model=User)
async def read_users_me(current_user: Dict = Depends(get_current_active_user)):
    """
    Fetch the current logged in user's details.
    """
    # The Pydantic model will automatically validate and filter the returned data
    return current_user

# Endpoint login
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: UserLogin):
    user = users_collection.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Username tidak ditemukan")
    
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Password salah")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
