import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
  
  export const register = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error("Error en el registro:", error)
      throw error
    }
  }
  
  export const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error("Error en el login:", error)
      throw error
    }
  }

export const getParcelas = async () => {
    try {
        const response = await api.get('/parcelas');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las parcelas', error);
        throw error;
    }
};

export const fetchDatosGenerales = async () => {
    try {
        const res = await axios.get(`${API_URL}/datos-generales/ultimo`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export const getLecturas = async () => {
    try {
        const response = await api.get('/sensor-lecturas');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las lecturas', error);
        throw error;
    }
};

export const getParcelasEliminadas = async () => {
    try {
        const response = await api.get('/parcelas/eliminadas');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las parcelas eliminadas', error);
        throw error;
    }
};

export const actualizarParcelas = async (id: number, data: any) => {
    try {
        const response = await api.put(`/parcelas/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error actualizando las parcelas', error);
        throw error;
    }
};

export const crearLecturaSensor = async (data: any) => {
    try {
        const response = await api.post('/sensor-lecturas', data);
        return response.data;
    } catch (error) {
        console.error('Error creando lectura de sensor', error);
        throw error;
    }
};

export default api;