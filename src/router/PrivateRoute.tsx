import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute(): ReactElement {
  const token = localStorage.getItem("token")

  return token ? <Outlet /> : <Navigate to="/auth/login" replace />
}
