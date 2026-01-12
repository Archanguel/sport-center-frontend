import { useEffect, useState, FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCourt, updateCourt } from "../../../api/courts"
import { getAllBranches } from "../../../api/branches"
import type { Branch } from "../../../types/branch"
import type { CourtForm } from "../../../types/court"

export default function CourtEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState<Branch[]>([])
  const [form, setForm] = useState<CourtForm>({
    name: "",
    surface: "",
    maxPlayers: 0,
    active: true,
    location: "",
    notes: "",
    branchId: 0
  })

  useEffect(() => {
    if (!id) return

    ;(async () => {
      const [court, branchesData] = await Promise.all([
        getCourt(Number(id)),
        getAllBranches()
      ])

      setBranches(branchesData)
      setForm({
        name: court.name ?? "",
        surface: court.surface ?? "",
        maxPlayers: court.maxPlayers ?? 0,
        active: court.active ?? true,
        location: court.location ?? "",
        notes: court.notes ?? "",
        branchId: court.branch?.id ?? 0
      })

      setLoading(false)
    })()
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return

    const { branchId, ...data } = form
    await updateCourt(Number(id), data, branchId)
    navigate("/courts")
  }

  if (loading) return <div className="p-4">Cargando...</div>

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md flex flex-col gap-2">
      <h1 className="text-xl">Editar Cancha</h1>
      
      <input
        value={form.name}
        required
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        value={form.surface}
        onChange={e => setForm({ ...form, surface: e.target.value })}
      />
      <input
        type="number"
        value={form.maxPlayers}
        onChange={e =>
          setForm({ ...form, maxPlayers: Number(e.target.value) })
        }
      />
      <input
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />
      <textarea
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
      <button type="submit" className="bg-primary">Guardar</button>
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
