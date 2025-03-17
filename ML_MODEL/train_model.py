import pandas as pd
import numpy as np
import joblib  # For saving the model
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# 1. Load dataset
file_path = r"./fsr_data1.csv"  # Updated Path
df = pd.read_csv(file_path)

# 2. Select FSR features and target variable
X = df[['fsr1', 'fsr2', 'fsr3', 'fsr4']].values  # Input Features (FSR values)
y = df['posture'].values  # Target Variable (Posture)

# 3. Encode posture labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)  # Convert Posture labels to numbers
joblib.dump(label_encoder, "./label_encoder.pkl")  # Updated Path

# 4. Split data into Train and Test sets (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train a Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# 7. Save trained model
joblib.dump(model, "./fsr_posture_model.pkl")  # Updated Path

print("Training completed. Model and label encoder saved successfully!")