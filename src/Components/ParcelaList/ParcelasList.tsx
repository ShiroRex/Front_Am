import "./ParcelasList.css"

const ParcelasList = ({ parcelas }: any) => {
  // Función para formatear la fecha correctamente
  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "No disponible"

      return date.toLocaleDateString() + " " + date.toLocaleTimeString().slice(0, 5)
    } catch (error) {
      return "No disponible"
    }
  }

  return (
    <div className="parcelas-list-container">
      {parcelas.length === 0 ? (
        <div className="parcelas-list-empty">
          <div className="parcelas-list-empty-icon">❌</div>
          <h3 className="parcelas-list-empty-title">En este momento no hay parcelas eliminadas</h3>
        </div>
      ) : (
        <table className="parcelas-list-table">
          <thead className="parcelas-list-header">
            <tr className="parcelas-list-header-row">
              <th className="parcelas-list-header-cell">Nombre</th>
              <th className="parcelas-list-header-cell">Responsable</th>
              <th className="parcelas-list-header-cell">Ubicación</th>
              <th className="parcelas-list-header-cell">Tipo Cultivo</th>
              <th className="parcelas-list-header-cell">Último Riego</th>
            </tr>
          </thead>
          <tbody className="parcelas-list-body">
            {parcelas.map((parcela: any) => (
              <tr key={parcela.id} className="parcelas-list-row">
                <td className="parcelas-list-cell parcelas-list-name">{parcela.nombre}</td>
                <td className="parcelas-list-cell parcelas-list-responsable">{parcela.responsable}</td>
                <td className="parcelas-list-cell parcelas-list-ubicacion">{parcela.ubicacion}</td>
                <td className="parcelas-list-cell parcelas-list-tipo-cultivo">{parcela.tipo_cultivo}</td>
                <td className="parcelas-list-cell parcelas-list-date">{formatDate(parcela.ultimo_riego)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ParcelasList

