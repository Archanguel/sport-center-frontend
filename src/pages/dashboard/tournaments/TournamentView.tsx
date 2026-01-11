import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTournament } from "../../../api/tournaments"

export default function TournamentView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [t, setT] = useState<any>(null)

  useEffect(() => {
    if (id) getTournament(Number(id)).then(setT)
  }, [id])

  if (!t) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de torneo</h1>

      <p><b>Nombre:</b> {t.name}</p>
      <p><b>Inicio:</b> {t.startDate}</p>
      <p><b>Fin:</b> {t.endDate}</p>
      <p><b>Cancha:</b> {t.court?.name}</p>
      <p><b>Activo:</b> {t.status ? "Sí" : "No"}</p>
      <p><b>Descripción:</b> {t.description || "-"}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/tournaments/edit/${t.id}`)}>Editar</button>
        <button onClick={() => navigate("/tournaments")}>Volver</button>
      </div>
    </div>
  )
}
