from fastapi import FastAPI
import joblib
import numpy as np

# Load trained model and label encoder
model = joblib.load("./fsr_posture_model.pkl")
label_encoder = joblib.load("./label_encoder.pkl")

# FastAPI app
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Posture Prediction API is running!"}

@app.post("/predict/")
def predict_posture(fsr1: float, fsr2: float, fsr3: float, fsr4: float):
    # Prepare input for model
    input_data = np.array([[fsr1, fsr2, fsr3, fsr4]])
    
    # Predict posture (numeric value)
    prediction = model.predict(input_data)[0]

    # Convert encoded label back to posture name
    predicted_posture = label_encoder.inverse_transform([prediction])[0]

    return {"predicted_posture": predicted_posture}