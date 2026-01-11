import axiosClient from "./axiosClient"

export interface Report {
  totalIncomes: number
  totalExpenses: number
  balance: number
}

export async function getReports(
  start: string,
  end: string
): Promise<Report> {
  const res = await axiosClient.get<Report>("/reports", {
    params: { start, end },
  })
  return res.data
}
