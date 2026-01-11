import { useEffect, useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createCourt } from "../../../api/courts"
import { getBranches } from "../../../api/branches"
import type { Branch } from "../../../types/branch"
import type { CourtForm } from "../../../types/court"

export default function CourtCreate() {
  const [form, setForm] = useState<CourtForm>({
    name: "",
    surface: "",
    maxPlayers: 0,
    active: true,
    location: "",
    notes: "",
    branchId: 0
  })
  
  const [branches, setBranches] = useState<Branch[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getBranches().then(setBranches)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const { branchId, ...data } = form
    await createCourt(data, branchId)
    navigate("/courts")
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md flex flex-col gap-2">
      <h1 className="text-xl">Crear Cancha</h1>
      
      <input
        placeholder="Nombre"
        required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Superficie"
        value={form.surface}
        onChange={e => setForm({ ...form, surface: e.target.value })}
      />
      <input
        type="number"
        placeholder="Max jugadores"
        value={form.maxPlayers}
        onChange={e => setForm({ ...form, maxPlayers: Number(e.target.value) })}
      />
      <input
        placeholder="Ubicación"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />
      <textarea
        placeholder="Notas"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />
      <select
        value={form.branchId}
        onChange={e => setForm({ ...form, branchId: Number(e.target.value) })}
        required
      >
        <option value="">Sucursal</option>
        {branches.map(b => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
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

      <button type="submit" className="bg-primary">Crear</button>
      <button
        type="button"
        className="px-3 py-1 border"
        onClick={() => navigate("/courts")}
      >
        Cancelar
      </button>
    </form>
  )
}
