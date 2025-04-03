"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Dar tiempo para que se cargue el token
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isChecking) {
    // Mostrar un indicador de carga mientras se verifica
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/" replace />
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>
}

export default ProtectedRoute

