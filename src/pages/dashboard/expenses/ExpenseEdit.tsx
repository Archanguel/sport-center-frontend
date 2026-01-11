import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExpense, updateExpense } from "../../../api/expenses"
import type { ExpenseForm } from "../../../types/expense"

export default function ExpenseEdit() {
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<ExpenseForm | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    getExpense(Number(id)).then(data =>
      setForm({
        amount: String(data.amount),
        description: data.description,
        date: data.date,
        category: data.category
      })
    )
  }, [id])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => prev && { ...prev, [name]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id || !form) return;
    await updateExpense(Number(id), {
      ...form,
      amount: Number(form.amount),
    });
    navigate("/expenses")
  }

  if (!form) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Editar Gasto</h1>

      <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
      <input type="text" name="description" value={form.description} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="category" value={form.category} onChange={handleChange} required />

      <button type="submit">Guardar</button>
      <button
        type="button"
        className="px-3 py-1 border"
        onClick={() => navigate("/expenses")}
      >
        Cancelar
      </button>
    </form>
  )
}
