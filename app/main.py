from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict
import random
from datetime import datetime

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

@app.get("/suhu")
def get_dummy_suhu():
    return [{
        "suhu": round(random.uniform(36.0, 38.5), 2),
        "timestamp": datetime.utcnow().isoformat()
    }]