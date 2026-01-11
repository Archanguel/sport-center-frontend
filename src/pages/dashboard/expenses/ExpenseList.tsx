import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getExpenses, deleteExpense } from "../../../api/expenses"
import type { Expense } from "../../../types/expense"
import { Button } from "../../../components/ui/button"
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa"

export default function ExpenseList() {
  const [items, setItems] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    setError(null)

    try {
      //getExpenses().then(setItems)
      const data = await getExpenses()
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
    await deleteExpense(id)
    setItems(await getExpenses())
    load()
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gastos</h1>
        <Button variant="ghost" onClick={() => navigate(`/expenses/create`)}>
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
          {items.map(e => (
            <tr key={e.id} className="border-b">
              <td className="p-2">{e.description}</td>
              <td className="p-2">${e.amount}</td>
              <td className="p-2">{e.date}</td>
              <td className="p-2">{e.branchName}</td>

              <td className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/expenses/view/${e.id}`)}>
                  <FaEye />
                </Button>

                <Button variant="ghost" onClick={() => navigate(`/expenses/edit/${e.id}`)}>
                  <FaEdit />
                </Button>

                <Button variant="ghost" onClick={() => handleDelete(e.id)}>
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
