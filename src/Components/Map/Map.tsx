"use client"

import type React from "react"
import { useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "./Map.css"

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

interface MapProps {
  parcelas: Parcela[]
}

const Map: React.FC<MapProps> = ({ parcelas }) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYXN0cm9ncjE2IiwiYSI6ImNtODRvaXRxcDEwdGUya29zdm9najY2YzYifQ.sYq3Wt4uufTQM0_CohRR0g"

    // Inicializar el mapa solo si no existe
    if (!mapInstance) {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-86.8918, 21.0619],
        zoom: 12,
      })

      // Añadir controles de navegación
      map.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Guardar la instancia del mapa
      setMapInstance(map)

      // Limpiar al desmontar
      return () => {
        map.remove()
        setMapInstance(null)
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
      // Verificar que las coordenadas son válidas
      if (!parcela.latitud || !parcela.longitud) {
        console.warn(`Parcela ${parcela.nombre} tiene coordenadas inválidas:`, parcela)
        return
      }

      console.log(`Añadiendo marcador para parcela: ${parcela.nombre} en ${parcela.latitud}, ${parcela.longitud}`)

      // Crear el marcador
      new mapboxgl.Marker({
        color: "#e63946",
      })
        .setLngLat([parcela.longitud, parcela.latitud])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <h3>${parcela.nombre}</h3>
          <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
          <p><strong>Responsable:</strong> ${parcela.responsable}</p>
          <p><strong>Último riego:</strong> ${new Date(parcela.ultimo_riego).toLocaleString()}</p>
        `),
        )
        .addTo(mapInstance)

      // Extender los límites para incluir esta parcela
      bounds.extend([parcela.longitud, parcela.latitud])
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
    <div id="map" className="iot-map">
      {(!parcelas || parcelas.length === 0) && (
        <div className="no-parcelas-message">No hay parcelas activas para mostrar</div>
      )}
    </div>
  )
}

export default Map

