import { useState, FormEvent, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { createBranch } from "../../../api/branches"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { toast } from "sonner"
import { BranchForm } from "../../../types/branch"
import { useConfirmUnload } from "../../../hooks/useConfirmUnload"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip"

export default function BranchCreate() {
  const [form, setForm] = useState<BranchForm>({
    name: "",
    address: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const dirty = useMemo(() => {
    return !!form.name || !!form.address || !!form.phone
  }, [form])

  useConfirmUnload(dirty)

  const isValid = useMemo(() => form.name.trim() !== "", [form])

  function handleCancel() {
    if (dirty) setConfirmCancel(true)
    else navigate("/branches")
  }

  /*async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await createBranch({ name, address, phone })
      toast.success("Sucursal Creada")
      navigate("/branches")
    } catch (err: any) {
      alert("Error creando: " + (err?.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }*/
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setConfirmSave(true)
  }

  async function confirmSaveCreate() {
    const data = form
    try {
      setLoading(true)
      await createBranch(data)
      toast.success("Sucursal Creada")
      navigate("/branches")
    } catch (err: any) {
      alert("Error creando: " + (err?.response?.data || err.message))
    } finally {
      setLoading(false)
      setConfirmSave(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Crear Sucursal</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-96">
        <input
          value={form.name}
          //onChange={e => setName(e.target.value)}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre"
          className="p-2 border"
          required
        />
        <input
          value={form.address}
          //onChange={e => setAddress(e.target.value)}
          onChange={e => setForm({ ...form, address: e.target.value })}
          placeholder="Dirección"
          className="p-2 border"
        />
        <input
          value={form.phone}
          //onChange={e => setPhone(e.target.value)}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          placeholder="Teléfono"
          className="p-2 border"
        />

        <div className="flex gap-2">
          <Button type="button" disabled={loading} onClick={handleCancel} className={loading ? "cursor-default" : "cursor-pointer"}>
            {loading ? <Spinner /> : "Cancelar"}
          </Button>
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={!isValid || loading} className={!isValid || loading ? "cursor-default" : "cursor-pointer"}>
                {loading ? <Spinner /> : "Crear"}
              </Button>
            </TooltipTrigger>
            {!isValid && <TooltipContent>Falta el nombre</TooltipContent>}
          </Tooltip>
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
        title="Crear sucursal"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmSaveCreate}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  )
}
