import { useEffect, useState } from "react"
import { getTournaments, deleteTournament } from "../../../api/tournaments"
import type { Tournament } from "../../../types/tournament"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { FaPlus } from "react-icons/fa"

/*type Tournament = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
};*/

export default function TournamentList() {
  const [items, setItems] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    setError(null)
    
    try {
      //getTournaments().then(setItems)
      const data = await getTournaments()
      setItems(data)
    } catch (err: any) {
      setError(err?.message || "Error cargando gastos")
    
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
    await deleteTournament(id);
    setItems(await getTournaments());
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl mb-4">Torneos</h1>
        <Button variant="ghost" onClick={() => navigate(`/tournaments/create`)}>
          <FaPlus />
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map(t => (
          <li key={t.id} className="border p-2 flex justify-between">
            <span>{t.name} – {t.description} – {t.startDate} – {t.endDate} – {t.status}</span>
            <Link to={`/tournaments/edit/${t.id}`}>Editar</Link>
            <button onClick={() => handleDelete(t.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
