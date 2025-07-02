import bluetooth
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from datetime import datetime
from typing import Dict
from bson import ObjectId # Import ObjectId

import asyncio # Import asyncio for sleep
from ..database import users_collection
from .auth import get_current_active_user, UserInDB, get_user_from_websocket_token # Import UserInDB and the new WebSocket auth helper
from ..utils.bluetooth_utils import get_latest_temperature_from_device # Import the new single-read function

router = APIRouter(
    prefix="/device",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

class Device(BaseModel):
    address: str
    name: str | None = None

# Endpoint to scan for available Bluetooth devices
@router.get("/scan")
async def scan_devices(current_user: UserInDB = Depends(get_current_active_user)): # Change type hint to UserInDB
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
async def register_device(device: Device, current_user: UserInDB = Depends(get_current_active_user)): # Change type hint to UserInDB
    """
    Registers a Bluetooth device's MAC address for the logged-in user.
    """
    # The _id from current_user is already an ObjectId from MongoDB
    # Access attributes using dot notation as current_user is a Pydantic model
    # We map MongoDB's _id to 'id' in the Pydantic model
    user_id_obj = ObjectId(current_user.id) # Convert back to ObjectId for MongoDB query
    
    # Store as a sub-document for better organization
    registered_device = {"address": device.address, "name": device.name or "Unknown Device"}
    
    try:
        users_collection.update_one(
            {"_id": user_id_obj},
            {"$set": {"registered_device": registered_device}}
        )
        # Clean up the old field for data consistency
        users_collection.update_one(
            {"_id": user_id_obj},
            {"$unset": {"device_address": ""}}
        )
        
        return {"message": "Device registered successfully", "registered_device": registered_device}
    except Exception as e:
        print(f"Error during device registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register device due to a server error."
        )

# Endpoint to unregister a device for the current user
@router.delete("/unregister", status_code=status.HTTP_204_NO_CONTENT)
async def unregister_device(current_user: UserInDB = Depends(get_current_active_user)): # Change type hint to UserInDB
    """
    Removes the registered Bluetooth device for the logged-in user.
    This operation is idempotent.
    """
    # Convert user_id (which is 'id' in Pydantic model) back to ObjectId for MongoDB query
    user_id_obj = ObjectId(current_user.id)
    # Remove both the new and old fields to handle all cases
    users_collection.update_one(
        {"_id": user_id_obj},
        {"$unset": {"registered_device": "", "device_address": ""}}
    )

# WebSocket endpoint to stream temperature from the user's registered device
@router.websocket("/ws/suhu")
async def websocket_suhu_endpoint(websocket: WebSocket):
    """
    Establishes a WebSocket connection to stream temperature data from the user's registered device.
    Authenticates via token in query parameters.
    """
    try:
        user = await get_user_from_websocket_token(websocket)
    except WebSocketDisconnect as e:
        print(f"Authentication failed for WebSocket: {e.reason}")
        # The get_user_from_websocket_token already closes the websocket with appropriate code/reason
        return
    except Exception as e:
        print(f"Unexpected error during WebSocket authentication: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Authentication error.")
        return

    if not user or (user.registered_device is None and user.device_address is None):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="No device registered for this user.")
        return

    target_address = None
    if user.registered_device and user.registered_device.get("address"):
        target_address = user.registered_device["address"]
    elif user.device_address:
        target_address = user.device_address

    if not target_address:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Device address not found in user profile.")
        return

    await websocket.accept()
    print(f"WebSocket accepted for user {user.username} to device {target_address}")

    try:
        while True:
            try:
                # Periodically fetch the latest temperature from the device
                suhu_data = await get_latest_temperature_from_device(target_address)
                await websocket.send_text(suhu_data)
            except HTTPException as e:
                # If fetching from device fails, send error to client and log
                error_message = f"Error fetching temperature from device: {e.detail}"
                print(error_message)
                await websocket.send_text(f"Error: {e.detail}") # Send error to frontend
                # Do not break the loop immediately, keep trying unless it's a critical error
                # Consider a short sleep here to prevent rapid error logging/sending
                await asyncio.sleep(1) 
            except Exception as e:
                # Catch any other unexpected errors during data fetching
                error_message = f"Unexpected error during temperature fetch: {e}"
                print(error_message)
                await websocket.send_text(f"Error: {error_message}") # Send error to frontend
                await asyncio.sleep(1)
            
            await asyncio.sleep(2) # Poll every 2 seconds (adjust as needed)

    except WebSocketDisconnect:
        print(f"Client {user.username} disconnected from WebSocket.")
    except Exception as e:
        print(f"Unexpected error in WebSocket for {user.username}: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Server error during data streaming.")
    finally:
        print(f"WebSocket connection closed for user {user.username}.")
