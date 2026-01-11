import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCurrentUser } from "../../api/auth"
import { Toaster } from "sonner"
import Sidebar from "./Sidebar"
import { useGlobalLoading } from "../../context/GlobalLoadingContext"
import { bindGlobalLoading } from "../../api/axiosClient"
import { CurrentUser } from "../../types/auth"

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { startLoading, stopLoading, isLoading } = useGlobalLoading()
  const [hasCompany, setHasCompany] = useState<boolean>(false)

  useEffect(() => {
    bindGlobalLoading(startLoading, stopLoading)
  }, [])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isLoading) return
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isLoading])

  useEffect(() => {
    getCurrentUser().then((user: CurrentUser) => {
      //console.log(user)
      if (user.companyId) {
        setHasCompany(true)
      } else {
        navigate("/companyEntry", { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-card">
      {hasCompany && <Sidebar />}

      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
    </div>
  )
}
