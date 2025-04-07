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

// Función para obtener todos los datos desde el endpoint /api/dump
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

// Modificar la función fetchDatosGenerales para obtener datos directamente de la API externa
export const fetchDatosGenerales = async () => {
  try {
    // Intentamos obtener los datos directamente del endpoint específico
    const response = await api.get("/api/datos-generales")
    const data = response.data

    console.log("Datos recibidos de /api/datos-generales:", data)

    // Verificar que los datos sean válidos
    if (data && data.data) {
      // Asegurarse de que todos los valores sean números válidos
      const temperatura =
        typeof data.data.temperatura === "number"
          ? data.data.temperatura
          : typeof data.data.temperatura === "string"
            ? Number.parseFloat(data.data.temperatura)
            : 0

      const humedad =
        typeof data.data.humedad === "number"
          ? data.data.humedad
          : typeof data.data.humedad === "string"
            ? Number.parseFloat(data.data.humedad)
            : 0

      const lluvia =
        typeof data.data.lluvia === "number"
          ? data.data.lluvia
          : typeof data.data.lluvia === "string"
            ? Number.parseFloat(data.data.lluvia)
            : 0

      const sol =
        typeof data.data.sol === "number"
          ? data.data.sol
          : typeof data.data.sol === "string"
            ? Number.parseFloat(data.data.sol)
            : 0

      return {
        status: data.status,
        data: {
          temperatura: isNaN(temperatura) ? 0 : temperatura,
          humedad: isNaN(humedad) ? 0 : humedad,
          lluvia: isNaN(lluvia) ? 0 : lluvia,
          sol: isNaN(sol) ? 0 : sol,
          fecha: data.data.fecha || new Date().toISOString(),
        },
        source: data.source,
      }
    }

    // Si no hay datos válidos, devolver valores 0
    return {
      status: "success",
      data: {
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
        fecha: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error al obtener datos generales:", error)
    // En caso de error, devolver un objeto con valores 0
    return {
      status: "error",
      data: {
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
        fecha: new Date().toISOString(),
      },
    }
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

// Modificar la función fetchZonasRiego para adaptarse al formato de la API externa
export const fetchZonasRiego = async () => {
  try {
    // Usar el endpoint local que emula los datos de la API externa
    // Agregar parámetros aleatorios para evitar caché
    const timestamp = new Date().getTime()
    const noCacheParam = Math.random().toString(36).substring(2, 15)

    console.log("Obteniendo datos de zonas de riego desde el backend local")

    const response = await api.get(`/api/zonas-riego?t=${timestamp}&nocache=${noCacheParam}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    // Verificar que la respuesta tenga el formato esperado (como la API externa)
    if (response.data && response.data.zonas && Array.isArray(response.data.zonas)) {
      console.log("Datos obtenidos correctamente del backend:", response.data.zonas)

      // Verificar si hay una zona TEST y mostrar su color
      const zonaTest = response.data.zonas.find((zona) => zona.sector === "TEST")
      if (zonaTest) {
        console.log(`Zona TEST encontrada - Color actual: ${zonaTest.color}`)
      }

      return response.data.zonas
    } else {
      console.error("Estructura de datos inesperada:", response.data)
      throw new Error("La estructura de datos recibida del backend no es válida")
    }
  } catch (error) {
    console.error("Error al obtener datos de zonas de riego:", error)
    throw new Error("No se pudieron obtener datos de zonas de riego")
  }
}

export default api

