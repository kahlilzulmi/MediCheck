from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict

app = FastAPI()

# Tambahkan ini untuk mengizinkan frontend mengakses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Sesuaikan dengan port React kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
