import { useEffect, useState, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getBranch, updateBranch } from "../../../api/branches"
import type { Branch } from "../../../types/branch"

export default function BranchEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    ;(async () => {
      try {
        const data = await getBranch(Number(id))
        setBranch(data)
      } catch (err: any) {
        alert("Error cargando: " + (err?.response?.data || err.message))
      } finally {
        setLoading(false)
      }
    })()
    /*getBranch(Number(id)).then((data: Branch) => {
      setBranch(data)
      setLoading(false)
    })*/
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!branch || !id) return

    try {
      await updateBranch(Number(id), branch)
      navigate("/branches")
    } catch (err: any) {
      alert("Error guardando: " + (err?.response?.data || err.message))
    }
  }

  if (loading) return <div className="p-4">Cargando...</div>
  if (!branch) return <div className="p-4">No encontrado</div>

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Editar Sucursal</h2>
      <form onSubmit={handleSubmit} className="p-4 w-96 flex flex-col gap-2">
        <input
          value={branch.name}
          onChange={e => setBranch({ ...branch, name: e.target.value })}
          className="p-2 border"
          required
        />
        <input
          value={branch.address ?? ""}
          onChange={e => setBranch({ ...branch, address: e.target.value })}
          className="p-2 border"
        />
        <input
          value={branch.phone ?? ""}
          onChange={e => setBranch({ ...branch, phone: e.target.value })}
          className="p-2 border"
        />

        <div className="flex gap-2">
          <button type="submit" className="px-3 py-1 bg-primary text-white">
            Guardar
          </button>
          <button
            type="button"
            className="px-3 py-1 border"
            onClick={() => navigate("/branches")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
