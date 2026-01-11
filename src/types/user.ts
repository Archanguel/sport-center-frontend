import type { Company } from "./company"
import type { Branch } from "./branch"

export type UserRole = "USER" | "ADMIN" | "OWNER"

export type BranchLite = {
  id: number
  name: string
}

export type UserListItem = {
  id: number
  username: string
  enabled: boolean
  branches: BranchLite[]
}

export type UserBase = {
  id: number
  username: string
  email: string
  role: UserRole
  enabled: boolean
  company?: Company
}

export type UserDetail = UserBase & {
  branches: Branch[]
}

export type UserForm = {
  username: string
  email: string
  password?: string
}

export type UserFilters = {
  username: string
  enabled: "all" | "active" | "inactive"
  branchIds: number[]
}

export type SortState = {
  key: "username" | "enabled" | "branches"
  direction: "asc" | "desc"
}

export type UserPageResponse = {
  content: UserListItem[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
