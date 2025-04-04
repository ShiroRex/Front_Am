"use client"

import type React from "react"

import { useState } from "react"
import { Search, Droplets, Thermometer, Sun, Leaf, Filter } from "lucide-react"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import "../Styles/ValoresOptimos.css"

// Definición de tipos
interface CultivoOptimo {
  id: number
  nombre: string
  imagen: string
  temperaturaMin: number
  temperaturaMax: number
  humedadMin: number
  humedadMax: number
  lluviaOptima: number
  solOptima: number
  phSuelo: string
  cicloVida: string
  descripcion: string
}

// Datos de cultivos y sus valores óptimos
const cultivosData: CultivoOptimo[] = [
  {
    id: 1,
    nombre: "Arroz",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 20,
    temperaturaMax: 35,
    humedadMin: 70,
    humedadMax: 90,
    lluviaOptima: 200,
    solOptima: 75,
    phSuelo: "5.5 - 6.5",
    cicloVida: "3-6 meses",
    descripcion:
      "El arroz es un cultivo que requiere abundante agua y temperaturas cálidas. Prospera en suelos inundados y necesita alta humedad para su desarrollo óptimo.",
  },
  {
    id: 2,
    nombre: "Maíz",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 18,
    temperaturaMax: 32,
    humedadMin: 50,
    humedadMax: 80,
    lluviaOptima: 80,
    solOptima: 85,
    phSuelo: "5.5 - 7.5",
    cicloVida: "3-5 meses",
    descripcion:
      "El maíz es un cultivo versátil que se adapta a diferentes condiciones. Requiere buena exposición solar y suelos bien drenados con materia orgánica.",
  },
  {
    id: 3,
    nombre: "Tomate",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 15,
    temperaturaMax: 29,
    humedadMin: 60,
    humedadMax: 80,
    lluviaOptima: 60,
    solOptima: 80,
    phSuelo: "5.5 - 7.0",
    cicloVida: "3-4 meses",
    descripcion:
      "El tomate necesita temperaturas moderadas y buena exposición solar. Es sensible al exceso de humedad y requiere suelos bien drenados.",
  },
  {
    id: 4,
    nombre: "Frijol",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 16,
    temperaturaMax: 30,
    humedadMin: 45,
    humedadMax: 75,
    lluviaOptima: 50,
    solOptima: 70,
    phSuelo: "6.0 - 7.5",
    cicloVida: "2-4 meses",
    descripcion:
      "El frijol es un cultivo que fija nitrógeno en el suelo. Requiere temperaturas moderadas y es sensible tanto a la sequía como al exceso de humedad.",
  },
  {
    id: 5,
    nombre: "Chile Habanero",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 20,
    temperaturaMax: 35,
    humedadMin: 50,
    humedadMax: 70,
    lluviaOptima: 40,
    solOptima: 90,
    phSuelo: "6.0 - 7.0",
    cicloVida: "4-5 meses",
    descripcion:
      "El chile habanero prospera en climas cálidos con alta exposición solar. Requiere suelos bien drenados y es sensible al exceso de humedad.",
  },
  {
    id: 6,
    nombre: "Calabaza",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 18,
    temperaturaMax: 32,
    humedadMin: 60,
    humedadMax: 80,
    lluviaOptima: 70,
    solOptima: 75,
    phSuelo: "6.0 - 7.5",
    cicloVida: "3-4 meses",
    descripcion:
      "La calabaza necesita espacio para crecer y extenderse. Requiere suelos fértiles, bien drenados y exposición solar adecuada.",
  },
  {
    id: 7,
    nombre: "Naranja",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 13,
    temperaturaMax: 35,
    humedadMin: 40,
    humedadMax: 70,
    lluviaOptima: 120,
    solOptima: 85,
    phSuelo: "5.5 - 6.5",
    cicloVida: "Perenne",
    descripcion:
      "Los naranjos son árboles perennes que requieren climas cálidos y suelos bien drenados. Son sensibles a las heladas y necesitan buena exposición solar.",
  },
  {
    id: 8,
    nombre: "Lechuga",
    imagen: "/placeholder.svg?height=80&width=80",
    temperaturaMin: 10,
    temperaturaMax: 24,
    humedadMin: 60,
    humedadMax: 80,
    lluviaOptima: 45,
    solOptima: 60,
    phSuelo: "6.0 - 7.0",
    cicloVida: "1-3 meses",
    descripcion:
      "La lechuga prefiere climas frescos y húmedos. Es sensible al calor excesivo y requiere riego constante pero no encharcamiento.",
  },
]

