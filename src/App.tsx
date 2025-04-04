"use client"

import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import "./App.css"
import Estadisticas from "./Pages/Estadisticas"
import ParcelasEliminadas from "./Pages/ParcelasEliminadas"
import ValoresOptimos from "./Pages/ValoresOptimos"
import { AuthProvider, useAuth } from "./Context/AuthContext"

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
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          <Route
            path="/valoresOptimos"
            element={
              <RequireAuth>
                <ValoresOptimos />
              </RequireAuth>
            }
          />

          {/* Ruta por defecto si no coincide con ninguna */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

