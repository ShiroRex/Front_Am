import axios from "axios"

const API_URL = "http://localhost:3001"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 (no autorizado), limpiar el token y redirigir al login
      localStorage.removeItem("token")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

// Función para registrar un nuevo usuario
export const register = async (email: string, password: string, nombre?: string) => {
  try {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      nombre,
    })

    // Si el registro es exitoso y devuelve un token, lo guardamos
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }

    return response.data
  } catch (error) {
    console.error("Error en el registro:", error)
    throw error
  }
}

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    })

    // Guardar el token en localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }

    return response.data
  } catch (error) {
    console.error("Error en el login:", error)
    throw error
  }
}

// Función para obtener información del usuario actual
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/me")
    return response.data
  } catch (error) {
    console.error("Error obteniendo usuario actual:", error)
    throw error
  }
}

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem("token")
  // Opcional: redirigir al login
  window.location.href = "/"
}

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

// Nuevo método para obtener todos los datos desde el endpoint /api/dump
export const fetchAllData = async () => {
  try {
    const response = await api.get("/api/dump")
    return response.data
  } catch (error) {
    console.error("Error obteniendo datos completos", error)
    throw error
  }
}

export const getParcelas = async () => {
  try {
    // Ahora usamos el endpoint /api/dump y extraemos las parcelas
    const response = await fetchAllData()
    return response.parcelas || []
  } catch (error) {
    console.error("Error obteniendo las parcelas", error)
    throw error
  }
}

// Modificar la función fetchDatosGenerales para extraer correctamente los datos de sensores
export const fetchDatosGenerales = async () => {
  try {
    // Intentamos obtener los datos del último sensor desde el endpoint /api/dump
    const data = await fetchAllData()

    // Verificamos si hay datos históricos para extraer el último registro
    if (data && data.historico && data.historico.length > 0) {
      // Ordenamos por fecha descendente y tomamos el primer registro (el más reciente)
      const sortedHistorico = [...data.historico].sort(
        (a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime(),
      )

      const ultimoRegistro = sortedHistorico[0]

      return {
        data: {
          temperatura: Number(ultimoRegistro.temperatura),
          humedad: Number(ultimoRegistro.humedad),
          lluvia: Number(ultimoRegistro.lluvia),
          sol: Number(ultimoRegistro.sol),
          fecha: ultimoRegistro.fecha_registro,
        },
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching data:", error)
    return null
  }
}

export const getLecturas = async () => {
  try {
    // Obtenemos los datos históricos desde el endpoint /api/dump
    const data = await fetchAllData()
    return data.historico || []
  } catch (error) {
    console.error("Error obteniendo las lecturas", error)
    throw error
  }
}

export const getParcelasEliminadas = async () => {
  try {
    // Obtenemos todas las parcelas y filtramos las eliminadas
    const data = await fetchAllData()
    return data.parcelas ? data.parcelas.filter((p) => p.is_deleted === 1) : []
  } catch (error) {
    console.error("Error obteniendo las parcelas eliminadas", error)
    throw error
  }
}

export const actualizarParcelas = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/parcelas/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error actualizando las parcelas", error)
    throw error
  }
}

export const crearLecturaSensor = async (data: any) => {
  try {
    const response = await api.post("/api/sensor-lecturas", data)
    return response.data
  } catch (error) {
    console.error("Error creando lectura de sensor", error)
    throw error
  }
}

export default api

