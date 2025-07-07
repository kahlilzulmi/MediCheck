# MediCheck - Smart Disease Prediction Website

MediCheck is an interactive web application designed to predict potential diseases based on user-provided symptoms. Utilizing a machine learning model, the system delivers real-time predictions accompanied by a confidence score that indicates the model's certainty.

## Key Features

- **Symptom Input in Bahasa Indonesia:** Allows users to input symptoms in Indonesian, with predictions returned instantly.
- **Confidence Scores:** Provides a confidence score for each prediction, reflecting the reliability of the results.
- **Detailed Disease Information:** Offers additional information on predicted diseases, including common symptoms, treatment options, and prevention tips.
- **User History (Login Required):** Maintains a history of user symptom checks and predictions, accessible after logging in.
- **Responsive Interface:** Features a user-friendly interface built with React and Tailwind CSS for optimal viewing on various devices.

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** FastAPI (Python 3.10) with a Large Language Model via Ollama using Gemma 3 model
- **Database:** MongoDB

## Language Support

Fully localized for Bahasa Indonesia input/output.

## Setup Instructions

1. **Download the Code:** Download the code as a ZIP archive.
2. **Extract the Archive:** Extract the contents of the ZIP folder to a location on your computer.
3. **Open in VS Code:** Open the extracted folder in Visual Studio Code using the command `code .`.
4. **Create Virtual Environment:** Open a terminal in VS Code and create a virtual environment using the command: `python -m venv .venv`.
5. **Activate Virtual Environment:** Activate the virtual environment by running: `.venv\Scripts\activate`.
6. **Install Dependencies:** Install the required Python dependencies from the `requirements.txt` file using: `pip install -r requirements.txt`.
7. **Run the Backend:** Start the FastAPI backend server with the command: `uvicorn app.main:app --reload`.
8. **Install Frontend Dependencies:** In a separate terminal, navigate to the project directory and install the required Node.js dependencies using: `npm install`.
9. **Run the Frontend:** Start the React frontend development server with the command: `npm run dev`.
10. **Install and Serve Ollama Model:** Ensure you have Ollama installed and the Gemma 3 model is available. Serve the model using `ollama serve`.

## ESP32 Temperature Sensor Setup

This project includes an Arduino IDE sketch for ESP32 to read temperature data from a DS18B20 sensor and transmit it via Bluetooth.

### Hardware Requirements

- ESP32 Development Board
- DS18B20 Temperature Sensor
- 4.7k Ohm Resistor (for DS18B20 pull-up)
- Jumper Wires

### Software Requirements

- Arduino IDE
- ESP32 Board Package for Arduino IDE
- Libraries:
      - `BluetoothSerial` (usually included with ESP32 board package)
      - `OneWire`
      - `DallasTemperature`

### Setup Steps

1. **Install Arduino IDE and ESP32 Board Package:**
   Follow the official Espressif guide to install the ESP32 board package in your Arduino IDE.

2. **Install Required Libraries:**
   In Arduino IDE, go to `Sketch > Include Library > Manage Libraries...` and search for and install:
   - `OneWire` by Paul Stoffregen
   - `DallasTemperature` by Miles Burton

3. **Wire the DS18B20 Sensor:**
   Connect the DS18B20 sensor to your ESP32 as follows:
   - **VCC:** Connect to 3.3V on ESP32
   - **GND:** Connect to GND on ESP32
   - **Data (DQ):** Connect to GPIO2 on ESP32 (as defined by `ONE_WIRE_BUS` in the sketch).
   - Place a 4.7k Ohm pull-up resistor between VCC and Data (DQ) line.

4. **Upload the Sketch:**
   - Open the `esp/sketch_jun12c_esp_proweb.ino` file in Arduino IDE.
   - Select your ESP32 board and the correct COM port from `Tools > Board` and `Tools > Port`.
   - Upload the sketch to your ESP32.

5. **Bluetooth Connection:**
   The ESP32 will broadcast itself as "Medicheck v1". You can connect to it via Bluetooth from your computer or another device to receive temperature readings. The temperature data will be sent over Bluetooth Serial.  

## Demo Video

[![Demo Pemrograman Web Kelompok 2](https://img.youtube.com/vi/wMEEadna3kM/0.jpg)](https://www.youtube.com/watch?v=wMEEadna3kM)

## Brought to you by

### Kelompok 2

Vladizya Vlaztadyandra (5049221002)  
Abdurrahman Mubarak (5049221005)  
Afifa Az Zahra Salsabila (5049221009)  
Kahlil Gibran Al Zulmi (5094221015)  
Annisa Azzahra Ramadhani (5049221019)  
  
Medical Technology  
Faculty of Medicine and Health  
Insitut Teknologi Sepuluh Nopember