import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getIncomes, deleteIncome } from "../../../api/incomes"
import type { Income } from "../../../types/income"
import { Button } from "../../../components/ui/button"
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa"

export default function IncomeList() {
  const [items, setItems] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  async function load() {
    setLoading(true)
    setError(null)
  
    try {
      //getIncomes().then(setItems)
      const data = await getIncomes()
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
    await deleteIncome(id)
    setItems(await getIncomes())
    load()
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Ingresos</h1>
        <Button variant="ghost" onClick={() => navigate(`/incomes/create`)}>
          <FaPlus />
        </Button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Descripción</th>
            <th className="text-left p-2">Cantidad</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Sucursal</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="border-b">
              <td className="p-2">{i.description}</td>
              <td className="p-2">${i.amount}</td>
              <td className="p-2">{i.date}</td>
              <td className="p-2">{i.branchName}</td>

              <td className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/incomes/view/${i.id}`)}>
                  <FaEye />
                </Button>

                <Button variant="ghost" onClick={() => navigate(`/incomes/edit/${i.id}`)}>
                  <FaEdit />
                </Button>

                <Button variant="ghost" onClick={() => handleDelete(i.id)}>
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
