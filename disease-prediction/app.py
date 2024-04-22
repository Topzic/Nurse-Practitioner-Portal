# https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning
# Disease Prediction Using Machine Learning
import keras
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from keras.models import Sequential
from keras.layers import Dense
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow CORS for all origins

# Load the data
data = pd.read_csv("Training.csv")

# Preprocess the data
data = data.drop(["Unnamed: 133"], axis=1)
X = data.drop("prognosis", axis=1)
y = data["prognosis"]

# Encode the target labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Split the data into training and testing sets
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the deep learning model
model = Sequential()
model.add(Dense(128, input_dim=X_train.shape[1], activation="relu"))
model.add(Dense(64, activation="relu"))
model.add(Dense(len(label_encoder.classes_), activation="softmax"))  # Output layer with softmax activation

# Compile the model
model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# Train the model
model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=10, batch_size=32, verbose=1)

# Save the model
keras.saving.save_model(model, "disease_prediction_model.h5")

# Function to predict disease given input symptoms
def predict_disease(input_symptoms):
    input_symptoms = np.array(input_symptoms).reshape(1, -1)  # Reshape input for prediction
    prediction = model.predict(input_symptoms)
    predicted_class = np.argmax(prediction)
    predicted_disease = label_encoder.classes_[predicted_class]
    return predicted_disease

# Define the Flask route for handling OPTIONS requests to /predict
@app.route('/predict', methods=['OPTIONS'])
def handle_options():
    return '', 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
    }

# Define the Flask route for prediction
@app.route('/predict', methods=['POST'])
@cross_origin()
def make_prediction():
    # Get the input data from the request
    input_data = request.json

    # Extract symptoms from the input data
    input_symptoms = list(input_data.values())

    # Make prediction
    predicted_disease = predict_disease(input_symptoms)

    # Return the predicted disease
    return jsonify({'predicted_disease': predicted_disease})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
