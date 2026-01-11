import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createReservation } from "../../../api/reservations"
import { getCourts } from "../../../api/courts"
import type { Court } from "../../../types/court"
import type { ReservationForm } from "../../../types/reservation"
import { toast } from "sonner"

export default function ReservationCreate() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const [form, setForm] = useState<ReservationForm>({
    title: "",
    startTime: "",
    endTime: "",
    players: 0,
    courtId: 0,
    notes: "",
    active: true
  })

  useEffect(() => {
    getCourts().then(setCourts)
  }, [])

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!form.courtId) {
      alert("Tenés que seleccionar una cancha")
      return
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      toast.error("La fecha de fin debe ser mayor al inicio")
      return
    }
    
    await createReservation({
      title: form.title,
      startTime: form.startTime,
      endTime: form.endTime,
      courtId: form.courtId,
      players: form.players,
      active: true,
      notes: form.notes
    })

    navigate("/reservations")
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Reserva</h1>

      <input name="title" placeholder="Título" onChange={handleChange} required />
      <input type="datetime-local" name="startTime" onChange={handleChange} required />
      <input type="datetime-local" name="endTime" onChange={handleChange} required />
      <input name="players" type="number" placeholder="Jugadores" onChange={handleChange} />

      <select name="courtId" onChange={handleChange} value={form.courtId} required>
        <option value="">Cancha</option>
        {courts.length > 0
          ? courts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))
          : <option disabled>No hay canchas</option>}
      </select>

      <textarea name="notes" placeholder="Notas" onChange={handleChange} />

      <button type="submit">Crear</button>
      <button
        type="button"
        className="px-3 py-1 border"
        onClick={() => navigate("/reservations")}
      >
        Cancelar
      </button>
    </form>
  )
}
