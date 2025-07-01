from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict, device, user
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173", # Your frontend's development server
    "http://127.0.0.1:5173" # Added to cover 127.0.0.1 variation for frontend
    # You can add your production frontend URL here as well
    # e.g., "https://www.testmedi.online"
]

# Tambahkan ini untuk mengizinkan frontend mengakses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Sesuaikan dengan port React kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(device.router)
app.include_router(user.router)
