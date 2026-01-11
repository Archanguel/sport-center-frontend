import { useState, ReactElement } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  FaBuilding,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaMoneyBillWave,
  FaChartLine,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
} from "react-icons/fa"
import { MdSportsTennis } from "react-icons/md"
import { useGlobalLoading } from "../../context/GlobalLoadingContext"
import { cn } from "../../lib/utils"

interface SidebarLink {
  to: string
  label: string
  icon: ReactElement
}

const links: SidebarLink[] = [
  //{ to: "/", label: "Inicio" },
   { to: "/branches", label: "Sucursales", icon: <FaBuilding /> },
  { to: "/company", label: "Compañía", icon: <FaBuilding /> },
  { to: "/courts", label: "Canchas", icon: <MdSportsTennis /> },
  { to: "/tournaments", label: "Torneos", icon: <FaTrophy /> },
  { to: "/reservations", label: "Reservaciones", icon: <FaCalendarAlt /> },
  { to: "/users", label: "Usuarios", icon: <FaUsers /> },
  { to: "/expenses", label: "Gastos", icon: <FaMoneyBillWave /> },
  { to: "/incomes", label: "Ganancias", icon: <FaMoneyBillWave /> },
  { to: "/reports", label: "Reportes", icon: <FaChartLine /> },
  { to: "/profile", label: "Mi Perfil", icon: <FaUser /> },
]

export default function Sidebar() {
  const { isLoading } = useGlobalLoading()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/auth/login", { replace: true })
  }

  return (
    <aside
      className={cn(
        "h-screen bg-card text-card-foreground flex flex-col transition-all duration-200 shadow-[4px_0_20px_rgba(0,0,0,0.6)]",
        collapsed ? "w-15" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        {!collapsed && <span className="font-bold">Sport Center</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-2 transition-colors cursor-pointer hover:[background-color:hsl(var(--accent))] hover:[color:hsl(var(--accent-foreground))]"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={e => {
              if (isLoading) {
                e.preventDefault()
                alert("Hay una operación en curso, esperá a que termine")
              }
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:[background-color:hsl(var(--accent))] hover:[color:hsl(var(--accent-foreground))]",
                isActive && "bg-primary text-primary-foreground",
                isLoading && "opacity-50 pointer-events-none"
              )
            }
          >
            <span className="text-lg">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        disabled={isLoading}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:[background-color:hsl(var(--destructive))] hover:[color:hsl(var(--destructive-foreground))]"
      >
        <FaSignOutAlt />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}