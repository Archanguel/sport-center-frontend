import axiosClient from "./axiosClient"
import type { Branch, BranchListItem, BranchPageResponse } from "../types/branch"

export async function getBranches(params: {
  page: number
  size: number
  name?: string
  address?: string
  sort?: string
}): Promise<BranchPageResponse> {
  const res = await axiosClient.get("/branches", { params })
  return res.data
}

export async function getAllBranches(): Promise<Branch[]> {
  const res = await axiosClient.get("/branches")
  // The server may return either an array or a paginated object { content: Branch[], ... }
  if (Array.isArray(res.data)) return res.data as Branch[]
  if (res.data && Array.isArray(res.data.content)) return res.data.content as Branch[]
  return []
} 


export interface CreateBranchData {
  name: string
  address?: string
  phone?: string
}

/*export async function getBranches(): Promise<Branch[]> {
  const res = await axiosClient.get<Branch[]>("/branches")
  return res.data
}*/

export async function getBranch(id: number): Promise<Branch> {
  const res = await axiosClient.get<Branch>(`/branches/${id}`)
  return res.data
}

export async function createBranch(data: CreateBranchData): Promise<Branch> {
  const res = await axiosClient.post<Branch>("/branches", data)
  return res.data
}

export async function updateBranch(
  id: number,
  data: CreateBranchData
): Promise<Branch> {
  const res = await axiosClient.put<Branch>(`/branches/${id}`, data)
  return res.data
}

export async function deleteBranch(id: number): Promise<void> {
  await axiosClient.delete(`/branches/${id}`)
}
