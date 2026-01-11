import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { getCurrentUser } from "../../../api/auth"
import { createCompany, joinCompany } from "../../../api/companies"

type Mode = "create" | "join" | null

export default function CompanyEntry() {
  const [loading, setLoading] = useState(true)
  const [hasCompany, setHasCompany] = useState(false)
  const [mode, setMode] = useState<Mode>(null)
  const [value, setValue] = useState("")

  useEffect(() => {
    ;(async () => {
      const user = await getCurrentUser()
      if (user.companyId) {
        setHasCompany(true)
      }
      setLoading(false)
    })()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (hasCompany) return <Navigate to="/branches" replace />

  async function handleSubmit() {
    if (mode === "create") {
      await createCompany({ name: value })
    } else if (mode === "join") {
      await joinCompany({ code: value })
    }

    const user = await getCurrentUser()
    if (user.companyId) {
      setHasCompany(true)
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">
        No pertenecés a ninguna compañía
      </h1>

      <button onClick={() => setMode("create")} className="px-4 py-2 border">
        Crear compañía
      </button>

      <button onClick={() => setMode("join")} className="px-4 py-2 border">
        Unirme a compañía
      </button>

      {mode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80 flex flex-col gap-3">
            <h2 className="text-lg font-bold">
              {mode === "create" ? "Crear compañía" : "Unirme a compañía"}
            </h2>

            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={mode === "create" ? "Nombre" : "Código"}
              className="border p-2"
            />

            <button onClick={handleSubmit} className="bg-primary py-2">
              {mode === "create" ? "Crear" : "Unirme"}
            </button>

            <button onClick={() => setMode(null)} className="text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
