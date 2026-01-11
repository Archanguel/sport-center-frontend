import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUser } from "../../../api/users"
import type { UserDetail } from "../../../types/user"
import { useApi } from "../../../hooks/useApi"
import { Button } from "../../../components/ui/button"
import { toast } from "sonner"
import { SkeletonForm } from "../../../components/ui/skeletonForm"

export default function UserView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const api = useApi<UserDetail>()

  useEffect(() => {
    if (!id) return
    api.call(() => getUser(Number(id))).catch(() =>
      toast.error("Error al cargar usuario")
    )
  }, [id])

  const user = api.data

  if (api.loading) return <SkeletonForm fields={3} />
  if (!user || !api) return <div>Error</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de usuario</h1>

      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Activo:</b> {user.enabled ? "Sí" : "No"}</p>
      <p>
        <b>Sucursales:</b>
        {user.branches ? user.branches.map(b => (
          <label key={b.id} className="flex gap-2 mb-1">
            {b.name}
          </label>
        )) : "-"}
      </p>

      <div className="flex gap-2 mt-4">
        <Button variant="ghost" disabled={api.loading} onClick={() => navigate(`/users/edit/${user.id}`)}>
          Editar
        </Button>
        <Button variant="ghost" disabled={api.loading} onClick={() => navigate(`/users`)}>
          Volver
        </Button>
      </div>
    </div>
  )
}
