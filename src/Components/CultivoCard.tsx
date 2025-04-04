"use client"

import { Thermometer, Droplets } from "lucide-react"

interface CultivoCardProps {
  id: number
  nombre: string
  imagen: string
  temperaturaMin: number
  temperaturaMax: number
  humedadMin: number
  humedadMax: number
  isActive: boolean
  onClick: () => void
}

const CultivoCard = ({
  id,
  nombre,
  imagen,
  temperaturaMin,
  temperaturaMax,
  humedadMin,
  humedadMax,
  isActive,
  onClick,
}: CultivoCardProps) => {
  return (
    <div className={`cultivo-card ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="cultivo-card-image">
        <img src={imagen || "/placeholder.svg"} alt={nombre} />
      </div>
      <div className="cultivo-card-content">
        <h3>{nombre}</h3>
        <div className="cultivo-card-params">
          <div className="cultivo-param">
            <Thermometer size={16} />
            <span>
              {temperaturaMin}°-{temperaturaMax}°C
            </span>
          </div>
          <div className="cultivo-param">
            <Droplets size={16} />
            <span>
              {humedadMin}%-{humedadMax}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CultivoCard

