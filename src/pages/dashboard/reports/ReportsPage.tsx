import { useEffect, useState } from "react"
import { getReports } from "../../../api/reports"
import type { Report } from "../../../types/report"

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    async function load() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);

      const format = (d: Date) => d.toISOString().split("T")[0];

      const data = await getReports(format(start), format(end));
      setReport({
        totalIncome: data.totalIncomes,
        totalExpense: data.totalExpenses,
        balance: data.balance
      });
    }

    load();
  }, []);

  if (!report) return <p>Cargando...</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Reportes</h1>
      </div>
      <p>Total ingresos: ${report.totalIncome}</p>
      <p>Total gastos: ${report.totalExpense}</p>
      <p><b>Balance: ${report.balance}</b></p>
    </div>
  )
}
