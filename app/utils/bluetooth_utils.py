import bluetooth
from fastapi import HTTPException, status
from bluetooth import BluetoothError # Import BluetoothError directly
import re # Import regex module
import socket # Import socket module to catch socket.timeout
import time # Import time module for time.time()

async def get_latest_temperature_from_device(address: str) -> str:
    """
    Connects to a given Bluetooth address, fetches one complete data line,
    and returns it as a formatted string. This is a blocking I/O operation.
    Raises HTTPException on failure.
    """
    port = 1  # Standard RFCOMM port
    sock = bluetooth.BluetoothSocket()

    try:
        print(f"Connecting to {address} for single read...")
        sock.connect((address, port))
        print("Connected. Receiving data...")

        # Set a timeout for receiving data
        timeout_duration = 5.0 # A reasonable timeout for a single read
        sock.settimeout(timeout_duration) 

        data_buffer = ""
        start_time = time.time()
        # Loop to ensure a complete line is read within the timeout
        while time.time() - start_time < timeout_duration: # Use the explicit float variable
            try:
                data = sock.recv(1024)
                if not data:
                    print("No data received, connection might be closed by device.")
                    # If no data is received, and we're still within the overall timeout,
                    # we can continue trying. If the device truly closed, the next recv will fail.
                    continue 

                data_buffer += data.decode('utf-8')
                print(f"Current buffer (single read): '{data_buffer}'")

                if '\n' in data_buffer:
                    line, _ = data_buffer.split('\n', 1) # Take only the first complete line
                    raw_suhu_str = line.strip()
                    
                    if not raw_suhu_str: # Skip empty lines
                        continue

                    print(f"Processing raw string (single read): '{raw_suhu_str}'")
                    # Regex to find a floating point number, allowing for optional sign
                    match = re.search(r"([-+]?\d*\.?\d+)", raw_suhu_str)
                    if not match:
                        print(f"Could not extract temperature from string: '{raw_suhu_str}'")
                        # If a line is received but no temperature, continue trying for the timeout duration
                        continue
                    
                    suhu_str = match.group(1)
                    print(f"Extracted numeric string (single read): '{suhu_str}'")

                    try:
                        suhu_float = float(suhu_str)
                        formatted_suhu = f"{suhu_float:.2f}"
                        print(f"Parsed and formatted temperature (single read): {formatted_suhu}")
                        return formatted_suhu # Return the first successfully parsed temperature
                    except ValueError:
                        print(f"Extracted string is not a valid number: '{suhu_str}'")
                        continue # Continue trying for the timeout duration

            except socket.timeout:
                print("Bluetooth recv timed out during single read. Retrying...")
                continue # Continue trying to receive data until overall timeout
            except bluetooth.BluetoothError as e:
                print(f"Bluetooth Error during single read: {e}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"Bluetooth device error during single read: {e}"
                )
            except Exception as e:
                print(f"An unexpected error occurred during single read: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="An error occurred while fetching data from the device."
                )
        
        # If loop finishes without returning a temperature
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="No complete temperature data received within timeout."
        )

    except bluetooth.BluetoothError as e:
        print(f"Bluetooth Connection Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not connect to device {address}. Make sure it's on and in range."
        )
    except Exception as e:
        print(f"An unexpected error occurred during initial connection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while setting up data stream from the device."
        )
    finally:
        print("Closing connection.")
        sock.close()
