import os
from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load ML artifacts
model = joblib.load("model.pkl")
le = joblib.load("label_encoder.pkl")
symptoms = joblib.load("symptoms.pkl")

# Load CSV files (Make sure these exist in the same directory!)
dfD = pd.read_csv("symptom_Description.csv")
dfP = pd.read_csv("symptom_precaution.csv")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    selected_symptoms = data.get("symptoms", [])

    input_data = pd.DataFrame([[0]*len(symptoms)], columns=symptoms)

    for s in selected_symptoms:
        if s in input_data.columns:
            input_data.loc[0, s] = 1

    pred = model.predict(input_data)
    disease = le.inverse_transform(pred)[0]

    description = dfD[dfD["Disease"] == disease]["Description"].iloc[0]

    prec_row = dfP[dfP["Disease"] == disease].iloc[0]
    precautions = [
        prec_row["Precaution_1"],
        prec_row["Precaution_2"],
        prec_row["Precaution_3"],
        prec_row["Precaution_4"]
    ]

    return jsonify({
        "disease": disease,
        "about": description,
        "precautions": precautions
    })

if __name__ == "__main__":
    # Listen on 0.0.0.0 so Render can route traffic to it
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)