import axiosClient from "./axiosClient"
import type { Company } from "../types/company"

/*export interface Company {
  id: number
  name: string
}*/

export interface CreateCompanyData {
  name: string
}

export interface JoinCompanyData {
  code: string
}

export async function getCompany(id: number): Promise<Company> {
  const res = await axiosClient.get<Company>(`/companies/${id}`)
  return res.data
}

export async function createCompany(
  data: CreateCompanyData
): Promise<Company> {
  const res = await axiosClient.post<Company>("/companies", data)
  return res.data
}

export async function updateCompany(
  id: number,
  data: CreateCompanyData
): Promise<Company> {
  const res = await axiosClient.put<Company>(`/companies/${id}`, data)
  return res.data
}

export async function deleteCompany(id: number): Promise<void> {
  await axiosClient.delete(`/companies/${id}`)
}

export async function joinCompany(
  data: JoinCompanyData
): Promise<Company> {
  const res = await axiosClient.post<Company>("/companies/join", data)
  return res.data
}
