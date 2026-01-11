import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCourt } from "../../../api/courts"
import type { Court } from "../../../types/court"

export default function CourtView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [court, setCourt] = useState<Court | null>(null)

  useEffect(() => {
    if (id) getCourt(Number(id)).then(setCourt)
  }, [id])

  if (!court) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de cancha</h1>

      <p><b>Nombre:</b> {court.name}</p>
      <p><b>Superficie:</b> {court.surface}</p>
      <p><b>Máx. jugadores:</b> {court.maxPlayers}</p>
      <p><b>Sucursal:</b> {court.branch?.name}</p>
      <p><b>Activa:</b> {court.active ? "Sí" : "No"}</p>
      <p><b>Ubicación:</b> {court.location || "-"}</p>
      <p><b>Notas:</b> {court.notes || "-"}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/courts/edit/${court.id}`)}>Editar</button>
        <button onClick={() => navigate("/courts")}>Volver</button>
      </div>
    </div>
  )
}
