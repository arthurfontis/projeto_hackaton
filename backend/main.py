from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

from database import engine, SessionLocal
from models import Base, Prediction

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")

class MotorData(BaseModel):
    temperature: float
    vibration: float
    current: float
    voltage: float
    hours: float

@app.get("/")
def read_root():
    return {"message": "API de Manutenção Preditiva rodando"}

@app.post("/predict")
def predict(data: MotorData):

    input_data = pd.DataFrame([{
        "temperature": data.temperature,
        "vibration": data.vibration,
        "current": data.current,
        "voltage": data.voltage,
        "hours": data.hours
    }])

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    risk = "Alto" if prediction == 1 else "Baixo"

    db = SessionLocal()

    new_prediction = Prediction(
        temperature=data.temperature,
        vibration=data.vibration,
        current=data.current,
        voltage=data.voltage,
        hours=data.hours,
        risk=risk,
        probability=float(probability)
    )

    db.add(new_prediction)
    db.commit()
    db.close()

    return {
        "risk": risk,
        "probability": float(probability)
    }

@app.get("/history")
def get_history():
    db = SessionLocal()
    predictions = db.query(Prediction).all()
    db.close()
    return predictions

@app.delete("/history")
def clear_history():
    db = SessionLocal()
    db.query(Prediction).delete()
    db.commit()
    db.close()
    return {"message": "Histórico apagado com sucesso"}
