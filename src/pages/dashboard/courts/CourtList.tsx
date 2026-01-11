import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCourts, deleteCourt } from "../../../api/courts"
import { Button } from "../../../components/ui/button"
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa"

interface Court {
  id: number
  name: string
  location?: string
  active?: boolean
  surface?: string
  maxPlayers?: number
  notes?: string
}

export default function CourtList() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data: Court[] = await getCourts()
      //const parsed = Array.isArray(data) ? data : data.content || []
      setCourts(data)
    } catch (err: any) {
      setError(err?.message || "Error cargando canchas")

      if ([401, 403].includes(err?.response?.status)) {
        localStorage.removeItem("token")
        navigate("/auth/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: number) {
    await deleteCourt(id)
    load()
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Canchas</h1>
        {/*<Link to="/courts/create" className="px-3 py-1 bg-primary rounded">
          Crear cancha
        </Link>*/}
        <Button variant="ghost" onClick={() => navigate(`/courts/create`)}>
          <FaPlus />
        </Button>
      </div>

      {courts.length === 0 && <div>No hay canchas</div>}

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Ubicación</th>
            <th className="text-left p-2">Estado</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courts.map(c => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.location}</td>
              <td className="p-2">{c.active ? "Activo" : "Inactivo"}</td>

              <td className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/courts/view/${c.id}`)}>
                  <FaEye />
                </Button>

                <Button variant="ghost" onClick={() => navigate(`/courts/edit/${c.id}`)}>
                  <FaEdit />
                </Button>

                <Button variant="ghost" onClick={() => handleDelete(c.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*<ul>
        {courts.map(c => (
          <li key={c.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.location}</div>
              <div className="text-sm text-muted-foreground">{String(c.active)}</div>
              <div className="text-sm text-muted-foreground">{c.surface}</div>
              <div className="text-sm text-muted-foreground">{c.maxPlayers}</div>
              <div className="text-sm text-muted-foreground">{c.notes}</div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/courts/edit/${c.id}`}
                className="px-2 py-1 border rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>*/}
    </div>
  )
}
