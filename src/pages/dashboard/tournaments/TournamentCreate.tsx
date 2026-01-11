import { useEffect, useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { getCourts } from "../../../api/courts"
import { createTournament } from "../../../api/tournaments"
import type { TournamentForm } from "../../../types/tournament"
import type { Court } from "../../../types/court"

type CourtOption = Pick<Court, "id" | "name">

export default function TournamentCreate() {
  const navigate = useNavigate()
  const [courts, setCourts] = useState<CourtOption[]>([]);
  const [form, setForm] = useState<TournamentForm>({
    name: "",
    startDate: "",
    endDate: "",
    status: true,
    description: "",
    courtId: "",
  });

  useEffect(() => {
    getCourts().then(setCourts);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createTournament({
      ...form,
      //courtId: Number(form.courtId),
    });
    navigate("/tournaments");
  }

  /*function update<K extends keyof TournamentCreate>(key: K, value: TournamentCreate[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }*/

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md flex flex-col gap-2">
      <h1 className="text-xl">Crear Torneo</h1>

      <input value={form.name} placeholder="Nombre" required
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

      <textarea value={form.description} placeholder="Descripción"
        onChange={e => setForm({ ...form, description: e.target.value })} />

      <select value={form.courtId} required
        onChange={e => setForm({ ...form, courtId: e.target.value })}>
        <option value="">Cancha</option>
        {courts.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button type="submit">Crear</button>
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
