import { useEffect, useState, FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTournament, updateTournament } from "../../../api/tournaments"
import { getCourts } from "../../../api/courts"
import type { TournamentForm } from "../../../types/tournament"
import type { Court } from "../../../types/court"

type CourtOption = Pick<Court, "id" | "name">

export default function TournamentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [courts, setCourts] = useState<CourtOption[]>([]);
  const [form, setForm] = useState<TournamentForm | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([getTournament(Number(id)), getCourts()])
      .then(([t, c]) => {
        setCourts(c);
        setForm({
          name: t.name,
          startDate: t.startDate,
          endDate: t.endDate,
          status: true,
          description: t.description,
          courtId: String(t.court.id),
        });
      });
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id || !form) return;

    await updateTournament(Number(id), {
      ...form,
      //courtId: Number(form.courtId),
    });

    navigate("/tournaments");
  }

  if (!form) return null

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md flex flex-col gap-2">
      <h1 className="text-xl">Editar Torneo</h1>

      <input value={form.name} required
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input type="datetime-local" value={form.startDate} required
        onChange={e => setForm({ ...form, startDate: e.target.value })} />

      <input type="datetime-local" value={form.endDate} required
        onChange={e => setForm({ ...form, endDate: e.target.value })} />

      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={form.status}
          onChange={e => setForm({ ...form, status: true })}
        />
        Activo
      </label>

      <textarea value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />

      <select value={form.courtId}
        onChange={e => setForm({ ...form, courtId: e.target.value })}>
        {courts.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button type="submit">Guardar</button>
      <button
        type="button"
        className="px-3 py-1 border"
        onClick={() => navigate("/tournaments")}
      >
        Cancelar
      </button>
    </form>
  )
}
