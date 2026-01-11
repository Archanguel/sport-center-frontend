import axiosClient from "./axiosClient"
import type { Tournament } from "../types/tournament"

/*export interface Tournament {
  id: number
  name: string
}*/

export interface CreateTournamentData {
  name: string
}

export async function getTournaments(): Promise<Tournament[]> {
  const res = await axiosClient.get<Tournament[]>("/tournaments")
  return res.data
}

export async function getTournament(id: number): Promise<Tournament> {
  const res = await axiosClient.get<Tournament>(`/tournaments/${id}`)
  return res.data
}

export async function createTournament(
  data: CreateTournamentData
): Promise<Tournament> {
  const res = await axiosClient.post<Tournament>("/tournaments", data)
  return res.data
}

export async function updateTournament(
  id: number,
  data: CreateTournamentData
): Promise<Tournament> {
  const res = await axiosClient.put<Tournament>(
    `/tournaments/${id}`,
    data
  )
  return res.data
}

export async function deleteTournament(id: number): Promise<void> {
  await axiosClient.delete(`/tournaments/${id}`)
}
