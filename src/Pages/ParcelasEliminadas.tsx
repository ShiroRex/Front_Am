import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ParcelasList from '../Components/ParcelaList/ParcelasList';
import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import '../Styles/ParcelasEliminadas.css';

const ParcelasEliminadas = () => {
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcelasEliminadas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/parcelas/eliminadas');
        setParcelas(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener las parcelas eliminadas:', error);
        setError('No se pudieron cargar las parcelas eliminadas. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchParcelasEliminadas();
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-main">
          <Header />
          <div className="dashboard-content">
            <div className="parcelas-eliminadas-container">
              <h1 className="parcelas-eliminadas-title">Parcelas Eliminadas</h1>
              <p className="parcelas-eliminadas-description">
                Historial de parcelas que fueron eliminadas
              </p>
              
              {error && (
                <div className="parcelas-eliminadas-error">
                  <div className="parcelas-eliminadas-error-icon">!</div>
                  <div className="parcelas-eliminadas-error-content">
                    <p className="parcelas-eliminadas-error-message">{error}</p>
                    <button 
                      className="parcelas-eliminadas-error-button"
                      onClick={() => {
                        setLoading(true);
                        setError(null);
                        // Reintentar la carga
                        axios.get('http://localhost:3001/parcelas/eliminadas')
                          .then(response => {
                            setParcelas(response.data);
                            setError(null);
                          })
                          .catch(error => {
                            console.error('Error al obtener las parcelas eliminadas:', error);
                            setError('No se pudieron cargar las parcelas eliminadas. Por favor, intente nuevamente.');
                          })
                          .finally(() => setLoading(false));
                      }}
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="parcelas-eliminadas-loading">
                  <div className="parcelas-eliminadas-loading-spinner"></div>
                  <p className="parcelas-eliminadas-loading-text">Cargando parcelas eliminadas...</p>
                </div>
              ) : (
                <div className="parcelas-eliminadas-content">
                  <ParcelasList parcelas={parcelas} />
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ParcelasEliminadas;