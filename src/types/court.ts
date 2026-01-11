export type Court = {
  id: number
  name: string
  surface?: string
  maxPlayers?: number
  active?: boolean
  location?: string
  notes?: string
  branch?: {
    id: number
    name: string
  }
}

export type CourtForm = {
  name: string
  surface: string
  maxPlayers: number
  active: boolean
  location: string
  notes: string
  branchId: number
}
