import { useEffect, useCallback, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getUsers, removeUserFromCompany } from "../../../api/users"
import { getAllBranches } from "../../../api/branches"
import type {
  SortState,
  UserFilters,
  UserListItem,
  UserPageResponse,
} from "../../../types/user"
import { Button } from "../../../components/ui/button"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip"
import { useApi } from "../../../hooks/useApi"
import { toast } from "sonner"
import { Branch } from "../../../types/branch"
import Select from "react-select"
import React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table"
import { SkeletonPage } from "../../../components/ui/skeletonPage"

type UserRowProps = {
  user: UserListItem
  loading: boolean
  onView: (id: number) => void
  onEdit: (id: number) => void
  onRemove: (id: number) => void
}

const UserRow = React.memo(function UserRow({
  user,
  loading,
  onView,
  onEdit,
  onRemove,
}: UserRowProps) {
  return (
    <TableRow className="border-t border-border hover:[background-color:hsl(var(--secondary))]">
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.enabled ? "Activo" : "Inactivo"}</TableCell>
      <TableCell>
        {user.branches?.length
          ? user.branches.map(b => b.name).join(", ")
          : "-"}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="ghost" disabled={loading} onClick={() => onView(user.id)}>
                <FaEye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver</TooltipContent>
          </Tooltip>

          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="ghost" disabled={loading} onClick={() => onEdit(user.id)}>
                <FaEdit />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="ghost" disabled={loading} onClick={() => onRemove(user.id)}>
                <FaTrash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remover</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  )
})

export default function UserList() {
  const navigate = useNavigate()
  const api = useApi<UserPageResponse>()
  const actionApi = useApi<void>()
  const branchesApi = useApi<Branch[]>()

  const [filters, setFilters] = useState<UserFilters>({
    username: "",
    enabled: "all",
    branchIds: [],
  })

  const [sort, setSort] = useState<SortState>({
    key: "username",
    direction: "asc",
  })

  const [page, setPage] = useState(0)
  const size = 13

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const usernameRefForRequest = useRef<string>("")

  useEffect(() => {
    branchesApi.call(() => getAllBranches())
  }, [])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      usernameRefForRequest.current = filters.username
      api.call(() =>
        getUsers({
          page,
          size,
          username: filters.username || undefined,
          enabled:
            filters.enabled === "all"
              ? undefined
              : filters.enabled === "active",
          branchIds: filters.branchIds.length
            ? filters.branchIds
            : undefined,
          sort: `${sort.key},${sort.direction}`,
        })
      )
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [filters.username])

  useEffect(() => {
    if (usernameRefForRequest.current !== filters.username) {
      return
    }

    api.call(() =>
      getUsers({
        page,
        size,
        username: filters.username || undefined,
        enabled:
          filters.enabled === "all"
            ? undefined
            : filters.enabled === "active",
        branchIds: filters.branchIds.length
          ? filters.branchIds
          : undefined,
        sort: `${sort.key},${sort.direction}`,
      })
    )
  }, [
    page,
    sort.key,
    sort.direction,
    filters.enabled,
    filters.branchIds,
  ])

  function toggleSort(key: SortState["key"]) {
    setSort(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
    setPage(0)
  }

  const handleUsernameChange = useCallback((value: string) => {
    setFilters(f => ({ ...f, username: value }))
  }, [])

  const handleView = useCallback(
    (id: number) => navigate(`/users/view/${id}`),
    [navigate]
  )

  const handleEdit = useCallback(
    (id: number) => navigate(`/users/edit/${id}`),
    [navigate]
  )

  const handleRemove = useCallback((id: number) => {
    setConfirmDeleteId(id)
  }, [])

  const confirmRemove = useCallback(async () => {
    if (!confirmDeleteId) return
    try {
      await actionApi.call(() => removeUserFromCompany(confirmDeleteId))
      toast.success("Usuario removido")
      api.call(() =>
        getUsers({
          page,
          size,
          username: filters.username || undefined,
          enabled:
            filters.enabled === "all" ? undefined : filters.enabled === "active",
          branchIds: filters.branchIds,
          sort: `${sort.key},${sort.direction}`,
        })
      )
      setConfirmDeleteId(null)
    } catch {
      toast.error("Error al remover usuario")
    }
  }, [confirmDeleteId, page, filters, sort])

  if ((api.loading && !api.data) || branchesApi.loading) return <SkeletonPage />

  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => navigate(`/users/create`)}>
              <FaPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Crear</TooltipContent>
        </Tooltip>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-4">
        <input
          className="border p-2"
          placeholder="Nombre"
          value={filters.username}
          onChange={e => {
            handleUsernameChange(e.target.value)
            focus()
          }}
        />

        <select
          className="border p-2"
          value={filters.enabled}
          onChange={e => {
            setFilters(f => ({
              ...f,
              enabled: e.target.value as UserFilters["enabled"],
            }))
            setPage(0)
          }}
        >
          <option value="all">Todos</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        <Select
          isMulti
          className="min-w-[250px]"
          options={(branchesApi.data ?? []).map(b => ({
            value: b.id,
            label: b.name,
          }))}
          value={(branchesApi.data ?? [])
            .filter(b => filters.branchIds.includes(b.id))
            .map(b => ({
              value: b.id,
              label: b.name,
            }))}
          onChange={values => {
            setFilters(f => ({
              ...f,
              branchIds: values.map(v => v.value),
            }))
            setPage(0)
          }}
          placeholder="Sucursales"
        />
      </div>

      {/* TABLA */}
      <div className="flex-1 overflow-auto min-h-[76vh]">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead className="cursor-pointer" width="20%" onClick={() => toggleSort("username")}>
                Nombre
              </TableHead>
              <TableHead className="cursor-pointer" width="5%" onClick={() => toggleSort("enabled")}>
                Estado
              </TableHead>
              <TableHead className="cursor-pointer" width="65%" onClick={() => toggleSort("branches")}>
                Sucursales
              </TableHead>
              <TableHead width="10%">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {api.data?.content.map(u => (
              <UserRow
                key={u.id}
                user={u}
                loading={api.loading}
                onView={handleView}
                onEdit={handleEdit}
                onRemove={handleRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINADO */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
          Anterior
        </Button>
        <span className="self-center">
          {page + 1} / {api.data?.totalPages ?? 1}
        </span>
        <Button
          variant="ghost"
          disabled={page + 1 >= (api.data?.totalPages ?? 1)}
          onClick={() => setPage(p => p + 1)}
        >
          Siguiente
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Remover usuario de la compañía"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
