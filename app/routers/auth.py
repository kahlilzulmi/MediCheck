from fastapi import APIRouter, HTTPException, Depends, status, WebSocket, WebSocketDisconnect # Added WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from typing import Dict, Optional
from bson import ObjectId # Import ObjectId

# Inisialisasi router
router = APIRouter()

# Secret key dan algoritma untuk JWT
SECRET_KEY = os.getenv("SECRET_KEY", "a_default_secret_key_for_development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # Increased to 24 hours to prevent auto-logout

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Context hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from ..database import users_collection

# Model input dan output
class UserLogin(BaseModel):
    username: str
    password: str

class UserSignup(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: Optional[str] = None # Use 'id' for Pydantic, will map to '_id'
    username: str
    email: Optional[EmailStr] = None
    device_address: Optional[str] = None
    registered_device: Optional[Dict] = None # Add this to handle the new device structure

    class Config:
        populate_by_name = True # Allow field mapping by name
        arbitrary_types_allowed = True # Allow ObjectId type
        json_encoders = {ObjectId: str} # Encode ObjectId to string for JSON output
        extra = "allow" # Allow extra fields not defined in the model

class UserInDB(UserOut):
    password: str # This is the hashed password

    class Config(UserOut.Config): # Inherit from UserOut.Config
        pass # No additional config needed, just inherit


# Fungsi bantu
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
async def signup(user: UserSignup):
    # Cek apakah username sudah terdaftar
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username sudah terdaftar")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Simpan ke MongoDB
    users_collection.insert_one({
        "username": user.username,
        "password": hashed_password
    })

    return {"message": "Akun berhasil dibuat"}

async def get_current_active_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
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
    
    user_doc = users_collection.find_one({"username": username})
    if user_doc is None:
        raise credentials_exception
    
    # Convert ObjectId to string for 'id' field in Pydantic model
    user_doc["id"] = str(user_doc["_id"])
    # Remove the original _id field to prevent serialization issues with extra fields
    del user_doc["_id"]
    
    print(f"User document before Pydantic conversion: {user_doc}")
    return UserInDB(**user_doc)

async def get_user_from_websocket_token(websocket: WebSocket) -> UserInDB:
    token = websocket.query_params.get("token")
    if not token:
        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION, reason="Authentication token missing.")
    
    credentials_exception = WebSocketDisconnect(
        code=status.WS_1008_POLICY_VIOLATION,
        reason="Could not validate credentials."
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not isinstance(username, str):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_doc = users_collection.find_one({"username": username})
    if user_doc is None:
        raise credentials_exception
    
    user_doc["id"] = str(user_doc["_id"])
    del user_doc["_id"]
    
    return UserInDB(**user_doc)

# Endpoint to get current user info
@router.get("/users/me", response_model=UserOut)
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)):
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
