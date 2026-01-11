import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getReservation } from "../../../api/reservations"

export default function ReservationView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [r, setR] = useState<any>(null)

  useEffect(() => {
    if (id) getReservation(Number(id)).then(setR)
  }, [id])

  if (!r) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de reserva</h1>

      <p><b>Título:</b> {r.title}</p>
      <p><b>Cancha:</b> {r.courtName}</p>
      <p><b>Inicio:</b> {r.startTime}</p>
      <p><b>Fin:</b> {r.endTime}</p>
      <p><b>Jugadores:</b> {r.players}</p>
      <p><b>Activa:</b> {r.active ? "Sí" : "No"}</p>
      <p><b>Notas:</b> {r.notes || "-"}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/reservations/edit/${r.id}`)}>Editar</button>
        <button onClick={() => navigate("/reservations")}>Volver</button>
      </div>
    </div>
  )
}
