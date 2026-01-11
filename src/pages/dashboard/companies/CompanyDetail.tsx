import { useEffect, useState } from "react"
import { getCompany, updateCompany } from "../../../api/companies"
import { getCurrentUser } from "../../../api/auth"
import type { Company } from "../../../types/company"

export default function CompanyDetail() {
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState("")
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const user = await getCurrentUser()

      if (!user.companyId) {
        setLoading(false)
        return
      }

      const companyData: Company = await getCompany(user.companyId)
      console.log(companyData)

      setCompany(companyData)
      setName(companyData.name)
      setCanEdit(user.role === "OWNER" || user.role === "ADMIN")
      setLoading(false)
    })()
  }, [])

  async function handleSave() {
    if (!company) return
    await updateCompany(company.id, { name })
    alert("Nombre actualizado")
  }

  if (loading) return <div className="p-4">Cargando...</div>
  if (!company) return <div className="p-4">Sin compañía</div>

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Compañía</h1>

      <label className="block text-sm mb-1">Nombre</label>
      <input
        value={name}
        disabled={!canEdit}
        onChange={e => setName(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <label className="block text-sm mb-1">Código de invitación</label>
      <input
        value={company.inviteCode}
        disabled
        className="border p-2 w-full mb-4 bg-gray-100"
      />

      {canEdit && (
        <button onClick={handleSave} className="px-4 py-2 bg-primary">
          Guardar cambios
        </button>
      )}
    </div>
  )
}
