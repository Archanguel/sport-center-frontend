import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createBranch } from "../../../api/branches"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { toast } from "sonner"
import { BranchForm } from "../../../types/branch"

export default function BranchCreate() {
  const [form, setForm] = useState<BranchForm>({
    name: "",
    address: "",
    phone: "",
  })
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const { ...data } = form
    try {
      setLoading(true)
      await createBranch(data)
      toast.success("Sucursal Creada")
      navigate("/branches")
    } catch (err: any) {
      alert("Error creando: " + (err?.response?.data || err.message))
    } finally {
      setLoading(false)
    }
    //const { branchId, ...data } = form
    //await createCourt(data, branchId)
    //navigate("/branches")
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
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Crear"}
          </Button>
          <Button type="button" disabled={loading} onClick={() => navigate("/branches")}>
            {loading ? <Spinner /> : "Cancelar"}
          </Button>

          {/*<button type="submit" className="bg-primary px-3 py-1">
            Crear
          </button>
          <button type="button" className="px-3 py-1 border" onClick={() => navigate("/branches")}>
            Cancelar
          </button>*/}
        </div>
      </form>
    </div>
  )
}
