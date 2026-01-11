import type { ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { GlobalLoadingProvider } from "../context/GlobalLoadingContext"

import Login from "../pages/auth/Login"
import DashboardLayout from "../components/layout/DashboardLayout"
import PrivateRoute from "./PrivateRoute"
// Branches
import BranchList from "../pages/dashboard/branches/BranchList"
import BranchCreate from "../pages/dashboard/branches/BranchCreate"
import BranchEdit from "../pages/dashboard/branches/BranchEdit"
import BranchView from "../pages/dashboard/branches/BranchView"
// Companies
import CompanyEntry from "../pages/dashboard/companies/CompanyEntry"
import CompanyDetail from "../pages/dashboard/companies/CompanyDetail"
// Courts
import CourtList from "../pages/dashboard/courts/CourtList"
import CourtCreate from "../pages/dashboard/courts/CourtCreate"
import CourtEdit from "../pages/dashboard/courts/CourtEdit"
import CourtView from "../pages/dashboard/courts/CourtView"
// Expenses
import ExpenseList from "../pages/dashboard/expenses/ExpenseList"
import ExpenseCreate from "../pages/dashboard/expenses/ExpenseCreate"
import ExpenseEdit from "../pages/dashboard/expenses/ExpenseEdit"
import ExpenseView from "../pages/dashboard/expenses/ExpenseView"
// Incomes
import IncomeList from "../pages/dashboard/incomes/IncomeList"
import IncomeCreate from "../pages/dashboard/incomes/IncomeCreate"
import IncomeEdit from "../pages/dashboard/incomes/IncomeEdit"
import IncomeView from "../pages/dashboard/incomes/IncomeView"
// Reservations
import ReservationList from "../pages/dashboard/reservations/ReservationList"
import ReservationCreate from "../pages/dashboard/reservations/ReservationCreate"
import ReservationEdit from "../pages/dashboard/reservations/ReservationEdit"
import ReservationView from "../pages/dashboard/reservations/ReservationView"
// Tournaments
import TournamentList from "../pages/dashboard/tournaments/TournamentList"
import TournamentCreate from "../pages/dashboard/tournaments/TournamentCreate"
import TournamentEdit from "../pages/dashboard/tournaments/TournamentEdit"
import TournamentView from "../pages/dashboard/tournaments/TournamentView"
// Users
import UserList from "../pages/dashboard/users/UserList"
import UserCreate from "../pages/dashboard/users/UserCreate"
import UserEdit from "../pages/dashboard/users/UserEdit"
import UserView from "../pages/dashboard/users/UserView"
import UserProfile from "../pages/dashboard/users/UserProfile"
// Reports
import ReportsPage from "../pages/dashboard/reports/ReportsPage"

export default function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <GlobalLoadingProvider>
        <Routes>
          <Route path="/auth/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              {/* Company */}
              <Route index element={<CompanyEntry />} />
              <Route path="companyEntry" element={<CompanyEntry />} />
              <Route path="company" element={<CompanyDetail />} />

              {/* Branches */}
              <Route path="branches" element={<BranchList />} />
              <Route path="branches/create" element={<BranchCreate />} />
              <Route path="branches/edit/:id" element={<BranchEdit />} />
              <Route path="branches/view/:id" element={<BranchView />} />

              {/* Courts */}
              <Route path="courts" element={<CourtList />} />
              <Route path="courts/create" element={<CourtCreate />} />
              <Route path="courts/edit/:id" element={<CourtEdit />} />
              <Route path="courts/view/:id" element={<CourtView />} />

              {/* Expenses */}
              <Route path="expenses" element={<ExpenseList />} />
              <Route path="expenses/create" element={<ExpenseCreate />} />
              <Route path="expenses/edit/:id" element={<ExpenseEdit />} />
              <Route path="expenses/view/:id" element={<ExpenseView />} />

              {/* Incomes */}
              <Route path="incomes" element={<IncomeList />} />
              <Route path="incomes/create" element={<IncomeCreate />} />
              <Route path="incomes/edit/:id" element={<IncomeEdit />} />
              <Route path="incomes/view/:id" element={<IncomeView />} />

              {/* Reservations */}
              <Route path="reservations" element={<ReservationList />} />
              <Route path="reservations/create" element={<ReservationCreate />} />
              <Route path="reservations/edit/:id" element={<ReservationEdit />} />
              <Route path="reservations/view/:id" element={<ReservationView />} />

              {/* Tournaments */}
              <Route path="tournaments" element={<TournamentList />} />
              <Route path="tournaments/create" element={<TournamentCreate />} />
              <Route path="tournaments/edit/:id" element={<TournamentEdit />} />
              <Route path="tournaments/view/:id" element={<TournamentView />} />

              {/* Users */}
              <Route path="users" element={<UserList />} />
              <Route path="users/create" element={<UserCreate />} />
              <Route path="users/edit/:id" element={<UserEdit />} />
              <Route path="users/view/:id" element={<UserView />} />
              <Route path="profile" element={<UserProfile />} />

              {/* Reports */}
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GlobalLoadingProvider>
    </BrowserRouter>
  )
}
