import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const call = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fn()
      setData(res)
      return res
    } catch (err: any) {
      const status = err?.response?.status

      if (status === 401 || status === 403) {
        localStorage.removeItem("token")
        navigate("/auth/login")
      }

      setError(err?.response?.data?.error || err.message || "Error")
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  return { data, loading, error, call, setData }
}
