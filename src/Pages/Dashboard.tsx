"use client"

import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import Card from "../Components/Cards/Card"
import Map from "../Components/Map/Map"
import "../Styles/Dashboard.css"
import { fetchAllData, fetchDatosGenerales } from "../services/api"

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
  is_deleted: number
}

const Dashboard = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
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

      // Obtener todos los datos desde el nuevo endpoint /api/dump
      const allData = await fetchAllData()
      console.log("Datos completos:", allData)

      // Extraer parcelas
      if (allData.parcelas) {
        setParcelas(allData.parcelas)
      }

      // Obtener datos de sensores usando la función actualizada
      const sensorDataRes = await fetchDatosGenerales()
      console.log("Datos de sensores:", sensorDataRes)

      if (sensorDataRes && sensorDataRes.data) {
        setSensorData({
          temperatura: sensorDataRes.data.temperatura,
          humedad: sensorDataRes.data.humedad,
          lluvia: sensorDataRes.data.lluvia,
          sol: sensorDataRes.data.sol,
          fecha: sensorDataRes.data.fecha,
        })
      } else {
        // Si no hay datos de sensores, establecer valores predeterminados
        setSensorData({
          temperatura: 0,
          humedad: 0,
          lluvia: 0,
          sol: 0,
        })
      }

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err: any) {
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
    return parcelas.filter((parcela) => parcela.is_deleted === 0)
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

