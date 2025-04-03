"use client"

import type React from "react"
import { useState } from "react"
import { register } from "../Services/api"
import { Link } from "react-router-dom"
import "../Styles/Register.css"
import { Sprout, Check, Circle } from "lucide-react"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    }
  }

  const sanitizeInput = (input: string) => input.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword)

    if (!validateEmail(sanitizedEmail)) {
      setError("Formato de correo inválido")
      return
    }

    const passwordValidation = validatePassword(sanitizedPassword)
    if (!Object.values(passwordValidation).every(Boolean)) {
      setError("La contraseña no cumple con todos los requisitos")
      return
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)
      const response = await register(sanitizedEmail, sanitizedPassword)
      console.log("Registro exitoso:", response)
      setSuccess("Usuario registrado exitosamente")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      setError("Error al registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  const passwordRequirements = validatePassword(password)

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Logo con icono de planta */}
        <div className="register-logo">
          <Sprout className="plant-icon" size={40} />
        </div>

        <h2 className="register-title">Registrar Usuario</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label className="register-form-label">Email</label>
            <input
              className="register-form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@gmail.com"
              maxLength={50}
            />
          </div>
          <div className="register-form-group">
            <label className="register-form-label">Contraseña</label>
            <input
              className="register-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              maxLength={20}
            />
            <ul className="password-requirements">
              <li className={passwordRequirements.length ? "valid" : "invalid"}>
                {passwordRequirements.length ? <Check size={12} /> : <Circle size={12} />} 6+ caracteres
              </li>
              <li className={passwordRequirements.lowercase ? "valid" : "invalid"}>
                {passwordRequirements.lowercase ? <Check size={12} /> : <Circle size={12} />} Minúscula
              </li>
              <li className={passwordRequirements.uppercase ? "valid" : "invalid"}>
                {passwordRequirements.uppercase ? <Check size={12} /> : <Circle size={12} />} Mayúscula
              </li>
              <li className={passwordRequirements.number ? "valid" : "invalid"}>
                {passwordRequirements.number ? <Check size={12} /> : <Circle size={12} />} Número
              </li>
              <li className={passwordRequirements.specialChar ? "valid" : "invalid"}>
                {passwordRequirements.specialChar ? <Check size={12} /> : <Circle size={12} />} Especial
              </li>
            </ul>
          </div>
          <div className="register-form-group">
            <label className="register-form-label">Confirmar Contraseña</label>
            <input
              className="register-form-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              maxLength={20}
            />
          </div>
          <button className="register-submit-btn" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
        {error && <p className="register-error-message">{error}</p>}
        {success && <p className="register-success-message">{success}</p>}

        <p className="register-redirect-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="register-redirect-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

