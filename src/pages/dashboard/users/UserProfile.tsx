import { useEffect, useState, useCallback, useMemo } from "react"
import { getCurrentUser } from "../../../api/auth"
import { updateUser, changePassword } from "../../../api/users"
import type { CurrentUser } from "../../../types/auth"
import type { UserBase } from "../../../types/user"
import { FaEdit, FaTimes } from "react-icons/fa"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { useApi } from "../../../hooks/useApi"
import { Eye, EyeOff } from "lucide-react"
import { Spinner } from "../../../components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip"
import { SkeletonForm } from "../../../components/ui/skeletonForm"

export default function UserProfile() {
  const loadApi = useApi<CurrentUser>()
  const userApi = useApi<UserBase>()
  const passwordApi = useApi<void>()
  const [user, setUser] = useState<CurrentUser | null>(null)

  const [editingUsername, setEditingUsername] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  useEffect(() => {
    loadApi
      .call(getCurrentUser)
      .then(u => {
        setUser(u)
        setUsername(u.username)
        setEmail(u.email)
      })
      .catch(() => toast.error("Error al cargar perfil"))
    /*getCurrentUser().then(u => {
      setUser(u)
      setUsername(u.username)
      setEmail(u.email)
    })*/
  }, [])

  const canSaveUser = useMemo(() => {
    if (!user) return false
    return (
      (editingUsername && username.trim() !== "" && username !== user.username) ||
      (editingEmail && email.trim() !== "" && email !== user.email) ||
      (editingPassword && currentPassword.trim() !== "" && newPassword.trim() !== "" && repeatPassword.trim() !== "")
    )
  }, [user, editingUsername, editingEmail, username, email, editingPassword, currentPassword, newPassword, repeatPassword])

  /*async function saveUser() {
    if (!user) return

    try {
      await userApi.call(() =>
        updateUser(user.id, {
          username: editingUsername ? username : undefined,
          email: editingEmail ? email : undefined,
        })
      )

      toast.success("Datos actualizados correctamente")
      setEditingUsername(false)
      setEditingEmail(false)
    } catch {
      toast.error("Error al actualizar datos")
    }
    //if (!user) return
    try {
      await updateUser(user.id, {
        username: editingUsername ? username : undefined,
        email: editingEmail ? email : undefined,
      })

      toast.success("Datos actualizados")
      setEditingUsername(false)
      setEditingEmail(false)
    } catch {
      toast.error("Error al actualizar datos")
    }
  }*/
  const saveUser = useCallback(async () => {
    if (!user) return

    try {
      await userApi.call(() =>
        updateUser(user.id, {
          username: editingUsername ? username : undefined,
          email: editingEmail ? email : undefined,
        })
      )

      toast.success("Datos actualizados con éxito")
      setEditingUsername(false)
      setEditingEmail(false)
    } catch {
      toast.error("Error al actualizar datos")
    }
  }, [user, editingUsername, editingEmail, username, email])

  /*async function savePassword() {
    if (!currentPassword || !newPassword || !repeatPassword) {
      toast.error("Completá todos los campos")
      return
    }

    if (newPassword !== repeatPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    try {
      await passwordApi.call(() =>
        changePassword({
          currentPassword,
          newPassword,
        })
      )

      toast.success("Contraseña actualizada")
      setCurrentPassword("")
      setNewPassword("")
      setRepeatPassword("")
      setEditingPassword(false)
    } catch {
      // toast ya por interceptor
    }
    //try {
      await changePassword({
        currentPassword,
        newPassword,
      })

      toast.success("Contraseña actualizada")
      setCurrentPassword("")
      setNewPassword("")
      setRepeatPassword("")
      setEditingPassword(false)
    } catch {
      // el toast ya lo maneja axios interceptor
      // toast.error("Error al cambiar contraseña")
    }
  }*/
  const savePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      toast.error("Completá todos los campos")
      return
    }

    if (newPassword !== repeatPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    try {
      await passwordApi.call(() =>
        changePassword({ currentPassword, newPassword })
      )

      toast.success("Contraseña actualizada")
      setCurrentPassword("")
      setNewPassword("")
      setRepeatPassword("")
      setEditingPassword(false)
    } catch {
      toast.error("Error al cambiar contraseña")
    }
  }, [currentPassword, newPassword, repeatPassword])

  function PasswordToggle({
    visible,
    onClick,
  }: {
    visible: boolean
    onClick: () => void
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-muted-foreground hover:[background-color:hsl(var(--text-foreground))]"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )
  }

  if (loadApi.loading) return <SkeletonForm fields={3} />
  if (!user || !loadApi) return <div>¡Error!</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mi Perfil</h1>

      {/* USERNAME */}
      <div className="mb-3">
        <label>Usuario</label>
        {editingUsername ? (
          <div className="flex justify-between">
            <input
              className="input"
              placeholder={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Button variant="ghost" onClick={() => {setEditingUsername(false); setUsername(user.username)}}>
              <FaTimes />
            </Button>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button className="btn mb-6" onClick={saveUser} disabled={!canSaveUser || userApi.loading}>
                  {userApi.loading ? <Spinner size={16} /> : "Guardar cambios"}
                </Button>
              </TooltipTrigger>
              {!canSaveUser && <TooltipContent>No hay cambios para guardar</TooltipContent>}
            </Tooltip>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>{user.username}</span>
            
            {(!editingEmail && !editingPassword) && (
              <Button variant="ghost" onClick={() => setEditingUsername(true)}>
                <FaEdit />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* EMAIL */}
      <div className="mb-3">
        <label>Email</label>
        {editingEmail ? (
          <div className="flex justify-between">
            <input
              className="input"
              placeholder={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button variant="ghost" onClick={() => {setEditingEmail(false); setEmail(user.email)}}>
              <FaTimes />
            </Button>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button className="btn mb-6" onClick={saveUser} disabled={!canSaveUser || userApi.loading}>
                  {userApi.loading ? <Spinner size={16} /> : "Guardar cambios"}
                </Button>
              </TooltipTrigger>
              {!canSaveUser && <TooltipContent>No hay cambios para guardar</TooltipContent>}
            </Tooltip>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>{user.email}</span>

            {(!editingUsername && !editingPassword) && (
              <Button variant="ghost" onClick={() => setEditingEmail(true)}>
                <FaEdit />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <label>Contraseña</label>
        {editingPassword ? (
          <div className="flex justify-between">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Contraseña actual"
              className="input mb-2"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <PasswordToggle
              visible={showCurrentPassword}
              onClick={() => setShowCurrentPassword(v => !v)}
            />

            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              className="input mb-2"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <PasswordToggle
              visible={showNewPassword}
              onClick={() => setShowNewPassword(v => !v)}
            />

            <input
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repetir nueva contraseña"
              className="input mb-3"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
            <PasswordToggle
              visible={showRepeatPassword}
              onClick={() => setShowRepeatPassword(v => !v)}
            />

            <Button
              variant="ghost"
              onClick={() => {
                setEditingPassword(false)
                setCurrentPassword("")
                setNewPassword("")
                setRepeatPassword("")
              }}
            >
              <FaTimes />
            </Button>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button className="btn mb-6" onClick={savePassword} disabled={!canSaveUser || passwordApi.loading}>
                  {passwordApi.loading ? <Spinner size={16} /> : "Guardar cambios"}
                </Button>
              </TooltipTrigger>
              {!canSaveUser && <TooltipContent>No hay cambios para guardar</TooltipContent>}
            </Tooltip>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>********</span>

            {(!editingUsername && !editingEmail) && (
              <Button variant="ghost" onClick={() => setEditingPassword(true)}>
                <FaEdit />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
