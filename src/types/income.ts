import type { Branch } from "./branch"

export type Income = {
  id: number
  amount: number
  description: string
  date: string // LocalDate → string ISO
  category: string
  branch: Branch
}

export type IncomeForm = {
  amount: string
  description: string
  date: string
  category: string
}
