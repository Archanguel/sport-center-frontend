import { FormEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithCompany } from "../../../api/users"
import type { UserForm, UserDetail } from "../../../types/user"
import { useForm } from "../../../hooks/useForm"
import { useConfirmUnload } from "../../../hooks/useConfirmUnload"
import { useApi } from "../../../hooks/useApi"
import { Button } from "../../../components/ui/button"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { toast } from "sonner"
import { Spinner } from "../../../components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip"
import { SkeletonForm } from "../../../components/ui/skeletonForm"

export default function UserCreate() {
  const navigate = useNavigate()
  const api = useApi<UserDetail>()
  const { form, set } = useForm<UserForm>({
    username: "",
    email: "",
    password: ""
  })
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const dirty = useMemo(
    () => !!form.username || !!form.email || !!form.password,
    [form]
  )

  useConfirmUnload(dirty)

  const isValid = useMemo(
    () =>
      form.username.trim() !== "" &&
      form.email.trim() !== "" &&
      !!form.password,
    [form]
  )

  /*async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await api.call(() => createUserWithCompany(form))
      
      toast.success("Usuario creado con éxito")
      navigate("/users")
    } catch {
      //toast.error("Error al crear usuario")
    }
  }*/
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setConfirmSave(true)
  }

  async function confirmSaveUser() {
    try {
      await api.call(() => createUserWithCompany(form))
      toast.success("Usuario creado con éxito")
      navigate("/users")
    } catch {
      //toast.error("Error al crear usuario")
    }
  }

  function handleCancel() {
    if (dirty) setConfirmCancel(true)
    else navigate("/users")
  }

  if (api.loading) return <SkeletonForm fields={3} />
  if (!api) return <div>¡Error!</div>

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 max-w-md flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-4">Crear Usuario</h1>

        <div className="mb-3">
          <label>Nombre <span className="text-red-500">*</span></label>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => set({ username: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mail <span className="text-red-500">*</span></label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => set({ email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña <span className="text-red-500">*</span></label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => set({ password: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="ghost" className={api.loading ? "cursor-default" : "cursor-pointer"} disabled={api.loading} onClick={handleCancel}>
            {api.loading ? <Spinner size={16} /> : "Cancelar"}
          </Button>
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={!isValid ||api.loading ? "cursor-default" : "cursor-pointer"} disabled={!isValid || api.loading}>
                {api.loading ? <Spinner size={16} /> : "Crear"}
              </Button>
            </TooltipTrigger>
            {!isValid && <TooltipContent>Faltan campos por completar</TooltipContent>}
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
        title="Crear usuario"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmSaveUser}
        onCancel={() => setConfirmSave(false)}
      />
    </>
  )
}
