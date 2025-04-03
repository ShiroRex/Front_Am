import type React from "react"
import "./Card.css"
import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react"

interface CardProps {
  title: string
  value: string
  unit: string
  loading?: boolean
  icon?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, value, unit, loading = false, icon }) => {
  // Función para obtener el icono predeterminado según el título
  const getDefaultIcon = () => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("temperatura")) return <Thermometer className="iot-card-icon icon-temperature" />
    if (titleLower.includes("humedad")) return <Droplets className="iot-card-icon icon-humidity" />
    if (titleLower.includes("lluvia")) return <CloudRain className="iot-card-icon icon-rain" />
    if (titleLower.includes("sol") || titleLower.includes("intensidad"))
      return <Sun className="iot-card-icon icon-sun" />
    return null
  }

  return (
    <div className={`iot-card ${loading ? "loading" : ""}`}>
      <h3 className="iot-card-title">{title}</h3>
      {loading ? (
        <div className="iot-card-loading"></div>
      ) : value === "-1" ? (
        <p className="iot-card-error">Error</p>
      ) : (
        <>
          <p className="iot-card-value">
            <span className="iot-card-number">{value}</span>
            <span className="iot-card-unit">{unit}</span>
          </p>
          <div className="iot-card-icon-container">{icon || getDefaultIcon()}</div>
        </>
      )}
    </div>
  )
}

export default Card

