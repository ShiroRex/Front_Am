"use client"

import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import "./App.css"
import Estadisticas from "./Pages/Estadisticas"
import ParcelasEliminadas from "./Pages/ParcelasEliminadas"
import { AuthProvider, useAuth } from "./Context/AuthContext"
import { useEffect } from "react"

// Componente para redirigir a login si no está autenticado
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Si no está autenticado, redirigir a login guardando la ubicación actual
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

// Separamos las rutas en un componente para poder usar el hook useAuth
const AppRoutes = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Efecto para verificar la autenticación en cada cambio de ruta
  useEffect(() => {
    // Si intenta acceder a una ruta protegida sin autenticación, redirigir a login
    if (!isAuthenticated && location.pathname !== "/" && location.pathname !== "/register") {
      window.location.href = "/"
    }
  }, [location, isAuthenticated])

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/estadisticas"
        element={
          <RequireAuth>
            <Estadisticas />
          </RequireAuth>
        }
      />

      <Route
        path="/parcelasEliminadas"
        element={
          <RequireAuth>
            <ParcelasEliminadas />
          </RequireAuth>
        }
      />

      {/* Ruta por defecto si no coincide con ninguna */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