const ValoresOptimos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCultivo, setSelectedCultivo] = useState<CultivoOptimo | null>(null)
  const [filteredCultivos, setFilteredCultivos] = useState(cultivosData)

  // Manejar búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredCultivos(cultivosData)
    } else {
      const filtered = cultivosData.filter((cultivo) => cultivo.nombre.toLowerCase().includes(term))
      setFilteredCultivos(filtered)
    }
  }

  // Seleccionar un cultivo para ver detalles
  const handleSelectCultivo = (cultivo: CultivoOptimo) => {
    setSelectedCultivo(cultivo)
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <div className="valores-optimos-container">
            <div className="valores-optimos-header">
              <h1 className="valores-optimos-title">Valores Óptimos por Cultivo</h1>
              <p className="valores-optimos-description">Consulta los parámetros ideales para cada tipo de cultivo</p>
            </div>

            {/* Barra de búsqueda */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar cultivo..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              <div className="search-results-count">
                Mostrando {filteredCultivos.length} de {cultivosData.length} cultivos
              </div>
            </div>

            <div className="cultivos-grid-container">
              {/* Lista de cultivos */}
              <div className="cultivos-list">
                <h2 className="cultivos-list-title">
                  <Leaf size={20} />
                  <span>Tipos de Cultivo</span>
                </h2>
                <div className="cultivos-grid">
                  {filteredCultivos.map((cultivo) => (
                    <div
                      key={cultivo.id}
                      className={`cultivo-card ${selectedCultivo?.id === cultivo.id ? "active" : ""}`}
                      onClick={() => handleSelectCultivo(cultivo)}
                    >
                      <div className="cultivo-card-image">
                        <img src={cultivo.imagen || "/placeholder.svg"} alt={cultivo.nombre} />
                      </div>
                      <div className="cultivo-card-content">
                        <h3>{cultivo.nombre}</h3>
                        <div className="cultivo-card-params">
                          <div className="cultivo-param">
                            <Thermometer size={16} />
                            <span>
                              {cultivo.temperaturaMin}°-{cultivo.temperaturaMax}°C
                            </span>
                          </div>
                          <div className="cultivo-param">
                            <Droplets size={16} />
                            <span>
                              {cultivo.humedadMin}%-{cultivo.humedadMax}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalles del cultivo seleccionado */}
              <div className="cultivo-details">
                {selectedCultivo ? (
                  <>
                    <div className="cultivo-details-header">
                      <div className="cultivo-details-image">
                        <img src={selectedCultivo.imagen || "/placeholder.svg"} alt={selectedCultivo.nombre} />
                      </div>
                      <div className="cultivo-details-title">
                        <h2>{selectedCultivo.nombre}</h2>
                        <p className="cultivo-details-cycle">Ciclo de vida: {selectedCultivo.cicloVida}</p>
                      </div>
                    </div>

                    <div className="cultivo-details-description">
                      <p>{selectedCultivo.descripcion}</p>
                    </div>

                    <h3 className="cultivo-details-section-title">Parámetros Óptimos</h3>

                    <div className="cultivo-details-params">
                      <div className="param-card">
                        <div className="param-icon temperature">
                          <Thermometer size={24} />
                        </div>
                        <div className="param-content">
                          <h4>Temperatura</h4>
                          <div className="param-value">
                            {selectedCultivo.temperaturaMin}° - {selectedCultivo.temperaturaMax}°C
                          </div>
                        </div>
                      </div>

                      <div className="param-card">
                        <div className="param-icon humidity">
                          <Droplets size={24} />
                        </div>
                        <div className="param-content">
                          <h4>Humedad</h4>
                          <div className="param-value">
                            {selectedCultivo.humedadMin}% - {selectedCultivo.humedadMax}%
                          </div>
                        </div>
                      </div>

                      <div className="param-card">
                        <div className="param-icon rain">
                          <Droplets size={24} />
                        </div>
                        <div className="param-content">
                          <h4>Lluvia Óptima</h4>
                          <div className="param-value">{selectedCultivo.lluviaOptima} mm/mes</div>
                        </div>
                      </div>

                      <div className="param-card">
                        <div className="param-icon sun">
                          <Sun size={24} />
                        </div>
                        <div className="param-content">
                          <h4>Exposición Solar</h4>
                          <div className="param-value">{selectedCultivo.solOptima}%</div>
                        </div>
                      </div>

                      <div className="param-card">
                        <div className="param-icon ph">
                          <Filter size={24} />
                        </div>
                        <div className="param-content">
                          <h4>pH del Suelo</h4>
                          <div className="param-value">{selectedCultivo.phSuelo}</div>
                        </div>
                      </div>
                    </div>

                    <div className="cultivo-details-recommendations">
                      <h3 className="cultivo-details-section-title">Recomendaciones</h3>
                      <ul className="recommendations-list">
                        <li>
                          Mantener la temperatura entre {selectedCultivo.temperaturaMin}°C y{" "}
                          {selectedCultivo.temperaturaMax}°C para un crecimiento óptimo.
                        </li>
                        <li>
                          La humedad relativa ideal debe estar entre {selectedCultivo.humedadMin}% y{" "}
                          {selectedCultivo.humedadMax}%.
                        </li>
                        <li>Asegurar un drenaje adecuado del suelo para evitar encharcamientos.</li>
                        <li>Monitorear regularmente los niveles de pH del suelo ({selectedCultivo.phSuelo}).</li>
                        <li>
                          Proporcionar una exposición solar adecuada (aproximadamente {selectedCultivo.solOptima}% del
                          día).
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="cultivo-details-placeholder">
                    <div className="placeholder-icon">
                      <Leaf size={48} />
                    </div>
                    <h3>Selecciona un cultivo</h3>
                    <p>Haz clic en uno de los cultivos para ver sus valores óptimos y recomendaciones.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default ValoresOptimos

