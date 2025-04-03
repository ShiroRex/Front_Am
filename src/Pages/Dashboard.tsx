"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import Card from "../Components/Cards/Card"
import Map from "../Components/Map/Map"
import "../Styles/Dashboard.css"

interface SensorData {
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
  fecha?: string
}

interface Parcela {
  id: number
  nombre: string
  latitud: number
  longitud: number
  ubicacion?: string
  tipo_cultivo: string
  responsable: string
  ultimo_riego: string
  eliminada?: boolean
}

const Dashboard = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [parcelasEliminadas, setParcelasEliminadas] = useState<Parcela[]>([])
  const [sensorData, setSensorData] = useState<SensorData>({
    temperatura: 0,
    humedad: 0,
    lluvia: 0,
    sol: 0,
  })
  const [lastUpdate, setLastUpdate] = useState<string>("No hay datos")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 1. Obtener datos de la API externa (todas las parcelas)
      const externalApiRes = await axios.get("https://moriahmkt.com/iotapp/updated/")
      console.log("Datos de API externa:", externalApiRes.data)

      // Extraer parcelas de la API externa
      const parcelasExternas = externalApiRes.data.parcelas || []

      // 2. Obtener parcelas eliminadas de la API local
      const parcelasEliminadasRes = await axios.get("http://localhost:3001/parcelas/eliminadas")
      console.log("Parcelas eliminadas:", parcelasEliminadasRes.data)

      // Guardar parcelas eliminadas
      setParcelasEliminadas(parcelasEliminadasRes.data)

      // 3. Obtener datos de sensores
      const sensorDataRes = await axios.get(`http://localhost:3001/datos-generales/ultimo?t=${Date.now()}`)

      console.log("Datos de sensores:", sensorDataRes.data)

      if (sensorDataRes.data && sensorDataRes.data.data) {
        setSensorData({
          temperatura: sensorDataRes.data.data.temperatura,
          humedad: sensorDataRes.data.data.humedad,
          lluvia: sensorDataRes.data.data.lluvia,
          sol: sensorDataRes.data.data.sol,
          fecha: sensorDataRes.data.data.fecha,
        })
      } else if (externalApiRes.data.sensores) {
        // Usar datos de sensores de la API externa si no hay datos locales
        setSensorData({
          temperatura: externalApiRes.data.sensores.temperatura,
          humedad: externalApiRes.data.sensores.humedad,
          lluvia: externalApiRes.data.sensores.lluvia,
          sol: externalApiRes.data.sensores.sol,
        })
      }

      // Guardar todas las parcelas de la API externa
      setParcelas(parcelasExternas)

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Error al obtener datos:", err)
      setError(err.message || "Error al cargar los datos")
      setSensorData({
        temperatura: -1,
        humedad: -1,
        lluvia: -1,
        sol: -1,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filtrar parcelas para excluir las eliminadas
  const filtrarParcelasActivas = () => {
    // Si no hay parcelas eliminadas, devolver todas las parcelas
    if (!parcelasEliminadas.length) return parcelas

    // Crear un conjunto con los IDs de las parcelas eliminadas para búsqueda eficiente
    const idsEliminados = new Set(parcelasEliminadas.map((p) => p.id))

    // Filtrar las parcelas que no están en el conjunto de eliminadas
    return parcelas.filter((parcela) => !idsEliminados.has(parcela.id))
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchData}>Reintentar</button>
      </div>
    )
  }

  // Obtener solo las parcelas activas para el mapa
  const parcelasActivas = filtrarParcelasActivas()
  console.log("Parcelas activas para mostrar en el mapa:", parcelasActivas)

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-description">Bienvendio al panel de control</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-map-container">
              {/* Pasar solo las parcelas activas al mapa */}
              <Map parcelas={parcelasActivas} />
            </div>

            <div className="dashboard-cards-container">
              <div className="dashboard-cards-grid">
                <Card title="Temperatura" value={sensorData.temperatura.toFixed(1)} unit="°C" loading={isLoading} />
                <Card title="Humedad" value={sensorData.humedad.toFixed(1)} unit="%" loading={isLoading} />
                <Card title="Lluvia" value={sensorData.lluvia.toFixed(1)} unit="mm" loading={isLoading} />
                <Card title="Intensidad del Sol" value={sensorData.sol.toFixed(1)} unit="lux" loading={isLoading} />
              </div>

              <div className="dashboard-status">
                <p>Última actualización: {lastUpdate}</p>
                {sensorData.fecha && <p>Datos registrados: {new Date(sensorData.fecha).toLocaleString()}</p>}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Dashboard

