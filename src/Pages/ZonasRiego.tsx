"use client"

import { useEffect, useState, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { MapPin, Droplet, AlertTriangle, Info, Calendar, PenToolIcon as Tool, RefreshCw } from "lucide-react"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import { fetchZonasRiego } from "../services/api"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "../Styles/ZonasRiego.css"

// Configurar el token de acceso de Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoiYXN0cm9ncjE2IiwiYSI6ImNtODRvaXRxcDEwdGUya29zdm9najY2YzYifQ.sYq3Wt4uufTQM0_CohRR0g"

// Definición de tipos
interface ZonaRiego {
  id: number
  sector: string
  nombre: string
  tipo_riego: string
  estado: string
  latitud: number | null
  longitud: number | null
  motivo: string | null
  fecha: string
  color: string
}

// Mapeo de estados a nombres más amigables en español
const estadosMap: Record<string, string> = {
  encendido: "Encendido",
  apagado: "Apagado",
  mantenimiento: "En Mantenimiento",
  descompuesto: "Descompuesto",
  fuera_de_servicio: "Fuera de Servicio",
}

// Colores para el gráfico de estados
const ESTADO_COLORS: Record<string, string> = {
  encendido: "#4CAF50",
  apagado: "#607D8B",
  mantenimiento: "#FFC107",
  descompuesto: "#F44336",
  fuera_de_servicio: "#9C27B0",
}

// Función para verificar si las coordenadas están demasiado cerca
const ajustarCoordenadas = (zonas: ZonaRiego[]): ZonaRiego[] => {
  // Si hay menos de 2 zonas, no es necesario ajustar
  if (zonas.length < 2) return zonas

  const zonasAjustadas = [...zonas]
  const distanciaMinima = 0.001 // Aproximadamente 100 metros

  // Verificar cada par de zonas
  for (let i = 0; i < zonasAjustadas.length; i++) {
    for (let j = i + 1; j < zonasAjustadas.length; j++) {
      const zonaA = zonasAjustadas[i]
      const zonaB = zonasAjustadas[j]

      // Si alguna zona no tiene coordenadas, continuar
      if (!zonaA.latitud || !zonaA.longitud || !zonaB.latitud || !zonaB.longitud) continue

      // Calcular distancia entre puntos
      const dx = zonaA.longitud - zonaB.longitud
      const dy = zonaA.latitud - zonaB.latitud
      const distancia = Math.sqrt(dx * dx + dy * dy)

      // Si están demasiado cerca, ajustar la segunda zona
      if (distancia < distanciaMinima) {
        // Calcular ángulo aleatorio para dispersar
        const angulo = Math.random() * Math.PI * 2
        const distanciaAjuste = distanciaMinima + Math.random() * 0.001

        // Ajustar coordenadas de la segunda zona
        zonasAjustadas[j] = {
          ...zonaB,
          longitud: zonaB.longitud + Math.cos(angulo) * distanciaAjuste,
          latitud: zonaB.latitud + Math.sin(angulo) * distanciaAjuste,
        }
      }
    }
  }

  return zonasAjustadas
}

const ZonasRiego = () => {
  const [zonas, setZonas] = useState<ZonaRiego[]>([])
  const [selectedZona, setSelectedZona] = useState<ZonaRiego | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("No hay datos")
  const [activeTab, setActiveTab] = useState<string>("mapa")

  // Referencias para el mapa
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const zonasData = await fetchZonasRiego()
        console.log("Zonas de riego:", zonasData)

        if (zonasData && zonasData.length > 0) {
          // Ajustar coordenadas para evitar superposición
          const zonasAjustadas = ajustarCoordenadas(zonasData)
          setZonas(zonasAjustadas)
        } else {
          setError("No se encontraron zonas de riego")
        }

        setLastUpdate(new Date().toLocaleString())
      } catch (err: any) {
        console.error("Error al obtener zonas de riego:", err)
        setError(err.message || "Error al cargar los datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // Solo cargar una vez al montar el componente

  // Inicializar el mapa cuando se cargan las zonas y el componente está montado
  useEffect(() => {
    if (isLoading || !zonas.length || activeTab !== "mapa" || !mapContainer.current) return

    // Si el mapa ya está inicializado, no lo volvemos a crear
    if (map.current) return

    // Encontrar coordenadas válidas para centrar el mapa
    const validZonas = zonas.filter((zona) => zona.latitud && zona.longitud)
    if (!validZonas.length) {
      setError("No hay coordenadas válidas para mostrar en el mapa")
      return
    }

    // Modificar la parte donde se calculan las coordenadas para el centro del mapa
    // para asegurar que los marcadores no estén demasiado juntos

    // Calcular el centro del mapa y los límites para ajustar el zoom
    const bounds = new mapboxgl.LngLatBounds()

    validZonas.forEach((zona) => {
      if (zona.longitud && zona.latitud) {
        bounds.extend([zona.longitud, zona.latitud])
      }
    })

    // Inicializar el mapa con los límites calculados
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12", // Estilo más similar a la imagen
      bounds: bounds,
      padding: 50,
      fitBoundsOptions: { padding: 100 },
    })

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.current.addControl(new mapboxgl.FullscreenControl())
    map.current.addControl(new mapboxgl.ScaleControl())

    // Añadir marcadores cuando el mapa se cargue
    map.current.on("load", () => {
      addMarkersToMap()
    })

    // Limpiar el mapa cuando el componente se desmonte
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      // Limpiar los marcadores
      Object.values(markers.current).forEach((marker) => marker.remove())
      markers.current = {}
    }
  }, [isLoading, zonas, activeTab])

  // Función para añadir marcadores al mapa
  const addMarkersToMap = () => {
    if (!map.current) return

    // Limpiar marcadores existentes
    Object.values(markers.current).forEach((marker) => marker.remove())
    markers.current = {}

    // Añadir nuevos marcadores
    zonas.forEach((zona) => {
      if (!zona.latitud || !zona.longitud) return

      // Crear elemento HTML personalizado para el marcador
      const el = document.createElement("div")
      el.className = "mapbox-marker"

      // Verificar si es la zona TEST y mostrar su color
      if (zona.sector === "TEST") {
        console.log(`Renderizando zona TEST con color: ${zona.color}`)
      }

      // Crear SVG para el pin con el color específico de la zona
      // Asegurarse de que el color se tome directamente de la API sin modificaciones
      const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="${zona.color}" stroke="black" strokeWidth="2">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>
`

      // Establecer el SVG como fondo
      el.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg)}')`

      // Añadir el sector como texto dentro del marcador
      el.innerHTML += `<span>${zona.sector}</span>`
      el.title = zona.nombre

      if (selectedZona?.id === zona.id) {
        el.classList.add("selected")
      }

      // Crear y añadir el marcador
      const marker = new mapboxgl.Marker(el).setLngLat([zona.longitud, zona.latitud]).addTo(map.current)

      // Añadir evento de clic
      el.addEventListener("click", () => {
        setSelectedZona(zona)

        // Actualizar estilos de marcadores
        Object.values(markers.current).forEach((m) => {
          const element = m.getElement()
          element.classList.remove("selected")
        })
        el.classList.add("selected")

        // Centrar el mapa en el marcador seleccionado
        map.current?.flyTo({
          center: [zona.longitud, zona.latitud],
          zoom: 16,
          duration: 1000,
        })
      })

      // Guardar referencia al marcador
      markers.current[zona.id] = marker
    })
  }

  // Actualizar marcadores cuando cambia la zona seleccionada
  useEffect(() => {
    if (!map.current) return

    Object.values(markers.current).forEach((marker) => {
      const element = marker.getElement()
      element.classList.remove("selected")
    })

    if (selectedZona && markers.current[selectedZona.id]) {
      const element = markers.current[selectedZona.id].getElement()
      element.classList.add("selected")
    }
  }, [selectedZona])

  // Filtrar zonas con problemas (mantenimiento, descompuesto, fuera_de_servicio)
  const zonasConProblemas = zonas.filter((zona) =>
    ["mantenimiento", "descompuesto", "fuera_de_servicio"].includes(zona.estado),
  )

  // Preparar datos para el gráfico circular
  const prepararDatosGrafico = () => {
    const conteoEstados: Record<string, number> = {}

    zonas.forEach((zona) => {
      if (!conteoEstados[zona.estado]) {
        conteoEstados[zona.estado] = 0
      }
      conteoEstados[zona.estado]++
    })

    return Object.keys(conteoEstados).map((estado) => ({
      name: estadosMap[estado] || estado,
      value: conteoEstados[estado],
      estado: estado,
    }))
  }

  const datosGrafico = prepararDatosGrafico()

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="zonas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos de zonas de riego...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="zonas-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <div className="zonas-riego-container">
            <div className="zonas-riego-header">
              <h1 className="zonas-riego-title">Zonas de Riego</h1>
              <p className="zonas-riego-description">Monitoreo y gestión de zonas de riego automatizado</p>
              {/* Modificar el botón de recarga para que sea más visible y funcional */}
              <div className="last-update-container">
                <span className="last-update">
                  <Calendar size={16} />
                  Última actualización: {lastUpdate}
                </span>
                <button
                  className="refresh-button"
                  onClick={() => {
                    setIsLoading(true)
                    // Forzar recarga completa de los datos
                    fetchZonasRiego()
                      .then((data) => {
                        if (data && data.length > 0) {
                          console.log("Datos recargados correctamente:", data)
                          // Buscar la zona TEST para verificar su color
                          const zonaTest = data.find((zona) => zona.sector === "TEST")
                          if (zonaTest) {
                            console.log(`Zona TEST recargada - Color: ${zonaTest.color}`)
                          }

                          const zonasAjustadas = ajustarCoordenadas(data)
                          setZonas(zonasAjustadas)

                          // Forzar recreación de marcadores
                          if (map.current) {
                            // Limpiar marcadores existentes
                            Object.values(markers.current).forEach((marker) => marker.remove())
                            markers.current = {}

                            // Recrear marcadores con los nuevos datos
                            setTimeout(() => {
                              addMarkersToMap()
                            }, 100)
                          }

                          setLastUpdate(new Date().toLocaleString())
                        }
                      })
                      .catch((err) => {
                        console.error("Error al recargar:", err)
                        setError(err.message || "Error al recargar los datos")
                      })
                      .finally(() => {
                        setIsLoading(false)
                      })
                  }}
                >
                  <RefreshCw size={16} /> Recargar datos
                </button>
              </div>
            </div>

            {/* Tabs de navegación */}
            <div className="zonas-tabs">
              <button
                className={`tab-button ${activeTab === "mapa" ? "active" : ""}`}
                onClick={() => setActiveTab("mapa")}
              >
                <MapPin size={18} />
                Mapa de Zonas
              </button>
              <button
                className={`tab-button ${activeTab === "problemas" ? "active" : ""}`}
                onClick={() => setActiveTab("problemas")}
              >
                <AlertTriangle size={18} />
                Zonas con Problemas ({zonasConProblemas.length})
              </button>
              <button
                className={`tab-button ${activeTab === "estadisticas" ? "active" : ""}`}
                onClick={() => setActiveTab("estadisticas")}
              >
                <Info size={18} />
                Estadísticas
              </button>
            </div>

            {/* Contenido según la pestaña activa */}
            <div className="tab-content">
              {/* Mapa de Zonas */}
              {activeTab === "mapa" && (
                <div className="mapa-zonas-container">
                  <div className="mapa-wrapper">
                    {/* Contenedor del mapa de Mapbox */}
                    <div ref={mapContainer} className="mapbox-container" />
                  </div>

                  {/* Panel de detalles de la zona seleccionada */}
                  <div className="zona-details-panel">
                    {selectedZona ? (
                      <>
                        <div className="zona-details-header" style={{ backgroundColor: selectedZona.color }}>
                          <h3>{selectedZona.nombre}</h3>
                          <span className="zona-sector">{selectedZona.sector}</span>
                        </div>
                        <div className="zona-details-content">
                          <div className="zona-detail-item">
                            <span className="detail-label">Estado:</span>
                            <span className={`detail-value estado-${selectedZona.estado}`}>
                              {estadosMap[selectedZona.estado] || selectedZona.estado}
                            </span>
                          </div>
                          <div className="zona-detail-item">
                            <span className="detail-label">Tipo de Riego:</span>
                            <span className="detail-value">
                              <Droplet size={16} className="detail-icon" />
                              {selectedZona.tipo_riego}
                            </span>
                          </div>
                          {selectedZona.motivo && (
                            <div className="zona-detail-item">
                              <span className="detail-label">Motivo:</span>
                              <span className="detail-value">{selectedZona.motivo}</span>
                            </div>
                          )}
                          <div className="zona-detail-item">
                            <span className="detail-label">Última Actualización:</span>
                            <span className="detail-value">{formatearFecha(selectedZona.fecha)}</span>
                          </div>
                          <div className="zona-detail-item">
                            <span className="detail-label">Coordenadas:</span>
                            <span className="detail-value">
                              {selectedZona.latitud ? selectedZona.latitud.toFixed(6) : "N/A"},
                              {selectedZona.longitud ? selectedZona.longitud.toFixed(6) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="zona-details-placeholder">
                        <MapPin size={48} />
                        <p>Selecciona una zona en el mapa para ver sus detalles</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Zonas con Problemas */}
              {activeTab === "problemas" && (
                <div className="zonas-problemas-container">
                  <h2 className="section-title">
                    <AlertTriangle size={20} />
                    Zonas con Problemas
                  </h2>

                  {zonasConProblemas.length === 0 ? (
                    <div className="no-problemas-message">
                      <p>No hay zonas con problemas actualmente.</p>
                    </div>
                  ) : (
                    <div className="problemas-grid">
                      {zonasConProblemas.map((zona) => (
                        <div key={zona.id} className="problema-card">
                          <div className="problema-card-header" style={{ backgroundColor: zona.color }}>
                            <h3>{zona.nombre}</h3>
                            <span className="zona-sector">{zona.sector}</span>
                          </div>
                          <div className="problema-card-content">
                            <div className="problema-estado">
                              <span className={`estado-badge estado-${zona.estado}`}>
                                {estadosMap[zona.estado] || zona.estado}
                              </span>
                            </div>
                            <div className="problema-detail">
                              <Tool size={16} className="detail-icon" />
                              <span className="detail-label">Motivo:</span>
                              <span className="detail-value">{zona.motivo || "No especificado"}</span>
                            </div>
                            <div className="problema-detail">
                              <Calendar size={16} className="detail-icon" />
                              <span className="detail-label">Desde:</span>
                              <span className="detail-value">{formatearFecha(zona.fecha)}</span>
                            </div>
                            <div className="problema-detail">
                              <Droplet size={16} className="detail-icon" />
                              <span className="detail-label">Tipo de Riego:</span>
                              <span className="detail-value">{zona.tipo_riego}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Estadísticas */}
              {activeTab === "estadisticas" && (
                <div className="zonas-estadisticas-container">
                  <div className="estadisticas-grid">
                    <div className="estadisticas-card">
                      <h2 className="section-title">
                        <Info size={20} />
                        Distribución por Estado
                      </h2>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={datosGrafico}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {datosGrafico.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ESTADO_COLORS[entry.estado] || "#000000"} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any) => [`${value} zonas`, "Cantidad"]}
                              labelFormatter={(label) => `Estado: ${label}`}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="estadisticas-card">
                      <h2 className="section-title">
                        <Info size={20} />
                        Resumen de Zonas
                      </h2>
                      <div className="resumen-container">
                        <div className="resumen-item">
                          <div className="resumen-value">{zonas.length}</div>
                          <div className="resumen-label">Total de Zonas</div>
                        </div>
                        <div className="resumen-item">
                          <div className="resumen-value">{zonas.filter((z) => z.estado === "encendido").length}</div>
                          <div className="resumen-label">Zonas Encendidas</div>
                        </div>
                        <div className="resumen-item">
                          <div className="resumen-value">{zonas.filter((z) => z.estado === "apagado").length}</div>
                          <div className="resumen-label">Zonas Apagadas</div>
                        </div>
                        <div className="resumen-item">
                          <div className="resumen-value">{zonasConProblemas.length}</div>
                          <div className="resumen-label">Zonas con Problemas</div>
                        </div>
                      </div>

                      <div className="tipos-riego-container">
                        <h3>Tipos de Riego</h3>
                        <div className="tipos-riego-grid">
                          {Object.entries(
                            zonas.reduce((acc: Record<string, number>, zona) => {
                              acc[zona.tipo_riego] = (acc[zona.tipo_riego] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([tipo, cantidad]) => (
                            <div key={tipo} className="tipo-riego-item">
                              <Droplet size={16} className="tipo-icon" />
                              <span className="tipo-nombre">{tipo}:</span>
                              <span className="tipo-cantidad">{cantidad}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default ZonasRiego

