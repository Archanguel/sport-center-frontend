import axiosClient from "./axiosClient"
import type { UserListItem, UserDetail, UserForm, UserBase, UserPageResponse } from "../types/user"

export async function getUsers(params: {
  page: number
  size: number
  username?: string
  enabled?: boolean
  branchIds?: number[]
  sort?: string
}): Promise<UserPageResponse> {
  const res = await axiosClient.get("/users", { params })
  return res.data
}

export async function getUser(id: number): Promise<UserDetail> {
  const res = await axiosClient.get<UserDetail>(`/users/${id}`)
  return res.data
}

export async function createUser(
  data: UserForm
): Promise<UserDetail> {
  const res = await axiosClient.post<UserDetail>("/users", data)
  return res.data
}

export async function createUserWithCompany(
  data: UserForm
): Promise<UserDetail> {
  const res = await axiosClient.post<UserDetail>("/users/company", data)
  return res.data
}

export async function updateUser(
  id: number,
  data: Partial<UserForm>
): Promise<UserBase> {
  const res = await axiosClient.put<UserBase>(`/users/${id}`, data)
  return res.data
}

export async function deleteUser(id: number): Promise<void> {
  await axiosClient.delete(`/users/${id}`)
}

export async function removeUserFromCompany(id: number): Promise<void> {
  await axiosClient.put(`/users/${id}/remove-company`)
}

export async function updateUserBranches(
  id: number,
  branchIds: number[]
): Promise<void> {
  await axiosClient.put(`/users/${id}/branches`, branchIds)
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  await axiosClient.put("/users/change-password", data)
}
