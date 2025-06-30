import bluetooth
from fastapi import HTTPException, status

async def get_temperature_from_device(address: str) -> str:
    """
    Connects to a given Bluetooth address, fetches data, and returns it as a string.
    This is a blocking I/O operation that FastAPI will run in a thread pool.
    Raises HTTPException on failure.
    """
    port = 1  # Standard RFCOMM port
    sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    
    try:
        print(f"Connecting to {address}...")
        sock.connect((address, port))
        print("Connected. Receiving data...")
        
        # Set a timeout for receiving data to avoid hanging forever
        sock.settimeout(10.0) 
        
        data = sock.recv(1024)
        suhu = data.decode('utf-8').strip()
        print(f"Received: {suhu}")
        return suhu

    except bluetooth.btcommon.BluetoothError as e:
        print(f"Bluetooth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not connect to device {address}. Make sure it's on and in range."
        )
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching data from the device."
        )
    finally:
        print("Closing connection.")
        sock.close()