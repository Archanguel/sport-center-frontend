import type { Branch } from "./branch"

export type Expense = {
  id: number
  amount: number
  description: string
  date: string
  category: string
  branch: Branch
}

export type ExpenseForm = {
  amount: string;
  description: string;
  date: string;
  category: string;
}
