import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getReservation, updateReservation } from "../../../api/reservations"
import { getCourts } from "../../../api/courts"
import type { ReservationForm } from "../../../types/reservation"
import type { Court } from "../../../types/court"

export default function ReservationEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [courts, setCourts] = useState<Court[]>([])
  const [form, setForm] = useState<ReservationForm | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([getCourts(), getReservation(Number(id))]).then(([c, r]) => {
      setCourts(c);
      setForm({
        title: r.title,
        startTime: r.startTime,
        endTime: r.endTime,
        players: r.players,
        courtId: r.courtId,
        notes: r.notes || "",
        active: r.active
      });
    });
  }, [id])

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => prev && { ...prev, [name]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id || !form) return;
    
    await updateReservation(Number(id), {
      title: form.title,
      startTime: form.startTime,
      endTime: form.endTime,
      players: Number(form.players),
      courtId: Number(form.courtId),
      notes: form.notes,
      active: form.active
    });

    navigate("/reservations");
  }

  if (!form) return null

  return (
    <form onSubmit={handleSubmit}>
      <h1>Editar Reserva</h1>

      <input name="title" value={form.title} onChange={handleChange} required />
      <input
        type="datetime-local"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
        required
      />
      <input name="players" value={form.players} onChange={handleChange} />
      <select name="courtId" value={form.courtId} onChange={handleChange} required>
        {courts.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.active}
          onChange={e => setForm({ ...form, active: e.target.checked })}
        />
        Activa
      </label>
      <textarea name="notes" value={form.notes} onChange={handleChange} />

      <button type="submit">Guardar</button>
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
