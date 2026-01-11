import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getReservations, deleteReservation } from "../../../api/reservations"
import type { Reservation } from "../../../types/reservation"
import { Button } from "../../../components/ui/button"
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa"

/*type Reservation = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  courtName: string;
};*/

export default function ReservationList() {
  const [items, setItems] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
    
  async function load() {
    setLoading(true)
    setError(null)
    
    try {
      //getReservations().then(setItems)
      const data = await getReservations()
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
    await deleteReservation(id)
    setItems(await getReservations())
    load()
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Reservas</h1>
        <Button variant="ghost" onClick={() => navigate(`/reservations/create`)}>
          <FaPlus />
        </Button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Título</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Estado</th>
            <th className="text-left p-2">Cancha</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.title}</td>
              <td className="p-2">{r.startTime}-{r.endTime}</td>
              <td className="p-2">{r.active ? "Activo" : "Inactivo"}</td>
              <td className="p-2">{r.courtName}</td>

              <td className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/reservations/view/${r.id}`)}>
                  <FaEye />
                </Button>

                <Button variant="ghost" onClick={() => navigate(`/reservations/edit/${r.id}`)}>
                  <FaEdit />
                </Button>

                <Button variant="ghost" onClick={() => handleDelete(r.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
