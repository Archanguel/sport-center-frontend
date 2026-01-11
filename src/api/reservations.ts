import axiosClient from "./axiosClient"
import type { Reservation, ReservationForm } from "../types/reservation"

/*export interface Reservation {
  id: number
  courtId: number
  startTime: string
  endTime: string
}

export interface CreateReservationData {
  courtId: number
  startTime: string
  endTime: string
}*/

export async function getReservations(): Promise<Reservation[]> {
  const res = await axiosClient.get<Reservation[]>("/reservations")
  return res.data
}

export async function getReservation(id: number): Promise<Reservation> {
  const res = await axiosClient.get<Reservation>(`/reservations/${id}`)
  return res.data
}

export async function createReservation(
  data: ReservationForm
): Promise<Reservation> {
  const res = await axiosClient.post<Reservation>("/reservations", data)
  return res.data
}

export async function updateReservation(
  id: number,
  data: ReservationForm
): Promise<Reservation> {
  const res = await axiosClient.put<Reservation>(
    `/reservations/${id}`,
    data
  )
  return res.data
}

export async function deleteReservation(id: number): Promise<void> {
  await axiosClient.delete(`/reservations/${id}`)
}
