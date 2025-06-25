from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict
from datetime import datetime
import asyncio
import bluetooth
import random

app = FastAPI()

# Tambahkan ini untuk mengizinkan frontend mengakses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://testmedi.online", "https://app.www.testmedi.online"],  # Sesuaikan dengan port React kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)

# Bluetooth setup
target_name = "Medicheck v1"
target_address = None
sock = None
suhu = None

async def bluetooth_connect():
    global target_address, sock, suhu
    nearby_devices = bluetooth.discover_devices()
    for bdaddr in nearby_devices:
        if target_name == bluetooth.lookup_name(bdaddr):
            target_address = bdaddr
            break

    if target_address is not None:
        port = 1
        sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        try:
            await sock.connect((target_address, port))
            print("Connected to {}".format(target_address))
            while True:
                try:
                    data = sock.recv(1024)
                    suhu = data.decode('utf-8').strip()
                    print("Received: {}".format(suhu))
                except Exception as e:
                    print(f"Error receiving data: {e}")
                    break
                await asyncio.sleep(0.1)
        except Exception as e:
            print(f"Error connecting to {target_address}: {e}")
    else:
        print("Could not find target Bluetooth device nearby")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(bluetooth_connect())

@app.get("/suhu")
async def get_suhu():
    global suhu
    if suhu is not None:
        return [{"suhu": suhu, "timestamp": datetime.utcnow().isoformat()}]
    else:
        return [{"suhu": "N/A", "timestamp": datetime.utcnow().isoformat()}]
