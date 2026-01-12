import { useEffect, useState, FormEvent, useMemo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getBranch, updateBranch } from "../../../api/branches"
import type { Branch } from "../../../types/branch"
import { useConfirmUnload } from "../../../hooks/useConfirmUnload"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { Spinner } from "../../../components/ui/spinner"
import { Button } from "../../../components/ui/button"

export default function BranchEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)
  const initialBranchRef = useRef<Branch | null>(null)
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [saving, setSaving] = useState(false)

  const dirty = useMemo(() => {
    if (!branch) return false
    return JSON.stringify(branch) !== JSON.stringify(initialBranchRef.current)
  }, [branch])

  useConfirmUnload(dirty)

  useEffect(() => {
    if (!id) return

    ;(async () => {
      try {
        const data = await getBranch(Number(id))
        setBranch(data)
        initialBranchRef.current = data
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setConfirmSave(true)
  }

  async function confirmSaveEdit() {
    if (!branch || !id) return

    try {
      setSaving(true)
      await updateBranch(Number(id), branch)
      navigate("/branches")
    } catch (err: any) {
      alert("Error guardando: " + (err?.response?.data || err.message))
    } finally {
      setSaving(false)
      setConfirmSave(false)
    }
  }

  function handleCancel() {
    if (dirty) setConfirmCancel(true)
    else navigate("/branches")
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
          <Button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className={saving ? "cursor-default" : "cursor-pointer"}
          >
            {saving ? <Spinner size={16} /> : "Cancelar"}
          </Button>
          <Button
            type="submit"
            disabled={!dirty || saving}
            className={!dirty || saving ? "cursor-default" : "cursor-pointer"}
          >
            {saving ? <Spinner size={16} /> : "Guardar"}
          </Button>
        </div> 
      </form>
      <ConfirmDialog
        open={confirmCancel}
        title="Hay cambios sin guardar"
        description="¿Querés salir igual?"
        confirmText="Si"
        cancelText="No"
        onConfirm={() => navigate("/branches")}
        onCancel={() => setConfirmCancel(false)}
      />

      <ConfirmDialog
        open={confirmSave}
        title="Modificar sucursal"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmSaveEdit}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  )
}
