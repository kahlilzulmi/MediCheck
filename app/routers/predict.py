from fastapi import APIRouter, Body, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
import json
from datetime import datetime
from app.models.prediction import PredictionRecord
from app.database import predictions_collection
from app.routers.auth import get_current_active_user
from app.utils.bluetooth_utils import get_temperature_from_device
from typing import Dict

router = APIRouter()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")  # Ganti dengan model Anda

class Symptomclass(BaseModel):
    symptoms: List[str]
    suhu: Optional[float] = None

@router.post("/predict")
async def predict_with_llm(s: Symptomclass, current_user: Dict = Depends(get_current_active_user)):
    username = current_user["username"]
    temperature = s.suhu

    # If temperature is not provided, try fetching it from the registered device
    if temperature is None:
        if "device_address" in current_user and current_user["device_address"]:
            target_address = current_user["device_address"]
            print(f"Temperature not provided, attempting to fetch from device: {target_address}")
            try:
                suhu_str = await get_temperature_from_device(target_address)
                try:
                    temperature = float(suhu_str)
                except ValueError:
                    # This block is only entered if float() fails, so suhu_str is guaranteed to be defined.
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Device returned non-numeric temperature: '{suhu_str}'")
            except HTTPException as e:
                # Re-raise exception from util with more context
                raise HTTPException(status_code=e.status_code, detail=f"Could not fetch temperature. Error: {e.detail}")
        else:
            # No device registered and no temperature provided
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Temperature is required. Please provide it or register a device.")

    # Format prompt
    symptoms_str = ", ".join(s.symptoms)
    prompt = f"Dari gejala yang disebutkan: {symptoms_str}, dengan suhu {temperature}, apa penyakit yang paling mungkin?, berikan jawaban singkat dari yang paling mungkin, pisahkan dengan koma, dan jangan sertakan penjelasan apapun, hanya berikan jawaban penyakit nya. Contoh: penyakit1, penyakit2, penyakit3"

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

@router.get("/riwayat")
async def get_riwayat(current_user: Dict = Depends(get_current_active_user)):
    username = current_user["username"]
    records = list(predictions_collection.find({"username": username}).sort("timestamp", -1))
    result = []
    for rec in records:
        result.append({
            "tanggal": rec.get("timestamp", "")[:10],
            "gejala": rec.get("symptoms", []),
            "prediksi": rec.get("result", "")
        })
    return result
