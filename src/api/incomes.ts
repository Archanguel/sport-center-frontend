import axiosClient from "./axiosClient"
import type { Income } from "../types/income"

/*export interface Income {
  id: number
  description: string
  amount: number
  date: string
}*/

export interface CreateIncomeData {
  description: string
  amount: number
  date: string
}

export async function getIncomes(): Promise<Income[]> {
  const res = await axiosClient.get<Income[]>("/incomes")
  return res.data
}

export async function getIncome(id: number): Promise<Income> {
  const res = await axiosClient.get<Income>(`/incomes/${id}`)
  return res.data
}

export async function createIncome(
  data: CreateIncomeData
): Promise<Income> {
  const res = await axiosClient.post<Income>("/incomes", data)
  return res.data
}

export async function updateIncome(
  id: number,
  data: CreateIncomeData
): Promise<Income> {
  const res = await axiosClient.put<Income>(`/incomes/${id}`, data)
  return res.data
}

export async function deleteIncome(id: number): Promise<void> {
  await axiosClient.delete(`/incomes/${id}`)
}
