from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

# Load the trained model and label encoder
model_path = "fsr_posture_model.pkl"  # Ensure the model is in the same folder
encoder_path = "label_encoder.pkl"  # Label encoder (optional)

model = joblib.load(model_path)
label_encoder = joblib.load(encoder_path)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (Allow all origins for testing, restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Define request body schema
class SensorData(BaseModel):
    fsr1: float
    fsr2: float
    fsr3: float
    fsr4: float
  

@app.post("/predict/")
async def predict_posture(data: SensorData):
    # Convert input data to NumPy array
    input_data = np.array([[data.fsr1, data.fsr2, data.fsr3, data.fsr4 ]])

    # Predict posture label
    predicted_label = model.predict(input_data)[0]
    
    # Convert encoded label to original posture name
    predicted_posture = label_encoder.inverse_transform([predicted_label])[0]

    return {"predicted_posture": predicted_posture}

# Run the API using Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)