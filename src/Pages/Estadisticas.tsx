"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import CombinedCharts from "../Components/Graficos/Charts"
import { Info } from "lucide-react"
import "../Styles/Estadisticas.css"

interface HistoricalData {
  id: number
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
  fecha: string
}

const StatisticsPage = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [tooltipInfo, setTooltipInfo] = useState<{ visible: boolean; id: string | null; text: string }>({
    visible: false,
    id: null,
    text: "",
  })

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("http://localhost:3001/datos-generales")
        setHistoricalData(response.data)
        setLastUpdate(new Date().toLocaleTimeString())
      } catch (err) {
        setError("Error al cargar datos históricos")
        console.error("Error fetching historical data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
    const interval = setInterval(fetchHistoricalData, 30000) // Actualizar cada 30 seg
    return () => clearInterval(interval)
  }, [])

  const processData = () => {
    if (historicalData.length === 0) {
      return {
        labels: [],
        temperatureData: [],
        humidityData: [],
        rainData: [],
        sunData: [],
      }
    }

    // Ordenar por fecha
    const sortedData = [...historicalData].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

    const labels = sortedData.map((item) =>
      new Date(item.fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    )

    return {
      labels,
      temperatureData: sortedData.map((item) => item.temperatura),
      humidityData: sortedData.map((item) => item.humedad),
      rainData: sortedData.map((item) => item.lluvia),
      sunData: sortedData.map((item) => item.sol),
    }
  }

  const handleInfoClick = (id: string, text: string) => {
    if (tooltipInfo.visible && tooltipInfo.id === id) {
      setTooltipInfo({ visible: false, id: null, text: "" })
    } else {
      setTooltipInfo({ visible: true, id, text })
    }
  }

  const { labels, temperatureData, humidityData, rainData, sunData } = processData()

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatureData,
        borderColor: "rgba(234, 84, 85, 1)",
        backgroundColor: "rgba(234, 84, 85, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Humedad (%)",
        data: humidityData,
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  }

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Lluvia (mm)",
        data: rainData,
        backgroundColor: "rgba(40, 167, 69, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Intensidad Solar (lux)",
        data: sunData,
        backgroundColor: "rgba(255, 193, 7, 0.7)",
        borderRadius: 4,
      },
    ],
  }

  // Calcular promedios actuales y valores de referencia
  const currentAvgTemp = temperatureData.length
    ? temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length
    : 0
  const currentAvgHum = humidityData.length ? humidityData.reduce((a, b) => a + b, 0) / humidityData.length : 0
  const currentAvgRain = rainData.length ? rainData.reduce((a, b) => a + b, 0) / rainData.length : 0
  const currentAvgSun = sunData.length ? sunData.reduce((a, b) => a + b, 0) / sunData.length : 0

  // Valores de referencia (podrían ser promedios históricos o valores ideales)
  const referenceTemp = 25 // Temperatura ideal de referencia
  const referenceHum = 60 // Humedad ideal de referencia
  const referenceRain = 5 // Lluvia promedio de referencia
  const referenceSun = 500 // Intensidad solar promedio de referencia

  const radarChartData = {
    labels: ["Temperatura (°C)", "Humedad (%)", "Lluvia (mm)", "Intensidad Solar (lux)"],
    datasets: [
      {
        label: "Valores Actuales",
        data: [currentAvgTemp, currentAvgHum, currentAvgRain, currentAvgSun],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Valores de Referencia",
        data: [referenceTemp, referenceHum, referenceRain, referenceSun],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <div className="statistics-container">
            {/* Añado el título y subtítulo aquí */}
            <div className="estadisticas-header">
              <h1 className="estadisticas-title">Estadísticas</h1>
              <p className="estadisticas-description">Análisis detallado representado por graficos</p>
              <div className="last-update-container">
                <span className="last-update">Última actualización: {lastUpdate}</span>
              </div>
            </div>

            {loading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Cargando datos...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <span className="error-icon">!</span>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
              </div>
            ) : (
              <>
                <div className="charts-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <h3>Variación de Temperatura y Humedad</h3>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "temp-humidity",
                              "Este gráfico muestra la variación de temperatura (°C) y humedad (%) a lo largo del tiempo. La temperatura se representa en rojo y la humedad en azul.",
                            )
                          }
                          aria-label="Información sobre el gráfico"
                        >
                          <Info size={18} />
                        </button>
                        {tooltipInfo.visible && tooltipInfo.id === "temp-humidity" && (
                          <div className="info-tooltip">{tooltipInfo.text}</div>
                        )}
                      </div>
                      <div className="chart-legend">
                        <span className="legend-temperature">
                          <i></i> Temperatura
                        </span>
                        <span className="legend-humidity">
                          <i></i> Humedad
                        </span>
                      </div>
                    </div>
                    <div className="chart-wrapper">
                      <CombinedCharts.Line data={lineChartData} />
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <h3>Lluvia e Intensidad Solar</h3>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "rain-sun",
                              "Este gráfico muestra la cantidad de lluvia (mm) y la intensidad solar (lux) registradas. La lluvia se representa en verde y la intensidad solar en amarillo.",
                            )
                          }
                          aria-label="Información sobre el gráfico"
                        >
                          <Info size={18} />
                        </button>
                        {tooltipInfo.visible && tooltipInfo.id === "rain-sun" && (
                          <div className="info-tooltip">{tooltipInfo.text}</div>
                        )}
                      </div>
                      <div className="chart-legend">
                        <span className="legend-rain">
                          <i></i> Lluvia
                        </span>
                        <span className="legend-sun">
                          <i></i> Intensidad Solar
                        </span>
                      </div>
                    </div>
                    <div className="chart-wrapper">
                      <CombinedCharts.Bar data={barChartData} />
                    </div>
                  </div>

                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <h3>Comparativa de Variables Climáticas</h3>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "radar",
                              "Este gráfico radar compara los valores actuales de temperatura, humedad, lluvia e intensidad solar con los valores de referencia ideales para el cultivo.",
                            )
                          }
                          aria-label="Información sobre el gráfico"
                        >
                          <Info size={18} />
                        </button>
                        {tooltipInfo.visible && tooltipInfo.id === "radar" && (
                          <div className="info-tooltip">{tooltipInfo.text}</div>
                        )}
                      </div>
                     
                    </div>
                    <div className="chart-wrapper">
                      <CombinedCharts.Radar data={radarChartData} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default StatisticsPage

