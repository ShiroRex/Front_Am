"use client"

import type React from "react"
import { useState } from "react"
import { login } from "../Services/api"
import { Link, useNavigate } from "react-router-dom"
import "../Styles/Login.css"
import { useAuth } from "../Context/AuthContext"
import { Sprout } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
    return passwordRegex.test(password)
  }

  const sanitizeInput = (input: string) => {
    return input.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)

    if (!validateEmail(sanitizedEmail)) {
      setError("Formato de correo inválido")
      return
    }

    if (!validatePassword(sanitizedPassword)) {
      setError(
        "Contraseña incorrecta.",
      )
      return
    }

    try {
      setLoading(true)
      const response = await login(sanitizedEmail, sanitizedPassword)
      console.log("Login exitoso:", response)

      authLogin(response.token)
      navigate("/dashboard")
    } catch (error) {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo con icono de planta */}
        <div className="login-logo">
          <Sprout className="plant-icon" size={40} />
        </div>

        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-form-label">Email</label>
            <input
              className="login-form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={50}
              placeholder="usuario@gmail.com"
            />
          </div>
          <div className="login-form-group">
            <label className="login-form-label">Contraseña</label>
            <input
              className="login-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={20}
              placeholder="••••••••"
            />
          </div>
          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        {error && <p className="login-error-message">{error}</p>}

        <p className="login-redirect-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="login-redirect-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

