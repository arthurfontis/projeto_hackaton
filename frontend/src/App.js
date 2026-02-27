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
import "./App.css";

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

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData
    );

    setResult(response.data);
    getHistory();
  };

  const getHistory = async () => {
    const response = await axios.get("http://127.0.0.1:8000/history");
    setHistory(response.data);
  };

  const clearHistory = async () => {
    await axios.delete("http://127.0.0.1:8000/history");
    setHistory([]);
  };

  const chartData = {
    labels: history.map((item, index) => `#${index + 1}`),
    datasets: [
      {
        label: "Probabilidade de Falha (%)",
        data: history.map(item => item.probability * 100),
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255,77,77,0.2)",
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#fff" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" }
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="main-wrapper">
      <div className="dashboard">

        <h2 className="title">
          🔧 Sistema de Manutenção Preditiva
        </h2>

        <div className="card">
          <form onSubmit={handleSubmit}>

            <div className="grid-inputs">

              <input type="float" step="any" name="temperature" placeholder="Temperatura (°C)" onChange={handleChange} required />
              <input type="float" step="any" name="vibration" placeholder="Vibração (mm/s)" onChange={handleChange} required />
              <input type="float" step="any" name="current" placeholder="Corrente (A)" onChange={handleChange} required />
              <input type="float" step="any" name="voltage" placeholder="Tensão (V)" onChange={handleChange} required />
              <input type="float" step="any" name="hours" placeholder="Horas de Operação" onChange={handleChange} required />

            </div>

            <button className="btn-primary">
              Prever Falha
            </button>

          </form>
        </div>

        {result && (
          <div className="card result-card">
            <h4>Status do Motor</h4>

            <h2 style={{ color: result.risk === "Alto" ? "#ff4d4d" : "#28a745" }}>
              {result.risk}
            </h2>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${result.probability * 100}%`,
                  backgroundColor: result.risk === "Alto" ? "#ff4d4d" : "#28a745"
                }}
              >
                {(result.probability * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="card">
            <div className="history-header">
              <h5>Histórico de Predições</h5>
              <button className="btn-danger" onClick={clearHistory}>
                Limpar Histórico
              </button>
            </div>

            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
