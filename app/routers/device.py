import bluetooth
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from typing import Dict

from ..database import users_collection
from .auth import get_current_active_user
from ..utils.bluetooth_utils import get_temperature_from_device

router = APIRouter(
    prefix="/device",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

class Device(BaseModel):
    address: str

# Endpoint to scan for available Bluetooth devices
@router.get("/scan")
async def scan_devices(current_user: Dict = Depends(get_current_active_user)):
    """
    Scans for nearby Bluetooth devices.
    This is a synchronous operation, but FastAPI will run it in a thread pool.
    """
    print("Scanning for bluetooth devices...")
    try:
        # The discovery can take a few seconds
        nearby_devices = bluetooth.discover_devices(duration=8, lookup_names=True, flush_cache=True, lookup_class=False)
        print(f"Found {len(nearby_devices)} devices")
        return [{"name": name, "address": addr} for addr, name in nearby_devices]
    except Exception as e:
        print(f"Error during bluetooth scan: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to scan for Bluetooth devices")

# Endpoint to register a device for the current user
@router.post("/register")
async def register_device(device: Device, current_user: Dict = Depends(get_current_active_user)):
    """
    Registers a Bluetooth device's MAC address for the logged-in user.
    """
    user_id = current_user["_id"]
    users_collection.update_one(
        {"_id": user_id},
        {"$set": {"device_address": device.address}}
    )
    return {"message": "Device registered successfully", "device_address": device.address}

# Endpoint to unregister a device for the current user
@router.delete("/unregister", status_code=status.HTTP_204_NO_CONTENT)
async def unregister_device(current_user: Dict = Depends(get_current_active_user)):
    """
    Removes the registered Bluetooth device for the logged-in user.
    This operation is idempotent.
    """
    user_id = current_user["_id"]
    users_collection.update_one(
        {"_id": user_id},
        {"$unset": {"device_address": ""}}
    )

# Endpoint to get temperature from the user's registered device
@router.get("/suhu")
async def get_suhu_from_device(current_user: Dict = Depends(get_current_active_user)):
    """
    Connects to the user's registered device and fetches temperature data.
    """
    user = current_user  # The user document is already fetched by the dependency
    if not user or "device_address" not in user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No device registered for this user. Please register a device first."
        )

    target_address = user["device_address"]    
    # Call the centralized utility function to get the temperature
    suhu = await get_temperature_from_device(target_address)

    return {"suhu": suhu, "timestamp": datetime.utcnow().isoformat()}