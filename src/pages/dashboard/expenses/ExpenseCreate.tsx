import { useState, ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createExpense } from "../../../api/expenses"
import type { ExpenseForm } from "../../../types/expense"

export default function ExpenseCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState<ExpenseForm>({
    amount: "",
    description: "",
    date: "",
    category: ""
  })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await createExpense({
      ...form,
      amount: Number(form.amount),
    });
    navigate("/expenses")
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Gasto</h1>

      <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
      <input type="text" name="description" value={form.description} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="category" value={form.category} onChange={handleChange} required />

      <button type="submit">Crear</button>
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
