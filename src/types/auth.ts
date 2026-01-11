import type { UserRole } from "./user"

export type CurrentUser = {
  id: number
  username: string
  email: string
  role: UserRole
  companyId?: number | null
}
