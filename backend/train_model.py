import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
import joblib

np.random.seed(42)
n_samples = 3000 

data = {
    "temperature": np.random.normal(75, 12, n_samples),
    "vibration": np.random.normal(3.5, 1.2, n_samples),
    "current": np.random.normal(11, 3, n_samples),
    "voltage": np.random.normal(220, 8, n_samples),
    "hours": np.random.normal(6000, 2500, n_samples)
}

df = pd.DataFrame(data)

df["risk_score"] = (
    df["temperature"] * 0.4 + 
    df["vibration"] * 6.0 + 
    df["current"] * 0.5 + 
    (df["hours"] / 1000) * 2.0 
)

def get_probs(score):
    mean = score.mean()
    std = score.std()
    return 1 / (1 + np.exp(-(score - mean) / (std * 0.5)))

df["prob_real"] = get_probs(df["risk_score"])

df["failure"] = np.random.binomial(1, df["prob_real"])

X = df[["temperature", "vibration", "current", "voltage", "hours"]]
y = df["failure"]

base_rf = RandomForestClassifier(
    n_estimators=200, 
    max_depth=6, 
    random_state=42
)

calibrated_model = CalibratedClassifierCV(base_rf, method='sigmoid', cv=5)
calibrated_model.fit(X, y)

joblib.dump(calibrated_model, "model.pkl")

print("--- Treinamento Concluído ---")
print(f"Exemplos de falhas geradas: {df['failure'].sum()} de {n_samples}")
print("Modelo salvo como 'model.pkl' com saída de probabilidade calibrada.")