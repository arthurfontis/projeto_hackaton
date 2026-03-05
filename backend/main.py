from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

from database import engine, SessionLocal
from models import Base, Prediction

app = FastAPI(title="Sistema de Manutenção Preditiva", version="1.0.0")

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

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <html>
        <head>
            <title>API - Manutenção Preditiva</title>
            <style>
                body {
                    font-family: Arial;
                    background-color: #1c1f26;
                    color: white;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #4CAF50;
                }
                .card {
                    background: #2a2f3a;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px auto;
                    width: 50%;
                }
                a {
                    color: #4CAF50;
                    text-decoration: none;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>🔧 Sistema de Manutenção Preditiva</h1>
            <div class="card">
                <p>API desenvolvida para previsão de falhas em motores industriais.</p>
                <p><strong>Endpoints disponíveis:</strong></p>
                <p>POST /predict → Realiza previsão</p>
                <p>GET /history → Lista histórico</p>
                <p>DELETE /history → Limpa histórico</p>
                <p>GET /docs → Documentação Swagger</p>
            </div>
            <div class="card">
                <p>Acesse a documentação interativa:</p>
                <a href="/docs">Abrir Swagger UI</a>
            </div>
        </body>
    </html>
    """

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

@app.get("/status")
def status():
    return {
        "status": "online",
        "model_loaded": True,
        "version": "1.0.0"
    }