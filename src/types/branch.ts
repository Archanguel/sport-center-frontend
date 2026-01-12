export type Branch = {
  id: number
  name: string
  address?: string
  phone?: string
}

export type BranchListItem = {
  id: number
  name: string
  address?: string
  phone?: string
}

export type BranchForm = {
  name: string
  address?: string
  phone?: string
}

export type BranchFilters = {
  name: string
  address: string
}

export type BranchSortState = {
  key: "name" | "address"
  direction: "asc" | "desc"
}

export type BranchPageResponse = {
  content: BranchListItem[]
  totalPages: number
  totalElements: number
  number: number
  size: number
} 
