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
- **Backend:** FastAPI (Python) with a Large Language Model via Ollama using Gemma 3 model
- **Backend:** FastAPI (Python) with a Large Language Model via Ollama using a Gemma model
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
