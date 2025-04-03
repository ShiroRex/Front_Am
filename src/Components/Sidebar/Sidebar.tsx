"use client"

import type React from "react"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"
import { LayoutDashboard, BarChart3, Trash, LogOut, Wheat } from "lucide-react"
import "./sidebar.css"

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
  }

  return (
    <aside className="sidebar-container">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <div className="logo-container">
            <div className="logo-orbit">
              <div className="orbit-circle"></div>
            </div>
            <div className="logo-plant">
              <Wheat className="plant-icon" />
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <div className="icon-container">
              <LayoutDashboard className="nav-icon" />
            </div>
            <span className="link-text">Dashboard</span>
            {location.pathname === "/dashboard" && <div className="active-indicator"></div>}
          </Link>

          <Link to="/estadisticas" className={`sidebar-link ${location.pathname === "/estadisticas" ? "active" : ""}`}>
            <div className="icon-container">
              <BarChart3 className="nav-icon" />
            </div>
            <span className="link-text">Estadísticas</span>
            {location.pathname === "/estadisticas" && <div className="active-indicator"></div>}
          </Link>

          <Link
            to="/parcelasEliminadas"
            className={`sidebar-link ${location.pathname === "/parcelasEliminadas" ? "active" : ""}`}
          >
            <div className="icon-container">
              <Trash className="nav-icon" />
            </div>
            <span className="link-text">Parcelas Eliminadas</span>
            {location.pathname === "/parcelasEliminadas" && <div className="active-indicator"></div>}
          </Link>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-exit-btn" onClick={handleLogout}>
          <LogOut className="exit-icon" />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

