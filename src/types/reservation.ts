import type { Court } from "./court"
import type { UserBase } from "./user"

export type Reservation = {
  id: number
  title: string
  startTime: string
  endTime: string
  players: number
  active: boolean
  notes: string
  //court: Court
  courtId: number
  courtName: string
  user: UserBase
}

export type ReservationForm = {
  title: string
  startTime: string
  endTime: string
  players: number
  courtId: number
  notes: string
  active: boolean
}
