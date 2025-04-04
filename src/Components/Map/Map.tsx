"use client"

import type React from "react"
import { useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "./Map.css"

mapboxgl.accessToken = "pk.eyJ1IjoiYXN0cm9ncjE2IiwiYSI6ImNtODRvaXRxcDEwdGUya29zdm9najY2YzYifQ.sYq3Wt4uufTQM0_CohRR0g"

interface Parcela {
  id: number
  nombre: string
  latitud: number
  longitud: number
  ubicacion?: string
  tipo_cultivo: string
  responsable: string
  ultimo_riego: string
  is_deleted?: number
  // Añadimos datos de sensores (estos podrían venir de otra fuente en una aplicación real)
  temperatura?: number
  humedad?: number
  lluvia?: number
  sol?: number
}

interface MapProps {
  parcelas: Parcela[]
}

const Map: React.FC<MapProps> = ({ parcelas }) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Inicializar el mapa solo si no existe
    if (!mapInstance) {
      try {
        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [-86.8918, 21.0619], // Coordenadas iniciales
          zoom: 12,
        })

        // Añadir controles de navegación
        map.addControl(new mapboxgl.NavigationControl(), "top-right")

        map.on("load", () => {
          setLoading(false)
          setMapInstance(map)
        })

        map.on("error", () => {
          setError("Error al cargar el mapa. Por favor, intente nuevamente.")
          setLoading(false)
        })

        // Limpiar al desmontar
        return () => {
          map.remove()
          setMapInstance(null)
        }
      } catch (err) {
        console.error("Error al inicializar el mapa:", err)
        setError("No se pudo inicializar el mapa. Verifique su conexión a internet.")
        setLoading(false)
      }
    }

    // Si ya existe el mapa, no hacer nada en este efecto
    return () => {}
  }, []) // Este efecto solo se ejecuta una vez al montar el componente

  // Efecto para actualizar los marcadores cuando cambian las parcelas o el mapa
  useEffect(() => {
    if (!mapInstance || !parcelas.length) return

    // Limpiar marcadores existentes
    const markers = document.querySelectorAll(".mapboxgl-marker")
    markers.forEach((marker) => marker.remove())

    console.log(`Añadiendo ${parcelas.length} marcadores al mapa`)

    // Crear marcadores para cada parcela
    const bounds = new mapboxgl.LngLatBounds()

    parcelas.forEach((parcela) => {
      // Asegurarse de que latitud y longitud sean números
      const lat = typeof parcela.latitud === "number" ? parcela.latitud : Number.parseFloat(String(parcela.latitud))
      const lng = typeof parcela.longitud === "number" ? parcela.longitud : Number.parseFloat(String(parcela.longitud))

      // Verificar que las coordenadas son válidas
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Parcela ${parcela.nombre} tiene coordenadas inválidas:`, parcela)
        return
      }

      // Generar datos aleatorios para demostración si no existen
      const temperatura = parcela.temperatura || Math.round((20 + Math.random() * 15) * 10) / 10
      const humedad = parcela.humedad || Math.round((40 + Math.random() * 50) * 10) / 10
      const lluvia = parcela.lluvia || Math.round(Math.random() * 30 * 10) / 10
      const sol = parcela.sol || Math.round((30 + Math.random() * 70) * 10) / 10

      // Crear el marcador
      new mapboxgl.Marker({
        color: "#e63946",
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <div class="parcela-popup">
            <h3>${parcela.nombre}</h3>
            <div class="parcela-popup-content">
              <p><strong>ID:</strong> ${parcela.id}</p>
              <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
              <p><strong>Responsable:</strong> ${parcela.responsable}</p>
              <p><strong>Último riego:</strong> ${new Date(parcela.ultimo_riego).toLocaleString()}</p>
              
              <!-- Datos de sensores -->
              <div class="sensor-data">
                <p><strong>Temperatura:</strong> ${temperatura}°C</p>
                <p><strong>Humedad:</strong> ${humedad}%</p>
                <p><strong>Lluvia:</strong> ${lluvia} mm</p>
                <p><strong>Intensidad Solar:</strong> ${sol} lux</p>
              </div>
              
              ${parcela.is_deleted !== undefined ? `<p><strong>Estado:</strong> ${parcela.is_deleted === 1 ? "Eliminada" : "Activa"}</p>` : ""}
            </div>
          </div>
        `),
        )
        .addTo(mapInstance)

      // Extender los límites para incluir esta parcela
      bounds.extend([lng, lat])
    })

    // Ajustar el mapa para mostrar todos los marcadores si hay parcelas
    if (parcelas.length > 0) {
      mapInstance.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })
    }
  }, [parcelas, mapInstance]) // Este efecto se ejecuta cuando cambian las parcelas o el mapa

  return (
    <div className="iot-map">
      <div id="map" style={{ width: "100%", height: "100%", minHeight: "300px" }}></div>

      {loading && (
        <div className="iot-map-loading">
          <div className="iot-map-loading-spinner"></div>
        </div>
      )}

      {error && (
        <div className="iot-map-error">
          <div className="iot-map-error-icon">!</div>
          <p className="iot-map-error-message">{error}</p>
          <button className="iot-map-error-button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      )}

      {(!parcelas || parcelas.length === 0) && !loading && !error && (
        <div className="no-parcelas-message">No hay parcelas activas para mostrar</div>
      )}
    </div>
  )
}

export default Map

