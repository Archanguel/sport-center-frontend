import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExpense } from "../../../api/expenses"

export default function ExpenseView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState<any>(null)

  useEffect(() => {
    if (id) getExpense(Number(id)).then(setExpense)
  }, [id])

  if (!expense) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de gasto</h1>

      <p><b>Monto:</b> ${expense.amount}</p>
      <p><b>Descripción:</b> {expense.description}</p>
      <p><b>Fecha:</b> {expense.date}</p>
      <p><b>Categoría:</b> {expense.category}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/expenses/edit/${expense.id}`)}>Editar</button>
        <button onClick={() => navigate("/expenses")}>Volver</button>
      </div>
    </div>
  )
}
