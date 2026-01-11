import axiosClient from "./axiosClient"
import type { Branch } from "../types/branch"

/*export interface Branch {
  id: number
  name: string
  address?: string
  companyId: number
}*/

export interface CreateBranchData {
  name: string
  address?: string
  phone?: string
}

export async function getBranches(): Promise<Branch[]> {
  const res = await axiosClient.get<Branch[]>("/branches")
  return res.data
}

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
