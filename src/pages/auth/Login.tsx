import { useEffect, useState, FormEvent, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordConfirm,
  getCurrentUser,
} from "../../api/auth"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Spinner } from "../../components/ui/spinner"
import { toast } from "sonner"

type Tab = "login" | "register" | "forgot" | "reset"

/*type LoginData = {
  email: string
  password: string
}

type RegisterData = {
  email: string
  username: string
  password: string
}*/

export default function Login() {
  const navigate = useNavigate()

  /*const [tab, setTab] = useState<"login" | "register" | "forgot" | "reset">(
    "login"
  )*/
  const [tab, setTab] = useState<Tab>("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [forgotSent, setForgotSent] = useState(false)

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ email: "", username: "", password: "" })

  /*const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    username: "",
    password: "",
  })*/
  
  const [forgotEmail, setForgotEmail] = useState("")
  /*const [newPassword, setNewPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")*/
  const [passwords, setPasswords] = useState({ new: "", repeat: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (token) {
      setResetToken(token)
      changeTab("reset")
    }
  }, [])

  const resetForm = () => {
    setLoginData({ email: "", password: "" })
    setRegisterData({ email: "", username: "", password: "" })
    setForgotEmail("")
    /*setNewPassword("")
    setRepeatPassword("")*/
    setPasswords({ new: "", repeat: "" })
    setError("")
    setForgotSent(false)
    setShowPassword(false)
  }

  /*const changeTab = (next: typeof tab) => {
    resetFormState()
    setTab(next)
  }*/
  const changeTab = useCallback((next: Tab) => {
    resetForm()
    setTab(next)
  }, [resetForm])

  /*async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await loginRequest(loginData)
      localStorage.setItem("token", data.token)

      const currentUser = await getCurrentUser()
      navigate(currentUser.companyId ? "/reservations" : "/companyEntry", {
        replace: true,
      })
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }*/
  const handleLogin = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { token } = await loginRequest(loginData)
      localStorage.setItem("token", token)

      const currentUser = await getCurrentUser()
      navigate(
        currentUser.companyId ? "/reservations" : "/companyEntry",
        { replace: true }
      )
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al iniciar sesión")
    } finally {
      toast.success("Sesión iniciada con éxito")
      setLoading(false)
    }
  }, [loginData, navigate])

  /*async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await registerRequest(registerData)
      changeTab("login")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }*/
  const handleRegister = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerRequest(registerData)
      changeTab("login")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al registrarse")
    } finally {
      toast.success("Cuenta creada con éxito")
      setLoading(false)
    }
  }, [registerData, changeTab])

  /*async function handleForgot(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await forgotPasswordRequest({ email: forgotEmail })
      setForgotSent(true)
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al enviar el mail")
    } finally {
      setLoading(false)
    }
  }*/
  const handleForgot = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPasswordRequest({ email: forgotEmail })
      setForgotSent(true)
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al enviar el mail")
    } finally {
      toast.success("Mail enviado al correo")
      setLoading(false)
    }
  }, [forgotEmail])

  /*async function handleReset(e: FormEvent) {
    e.preventDefault()

    if (newPassword !== repeatPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    setError("")

    try {
      await resetPasswordConfirm({ token: resetToken, newPassword })
      changeTab("login")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }*/
  const handleReset = useCallback(async (e: FormEvent) => {
    e.preventDefault()

    if (passwords.new !== passwords.repeat) {
      return
    }

    setLoading(true)
    try {
      await resetPasswordConfirm({
        token: resetToken,
        newPassword: passwords.new,
      })
      changeTab("login")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al cambiar la contraseña")
    } finally {
      toast.success("Contraseña cambiada con éxito")
      setLoading(false)
    }
  }, [passwords, resetToken, changeTab])

  const goToLogin = () => {
    setForgotSent(false)
    changeTab("login")
  }

  /*const passwordIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="cursor-pointer text-muted-foreground hover:text-foreground"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  )*/
  const passwordIcon = useMemo(() => (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="cursor-pointer text-muted-foreground hover:[background-color:hsl(var(--text-foreground))]"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  ), [showPassword])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[420px]">
        {(tab === "login" || tab === "register") && (
          <Tabs value={tab} onValueChange={(v) => changeTab(v as Tab)}>
            <TabsList className="grid grid-cols-2 mx-4">
              <TabsTrigger value="login" disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size={16} />
                  </span>
                ) : (
                  "Login"
                )}
              </TabsTrigger>
              <TabsTrigger value="register" disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size={16} />
                  </span>
                ) : (
                  "Register"
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Card>
          <CardHeader>
            {/*<CardTitle className="text-center">
              {tab === "login" && "Iniciar sesión"}
              {tab === "register" && "Crear cuenta"}
              {tab === "forgot" && "Recuperar contraseña"}
              {tab === "reset" && "Nueva contraseña"}
            </CardTitle>*/}
            <CardTitle className="text-center">
              {{
                login: "Iniciar sesión",
                register: "Crear cuenta",
                forgot: "Recuperar contraseña",
                reset: "Nueva contraseña",
              }[tab]}
            </CardTitle>
          </CardHeader>

          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />

                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  rightElement={passwordIcon}
                  required
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="w-full inline-flex justify-center">
                  <Button disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size={16} />
                      </span>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </div>

                <Button
                  className={`text-sm underline ${
                    loading ? "cursor-default" : "cursor-pointer"
                  } bg-transparent text-black-foreground`}
                  onClick={() => changeTab("forgot")}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size={16} />
                    </span>
                  ) : (
                    "¿Olvidaste la contraseña?"
                  )}
                </Button>
              </CardContent>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <Input
                  label="Nombre"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                  required
                />

                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  rightElement={passwordIcon}
                  required
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="w-full inline-flex justify-center">
                  <Button disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size={16} />
                      </span>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          )}

          {tab === "forgot" && (
            forgotSent ? (
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Revisá tu correo electrónico.  
                  Si el email existe, te enviamos un enlace para restablecer tu contraseña.
                </p>
                <Button disabled={loading} onClick={() => goToLogin()}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size={16} />
                    </span>
                  ) : (
                    "Volver al login"
                  )}
                </Button>
              </CardContent>
            ) : (
              <form onSubmit={handleForgot}>
                <CardContent className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  <div className="w-full inline-flex justify-center">
                    <Button disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Spinner size={16} />
                        </span>
                      ) : (
                        "Enviar link"
                      )}
                    </Button>
                  </div>

                  <Button
                    disabled={loading}
                    className={loading ? "cursor-default" : "cursor-pointer"}
                    variant="ghost"
                    onClick={() => changeTab("login")}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size={16} />
                      </span>
                    ) : (
                      "Volver"
                    )}
                  </Button>
                </CardContent>
              </form>
            )
          )}

          {tab === "reset" && (
            <form onSubmit={handleReset}>
              <CardContent className="space-y-4">
                <Input
                  label="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  //value={newPassword}
                  value={passwords.new}
                  //onChange={(e) => setNewPassword(e.target.value)}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  rightElement={passwordIcon}
                  required
                />

                <Input
                  label="Repetir contraseña"
                  type={showPassword ? "text" : "password"}
                  //value={repeatPassword}
                  value={passwords.repeat}
                  //onChange={(e) => setRepeatPassword(e.target.value)}
                  onChange={e => setPasswords(p => ({ ...p, repeat: e.target.value }))}
                  rightElement={passwordIcon}
                  required
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}


                <div className="w-full inline-flex justify-center">
                  <Button disabled={loading} className={loading ? "cursor-default" : "cursor-pointer"}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size={16} />
                      </span>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
