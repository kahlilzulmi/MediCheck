from fastapi import APIRouter, Body, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
import json
from datetime import datetime
from app.models.prediction import PredictionRecord
from app.database import predictions_collection
from app.routers.auth import get_current_active_user, UserInDB
from typing import List, Optional
import httpx
import os
import json
from datetime import datetime
from app.models.prediction import PredictionRecord
from app.database import predictions_collection
from app.routers.auth import get_current_active_user, UserInDB
from fastapi import APIRouter, Body, Depends, HTTPException, status # Re-import APIRouter, etc.

router = APIRouter()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")  # Ganti dengan model Anda

class Symptomclass(BaseModel):
    symptoms: List[str]
    suhu: float # Make suhu a required float

class RiwayatItem(BaseModel):
    tanggal: str
    gejala: List[str]
    prediksi: str
    
# SuhuResponse and get_suhu endpoint are removed as they are no longer needed
# for real-time temperature display (now handled by WebSocket) or prediction fallback.

@router.post("/predict")
async def predict_with_llm(s: Symptomclass, current_user: UserInDB = Depends(get_current_active_user)):
    username = current_user.username
    temperature = s.suhu # Temperature is now a required field in the request body

    # Format prompt
    symptoms_str = ", ".join(s.symptoms)
    prompt = f"Dari gejala yang disebutkan: {symptoms_str}, dengan suhu {temperature}, apa penyakit yang paling mungkin? Berikan jawaban singkat dari yang paling mungkin, pisahkan dengan koma, dan jangan sertakan penjelasan apapun, hanya berikan jawaban penyakitnya. Jika gejala yang diberikan saling bertentangan atau tidak masuk akal (misalnya, 'tidak sakit tapi pinggang sakit'), jawab 'Gejala tidak konsisten, mohon klarifikasi.'. Jika tidak ada keluhan spesifik atau gejala tidak mengarah ke penyakit tertentu, jawab 'Anda sehat'. Jika tidak dapat mengidentifikasi penyakit, jawab 'Tidak diketahui'. Contoh: penyakit1, penyakit2, penyakit3"

    # Call Ollama LLM using /api/generate (not /api/chat)
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt
    }
    try:
        async with httpx.AsyncClient(timeout=180) as client:
            response = await client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
            response.raise_for_status()
            disease = ""
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    disease += data.get("response", "")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"LLM service returned an error: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Could not connect to the LLM service: {e}")

    # Simpan ke database
    record = PredictionRecord(
        symptoms=s.symptoms,
        suhu=temperature,
        result=disease.strip() if disease else "Tidak diketahui",
        timestamp=datetime.utcnow().isoformat(),
        username=username
    )
    predictions_collection.insert_one(record.dict())

    return {"disease": record.result}

@router.get("/riwayat", response_model=List[RiwayatItem])
async def get_riwayat(current_user: UserInDB = Depends(get_current_active_user)):
    username = current_user.username
    try:
        records = predictions_collection.find({"username": username}).sort("timestamp", -1)
        records_list = []
        for rec in records:
            # Ensure _id is converted to string if it exists, to prevent serialization issues
            if "_id" in rec:
                rec["_id"] = str(rec["_id"])
            records_list.append(rec)

        return [
            {
                "tanggal": str(rec.get("timestamp", ""))[:10], # Ensure it's a string before slicing
                "gejala": list(rec.get("symptoms", [])), # Ensure it's a list
                "prediksi": str(rec.get("result", "")) # Ensure it's a string
            }
            for rec in records_list
        ]
    except Exception as e:
        print(f"Error fetching riwayat for user {username}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch history: {e}")
