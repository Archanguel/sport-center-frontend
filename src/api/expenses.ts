import axiosClient from "./axiosClient"
import type { Expense } from "../types/expense"

/*export interface Expense {
  id: number
  description: string
  amount: number
  date: string
}*/

export interface CreateExpenseData {
  description: string
  amount: number
  date: string
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await axiosClient.get<Expense[]>("/expenses")
  return res.data
}

export async function getExpense(id: number): Promise<Expense> {
  const res = await axiosClient.get<Expense>(`/expenses/${id}`)
  return res.data
}

export async function createExpense(
  data: CreateExpenseData
): Promise<Expense> {
  const res = await axiosClient.post<Expense>("/expenses", data)
  return res.data
}

export async function updateExpense(
  id: number,
  data: CreateExpenseData
): Promise<Expense> {
  const res = await axiosClient.put<Expense>(`/expenses/${id}`, data)
  return res.data
}

export async function deleteExpense(id: number): Promise<void> {
  await axiosClient.delete(`/expenses/${id}`)
}
