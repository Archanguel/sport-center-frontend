import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getIncome } from "../../../api/incomes"

export default function IncomeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [income, setIncome] = useState<any>(null)

  useEffect(() => {
    if (id) getIncome(Number(id)).then(setIncome)
  }, [id])

  if (!income) return <div className="p-4">Cargando...</div>

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Detalle de ingreso</h1>

      <p><b>Monto:</b> ${income.amount}</p>
      <p><b>Descripción:</b> {income.description}</p>
      <p><b>Fecha:</b> {income.date}</p>
      <p><b>Categoría:</b> {income.category}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(`/incomes/edit/${income.id}`)}>Editar</button>
        <button onClick={() => navigate("/incomes")}>Volver</button>
      </div>
    </div>
  )
}
