import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getIncome, updateIncome } from "../../../api/incomes"
import type { IncomeForm } from "../../../types/income"

export default function IncomeEdit() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<IncomeForm | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    getIncome(Number(id)).then(data =>
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
    e.preventDefault();
    if (!id || !form) return;
    await updateIncome(Number(id), { ...form, amount: Number(form.amount) });
    navigate("/incomes")
  }

  if (!form) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Editar Ingreso</h1>

      <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
      <input type="text" name="description" value={form.description} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="category" value={form.category} onChange={handleChange} required />

      <button type="submit">Guardar</button>
      <button
        type="button"
        className="px-3 py-1 border"
        onClick={() => navigate("/incomes")}
      >
        Cancelar
      </button>
    </form>
  )
}
