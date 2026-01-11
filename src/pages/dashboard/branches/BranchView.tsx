import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getBranch } from "../../../api/branches"
import type { Branch } from "../../../types/branch"

export default function BranchView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [branch, setBranch] = useState<Branch | null>(null)

  useEffect(() => {
    if (id) getBranch(Number(id)).then(setBranch)
  }, [id])

  if (!branch) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de sucursal</h1>

      <p><b>Nombre:</b> {branch.name}</p>
      <p><b>Dirección:</b> {branch.address || "-"}</p>
      <p><b>Teléfono:</b> {branch.phone || "-"}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/branches/edit/${branch.id}`)}>
          Editar
        </button>
        <button onClick={() => navigate("/branches")}>
          Volver
        </button>
      </div>
    </div>
  )
}
