import { FormEvent, useEffect, useState, useMemo, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUser, updateUserBranches } from "../../../api/users"
import { getAllBranches } from "../../../api/branches"
import type { UserDetail } from "../../../types/user"
import type { Branch } from "../../../types/branch"
import { useForm } from "../../../hooks/useForm"
import { useApi } from "../../../hooks/useApi"
import { useConfirmUnload } from "../../../hooks/useConfirmUnload"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip"
import { SkeletonForm } from "../../../components/ui/skeletonForm"

type UserBranchesForm = {
  branchIds: number[]
}

export default function UserEdit() {
  const navigate = useNavigate()
  const { id } = useParams()

  const loadApi = useApi<void>()
  const saveApi = useApi<void>()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const { form, set, reset } = useForm<UserBranchesForm>({
    branchIds: []
  })

  useEffect(() => {
    if (!id) return

    loadApi
      .call(async () => {
        const [u, b] = await Promise.all([
          getUser(Number(id)),
          getAllBranches(),
        ])

        setUser(u)
        setBranches(b)

        reset({
          branchIds: u.branches?.map(br => br.id) ?? [],
        })
      })
  }, [id])

  const dirty = useMemo(() => {
    if (!user) return false
    return (
      JSON.stringify(form.branchIds) !==
      JSON.stringify(user.branches.map(b => b.id))
    )
  }, [form.branchIds, user])

  useConfirmUnload(dirty)

  const toggleBranch = useCallback((branchId: number) => {
    set({
      branchIds: form.branchIds.includes(branchId)
        ? form.branchIds.filter(id => id !== branchId)
        : [...form.branchIds, branchId]
    })
  }, [form.branchIds])

  /*async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return

    try {
      await saveApi.call(() =>
        updateUserBranches(Number(id), form.branchIds)
      )

      toast.success("Usuario modificado con éxito")
      navigate("/users")
    } catch {
      toast.error("Error al modificar usuario")
    }
  }*/
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setConfirmSave(true)
  }

  async function confirmSaveEdit() {
    if (!id) return

    try {
      await saveApi.call(() =>
        updateUserBranches(Number(id), form.branchIds)
      )
      toast.success("Usuario modificado con éxito")
      navigate("/users")
    } catch {
      //toast.error("Error al modificar usuario")
    }
  }

  function handleCancel() {
    if (dirty) setConfirmCancel(true)
    else navigate("/users")
  }

  if (loadApi.loading) return <SkeletonForm fields={3} />
  if (!user || !id || !loadApi) return <div>¡Error!</div>

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold mb-4">Editar Usuario</h1>

        <div className="mb-3">
          <label>Usuario: </label>
          <input
            disabled
            value={user.username}
            className="input"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Sucursales</label>

          {branches.map(b => (
            <label key={b.id} className="flex gap-2 mb-1">
              <input
                type="checkbox"
                checked={form.branchIds.includes(b.id)}
                onChange={() => toggleBranch(b.id)}
              />
              {b.name}
            </label>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="ghost" className={saveApi.loading ? "cursor-default" : "cursor-pointer"} disabled={saveApi.loading} onClick={handleCancel}>
            {saveApi.loading ? <Spinner size={16} /> : "Cancelar"}
          </Button>
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={!dirty || saveApi.loading ? "cursor-default" : "cursor-pointer"} disabled={!dirty || saveApi.loading}>
                {saveApi.loading ? <Spinner size={16} /> : "Guardar"}
              </Button>
            </TooltipTrigger>
            {!dirty && <TooltipContent>No hay cambios para guardar</TooltipContent>}
          </Tooltip>
        </div>
      </form>

      <ConfirmDialog
        open={confirmCancel}
        title="Hay cambios sin guardar"
        description="¿Querés salir igual?"
        confirmText="Si"
        cancelText="No"
        onConfirm={() => navigate("/users")}
        onCancel={() => setConfirmCancel(false)}
      />

      <ConfirmDialog
        open={confirmSave}
        title="Modificar usuario"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmSaveEdit}
        onCancel={() => setConfirmSave(false)}
      />
    </>
  )
}
