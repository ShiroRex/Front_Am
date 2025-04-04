"use client"

import { useEffect, useState } from "react"
import { Info, Clock, BarChart2, Droplets, Thermometer, Sun } from 'lucide-react'
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import CombinedCharts from "../Components/Graficos/Charts"
import { fetchAllData } from "../services/api"
import "../Styles/Estadisticas.css"

interface HistoricalData {
  id: number
  parcela_id: number
  fecha_registro: string
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
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
  // Estado para controlar cuántos registros mostrar
  const [recordsToShow, setRecordsToShow] = useState<number>(10)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener todos los datos desde el endpoint
        const allData = await fetchAllData()

        // Extraer datos históricos
        if (allData.historico) {
          console.log("Datos históricos obtenidos:", allData.historico.length)
          setHistoricalData(allData.historico)
        } else {
          console.error("No se encontraron datos históricos en la respuesta")
          setHistoricalData([])
        }

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

    // Ordenar por fecha (más reciente primero)
    const sortedData = [...historicalData].sort(
      (a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime(),
    )

    // Tomar solo los últimos N registros (los más recientes)
    const limitedData = sortedData.slice(0, recordsToShow)

    // Invertir para mostrar en orden cronológico (más antiguo primero)
    const chronologicalData = [...limitedData].reverse()

    const labels = chronologicalData.map((item) =>
      new Date(item.fecha_registro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    )

    return {
      labels,
      temperatureData: chronologicalData.map((item) => Number(item.temperatura)),
      humidityData: chronologicalData.map((item) => Number(item.humedad)),
      rainData: chronologicalData.map((item) => Number(item.lluvia)),
      sunData: chronologicalData.map((item) => Number(item.sol)),
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

  // Colores en tonos amarillos para la aplicación
  const primaryYellow = "rgba(217, 164, 0, 1)"; // #d9a400
  const secondaryYellow = "rgba(247, 201, 72, 1)"; // #f7c948
  const lightYellow = "rgba(255, 236, 179, 1)"; // #ffecb3
  const accentTeal = "rgba(13, 211, 224, 1)"; // #0dd3e0

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatureData,
        borderColor: primaryYellow,
        backgroundColor: "rgba(217, 164, 0, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: primaryYellow,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: primaryYellow,
        pointHoverBorderWidth: 3,
        fill: true,
      },
      {
        label: "Humedad (%)",
        data: humidityData,
        borderColor: accentTeal,
        backgroundColor: "rgba(13, 211, 224, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: accentTeal,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: accentTeal,
        pointHoverBorderWidth: 3,
        fill: true,
      },
    ],
  }

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Lluvia (mm)",
        data: rainData,
        backgroundColor: "rgba(13, 211, 224, 0.8)",
        borderColor: accentTeal,
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: accentTeal,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: "Intensidad Solar (lux)",
        data: sunData,
        backgroundColor: "rgba(247, 201, 72, 0.8)",
        borderColor: secondaryYellow,
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: secondaryYellow,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  }

  // Calcular promedios actuales y valores de referencia
  const currentAvgTemp = temperatureData.length
    ? temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length
    : 0
  const currentAvgHum = humidityData.length 
    ? humidityData.reduce((a, b) => a + b, 0) / humidityData.length 
    : 0
  const currentAvgRain = rainData.length 
    ? rainData.reduce((a, b) => a + b, 0) / rainData.length 
    : 0
  const currentAvgSun = sunData.length 
    ? sunData.reduce((a, b) => a + b, 0) / sunData.length 
    : 0

  // Valores máximos para cada variable
  const maxTemp = 40 // Temperatura máxima en °C
  const maxHum = 100 // Humedad máxima en %
  const maxRain = 50 // Lluvia máxima en mm
  const maxSun = 100 // Intensidad solar máxima en lux

  // Datos para el gráfico de área polar
  const polarAreaData = {
    labels: ["Temperatura (°C)", "Humedad (%)", "Lluvia (mm)", "Intensidad Solar (lux)"],
    datasets: [
      {
        data: [
          Number.parseFloat(((currentAvgTemp / maxTemp) * 100).toFixed(1)),
          Number.parseFloat(((currentAvgHum / maxHum) * 100).toFixed(1)),
          Number.parseFloat(((currentAvgRain / maxRain) * 100).toFixed(1)),
          Number.parseFloat(((currentAvgSun / maxSun) * 100).toFixed(1)),
        ],
        backgroundColor: [
          primaryYellow, // Amarillo para temperatura
          accentTeal, // Turquesa para humedad
          "rgba(13, 211, 224, 0.7)", // Turquesa para lluvia
          secondaryYellow, // Amarillo para intensidad solar
        ],
        borderColor: [primaryYellow, accentTeal, accentTeal, secondaryYellow],
        borderWidth: 1,
        // Valores originales y máximos para mostrar en la leyenda y tooltips
        maxValues: [maxTemp, maxHum, maxRain, maxSun],
        originalValues: [
          Number.parseFloat(currentAvgTemp.toFixed(1)),
          Number.parseFloat(currentAvgHum.toFixed(1)),
          Number.parseFloat(currentAvgRain.toFixed(1)),
          Number.parseFloat(currentAvgSun.toFixed(1)),
        ],
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
            <div className="estadisticas-header">
              <h1 className="estadisticas-title">Estadísticas</h1>
              <p className="estadisticas-description">Análisis detallado representado por graficos</p>
              <div className="last-update-container">
                <span className="last-update">
                  <Clock size={16} />
                  Última actualización: {lastUpdate}
                </span>
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
                {/* Selector de registros mejorado */}
                <div className="records-selector-container">
                  <div className="records-selector-label">
                    <BarChart2 size={18} />
                    <span>Mostrar últimos:</span>
                  </div>
                  <div className="records-selector-buttons">
                    <button 
                      className={recordsToShow === 10 ? "active" : ""} 
                      onClick={() => setRecordsToShow(10)}
                    >
                      10
                    </button>
                    <button 
                      className={recordsToShow === 20 ? "active" : ""} 
                      onClick={() => setRecordsToShow(20)}
                    >
                      20
                    </button>
                    <button 
                      className={recordsToShow === 50 ? "active" : ""} 
                      onClick={() => setRecordsToShow(50)}
                    >
                      50
                    </button>
                    <button 
                      className={recordsToShow === 100 ? "active" : ""} 
                      onClick={() => setRecordsToShow(100)}
                    >
                      100
                    </button>
                    <button 
                      className={recordsToShow === historicalData.length ? "active" : ""} 
                      onClick={() => setRecordsToShow(historicalData.length)}
                    >
                      Todos
                    </button>
                  </div>
                  <div className="records-info">
                    Mostrando {Math.min(recordsToShow, historicalData.length)} de {historicalData.length} registros
                  </div>
                </div>

                <div className="charts-grid">
                  {/* Gráfica de Temperatura y Humedad */}
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <div className="chart-title-with-icon">
                          <div className="chart-icon temperature-humidity-icon">
                            <Thermometer size={20} />
                            <Droplets size={20} />
                          </div>
                          <h3>Variación de Temperatura y Humedad</h3>
                        </div>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "temp-humidity",
                              "Este gráfico muestra la variación de temperatura (°C) y humedad (%) a lo largo del tiempo. La temperatura se representa en amarillo y la humedad en turquesa."
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
                        <span className="legend-item temperature">
                          <i></i> Temperatura
                        </span>
                        <span className="legend-item humidity">
                          <i></i> Humedad
                        </span>
                      </div>
                    </div>
                    <div className="chart-wrapper">
                      <CombinedCharts.Line data={lineChartData} />
                    </div>
                  </div>

                  {/* Gráfica de Lluvia e Intensidad Solar */}
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <div className="chart-title-with-icon">
                          <div className="chart-icon rain-sun-icon">
                            <Droplets size={20} />
                            <Sun size={20} />
                          </div>
                          <h3>Lluvia e Intensidad Solar</h3>
                        </div>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "rain-sun",
                              "Este gráfico muestra la cantidad de lluvia (mm) y la intensidad solar (lux) registradas. La lluvia se representa en turquesa y la intensidad solar en amarillo."
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
                        <span className="legend-item rain">
                          <i></i> Lluvia
                        </span>
                        <span className="legend-item sun">
                          <i></i> Intensidad Solar
                        </span>
                      </div>
                    </div>
                    <div className="chart-wrapper">
                      <CombinedCharts.Bar data={barChartData} />
                    </div>
                  </div>

                  {/* Gráfico de área polar (tercera gráfica) */}
                  <div className="chart-card full-width">
                    <div className="chart-header">
                      <div className="chart-title-container">
                        <div className="chart-title-with-icon">
                          <div className="chart-icon polar-icon">
                            <BarChart2 size={20} />
                          </div>
                          <h3>Niveles Actuales vs. Máximos</h3>
                        </div>
                        <button
                          className="info-button"
                          onClick={() =>
                            handleInfoClick(
                              "polar-area",
                              "Este gráfico muestra los valores actuales de cada variable climática en relación con sus valores máximos. Cada sector representa el porcentaje del valor máximo alcanzado por cada variable."
                            )
                          }
                          aria-label="Información sobre el gráfico"
                        >
                          <Info size={18} />
                        </button>
                        {tooltipInfo.visible && tooltipInfo.id === "polar-area" && (
                          <div className="info-tooltip">{tooltipInfo.text}</div>
                        )}
                      </div>
                    </div>
                    <div className="chart-wrapper polar-chart-wrapper">
                      <CombinedCharts.PolarArea data={polarAreaData} />
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
