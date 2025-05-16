from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import httpx
import os
import json

router = APIRouter()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")  # Ganti dengan model Anda

class Symptomclass(BaseModel):
    symptoms: List[str]

@router.post("/predict")
def predict_with_llm(s: Symptomclass):
    # Format prompt
    symptoms_str = ", ".join(s.symptoms)
    prompt = f"Dari gejala yang disebutkan: {symptoms_str}, apa penyakit yang paling mungkin?"

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

    return {"disease": disease.strip() if disease else "Tidak diketahui"}
