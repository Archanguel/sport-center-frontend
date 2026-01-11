import { CurrentUser } from "../types/auth"
import axiosClient from "./axiosClient"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export const loginRequest = async (data: LoginData) => {
  const res = await axiosClient.post("/auth/login", data)
  return res.data
}

export const registerRequest = async (data: RegisterData) => {
  const res = await axiosClient.post("/auth/register", data)
  return res.data
}

export const forgotPasswordRequest = async (data: { email: string }) => {
  const res = await axiosClient.post("/auth/password/reset/request", data)
  return res.data
}

export const resetPasswordConfirm = async (data: {
  token: string | null
  newPassword: string
}) => {
  const res = await axiosClient.post("/auth/password/reset/confirm", data)
  return res.data
}

export function logoutRequest() {
  localStorage.removeItem("token")
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const res = await axiosClient.get("/auth/current-user")
  return res.data
}
