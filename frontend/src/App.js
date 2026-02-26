import React, { useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {

  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    current: "",
    voltage: "",
    hours: ""
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error("Erro ao prever:", error);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/history");
      setHistory(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  const chartData = {
    labels: history.map((item, index) => `Predição ${index + 1}`),
    datasets: [
      {
        label: "Probabilidade de Falha (%)",
        data: history.map(item => item.probability * 100),
        borderColor: "red",
        fill: false
      }
    ]
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sistema de Manutenção Preditiva</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-3"
          type="float"
          name="temperature"
          placeholder="Temperatura (°C)"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="float"
          name="vibration"
          placeholder="Vibração (mm/s)"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="float"
          name="current"
          placeholder="Corrente (A)"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="float"
          name="voltage"
          placeholder="Tensão (V)"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="float"
          name="hours"
          placeholder="Horas de Operação"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary">
          Prever Falha
        </button>

      </form>

      <button
        className="btn btn-secondary mt-3"
        onClick={getHistory}
      >
        Ver Histórico
      </button>

      {result && (
        <div className="mt-4 alert alert-info">
          <h4>Resultado:</h4>

          <p>
            <strong>Risco:</strong>{" "}
            <span className={
              result.risk === "Alto"
                ? "text-danger"
                : "text-success"
            }>
              {result.risk}
            </span>
          </p>

          <p>
            <strong>Probabilidade:</strong>{" "}
            {(result.probability * 100).toFixed(2)}%
          </p>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${result.probability * 100}%` }}
            >
              {(result.probability * 100).toFixed(2)}%
            </div>
          </div>

        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h4>Histórico de Probabilidade</h4>
          <Line data={chartData} />
        </div>
      )}

    </div>
  );
}

export default App;