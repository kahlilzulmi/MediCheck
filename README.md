## MediCheck – Smart Disease Prediction Website
MediCheck is an interactive web application that allows users to predict potential diseases based on their input symptoms. Powered by a machine learning model, the system provides real-time predictions along with a confidence score that reflects the model’s certainty.
## Key Features:
1. Symptom input in Indonesia Languages, with predictions returned in real-time.
2. Confidence score for each prediction to indicate reliability.
3. Additional information on the predicted disease, including common symptoms, treatment options, and prevention tips.
4. History of user symptom checks and predictions, login required.
5. Responsive, user-friendly interface built with React and Tailwind CSS.
## Tech Stack:
- Frontend: React.js (Vite), Tailwind CSS
- Backend: FastAPI (Python) with a Large Language Model via Ollama using Gemma 3 model
- Database: MongoDB
## Language support: 
Fully localized for Bahasa Indonesia input/output

## Instructions
1. Donwload code zip
2. extract the zip folder
3. Open terminal, make virtual environment. Type `python -m venv venv`
4. Activate the virtual environment. Type `venv\Scripts\activate`
5. In virtual environment, Install required dependencies. Type `pip install -r requirements.txt`
6. Run the backend using `uvicorn app.main:app --reload`
7. Running the Frontend using other cmd. Type `npm install`
8. Type `npm run dev`


