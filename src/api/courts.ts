import axiosClient from "./axiosClient"
import type { Court } from "../types/court"

/*export interface Court {
  id: number
  name: string
  branchId: number
}*/

export interface CreateCourtData {
  name: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
}

export async function getCourts(): Promise<Court[]> {
  const res = await axiosClient.get<PaginatedResponse<Court>>("/courts")
  return res.data.content
}

export async function getCourt(id: number): Promise<Court> {
  const res = await axiosClient.get<Court>(`/courts/${id}`)
  return res.data
}

export async function createCourt(
  data: CreateCourtData,
  branchId: number
): Promise<Court> {
  const res = await axiosClient.post<Court>(
    `/courts?branchId=${branchId}`,
    data
  )
  return res.data
}

export async function updateCourt(
  id: number,
  data: CreateCourtData,
  branchId: number
): Promise<Court> {
  const res = await axiosClient.put<Court>(
    `/courts/${id}?branchId=${branchId}`,
    data
  )
  return res.data
}

export async function deleteCourt(id: number): Promise<void> {
  await axiosClient.delete(`/courts/${id}`)
}
