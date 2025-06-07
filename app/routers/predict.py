from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List
import httpx
import os
import json
from datetime import datetime
from app.models.prediction import PredictionRecord
from app.database import predictions_collection

router = APIRouter()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")  # Ganti dengan model Anda

class Symptomclass(BaseModel):
    symptoms: List[str]
    suhu: float

@router.post("/predict")
def predict_with_llm(s: Symptomclass):
    # Format prompt
    symptoms_str = ", ".join(s.symptoms)
    prompt = f"Dari gejala yang disebutkan: {symptoms_str}, dengan suhu {s.suhu}, apa penyakit yang paling mungkin?, berikan jawaban singkat dari yang paling mungkin, pisahkan dengan koma, dan jangan sertakan penjelasan apapun, hanya berikan jawaban penyakit nya. Contoh: penyakit1, penyakit2, penyakit3"

    # Call Ollama LLM using /api/generate (not /api/chat)
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt
    }
    try:
        with httpx.Client(timeout=180) as client:
            response = client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
            response.raise_for_status()
            disease = ""
            for line in response.iter_lines():
                if line:
                    data = json.loads(line)
                    disease += data.get("response", "")
    except Exception as e:
        return {"disease": "Gagal memprediksi: " + str(e)}

    # Simpan ke database
    record = PredictionRecord(
        symptoms=s.symptoms,
        suhu=s.suhu,
        result=disease.strip() if disease else "Tidak diketahui",
        timestamp=datetime.utcnow().isoformat()
    )
    predictions_collection.insert_one(record.dict())

    return {"disease": record.result}

@router.get("/riwayat")
def get_riwayat():
    records = list(predictions_collection.find().sort("timestamp", -1))
    result = []
    for rec in records:
        result.append({
            "tanggal": rec.get("timestamp", "")[:10],
            "gejala": rec.get("symptoms", []),
            "prediksi": rec.get("result", "")
        })
    return result
