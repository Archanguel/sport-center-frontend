import axios from "axios"
import { toast } from "sonner"

let startLoading: (() => void) | null = null
let stopLoading: (() => void) | null = null

export const bindGlobalLoading = (start: () => void, stop: () => void) => {
  startLoading = start
  stopLoading = stop
}

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
})

axiosClient.interceptors.request.use(config => {
  startLoading?.()

  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  res => {
    stopLoading?.()
    return res
  },
  error => {
    stopLoading?.()

    const data = error?.response?.data
    
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Error inesperado"

    /*const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Error inesperado"*/

    toast.error(message)

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/auth/login"
    }

    return Promise.reject(error)
  }
)

export default axiosClient
