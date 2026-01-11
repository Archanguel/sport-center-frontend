import type { Court } from "./court"

export type Tournament = {
  id: number
  name: string
  startDate: string
  endDate: string
  status: string
  description: string
  court: Court
}

export type TournamentForm = {
  name: string
  startDate: string
  endDate: string
  status: boolean
  description: string
  courtId: string
}
