from pydantic import BaseModel
from typing import List

class PredictionRecord(BaseModel):
    symptoms: List[str]
    suhu: float
    result: str
    timestamp: str  # ISO format string
    username: str  # username user yang melakukan prediksi
