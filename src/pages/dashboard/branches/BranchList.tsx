import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa"
import { toast } from "sonner"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"

import { getBranches, deleteBranch } from "../../../api/branches"
import type {
  BranchListItem,
  BranchFilters,
  BranchPageResponse,
  BranchSortState,
} from "../../../types/branch"

import { useApi } from "../../../hooks/useApi"
import { Button } from "../../../components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table"
import { SkeletonPage } from "../../../components/ui/skeletonPage"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip"

export default function BranchList() {
  const navigate = useNavigate()
  const api = useApi<BranchPageResponse>()
  const actionApi = useApi<void>()

  const [filters, setFilters] = useState<BranchFilters>({
    name: "",
    address: "",
  })

  const [sort, setSort] = useState<BranchSortState>({
    key: "name",
    direction: "asc",
  })

  const [page, setPage] = useState(0)
  const size = 10

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameRefForRequest = useRef<string>("")

  /* ======================
     LOAD CON DEBOUNCE
  ====================== */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      nameRefForRequest.current = filters.name

      api.call(() =>
        getBranches({
          page,
          size,
          name: filters.name || undefined,
          address: filters.address || undefined,
          sort: `${sort.key},${sort.direction}`,
        })
      )
    }, 300) 

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters.name, filters.address])

  /* ======================
     LOAD SIN DEBOUNCE
  ====================== */
  useEffect(() => {
    if (nameRefForRequest.current !== filters.name) return

    api.call(() =>
      getBranches({
        page,
        size,
        name: filters.name || undefined,
        address: filters.address || undefined,
        sort: `${sort.key},${sort.direction}`,
      })
    )
  }, [page, sort.key, sort.direction])

  /* ======================
     SORT
  ====================== */
  function toggleSort(key: BranchSortState["key"]) {
    setSort(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
    setPage(0)
  }

  /* ======================
     ACTIONS
  ====================== */
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const handleDelete = useCallback((id: number) => {
    setConfirmDeleteId(id)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return
    try {
      await actionApi.call(() => deleteBranch(confirmDeleteId))
      toast.success("Sucursal eliminada")

      api.call(() =>
        getBranches({
          page,
          size,
          name: filters.name || undefined,
          address: filters.address || undefined,
          sort: `${sort.key},${sort.direction}`,
        })
      )
      setConfirmDeleteId(null)
    } catch {
      toast.error("Error al eliminar sucursal")
    }
  }, [confirmDeleteId, page, filters, sort])

  if ((api.loading && !api.data)) return <SkeletonPage />

  return (
    <div className="p-4 flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sucursales</h1>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => navigate("/branches/create")}>
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
          value={filters.name}
          onChange={e => {
            setFilters(f => ({ ...f, name: e.target.value }))
            setPage(0)
          }}
        />

        <input
          className="border p-2"
          placeholder="Dirección"
          value={filters.address}
          onChange={e => {
            setFilters(f => ({ ...f, address: e.target.value }))
            setPage(0)
          }}
        />
      </div>

      {/* TABLA */}
      <div className="flex-1 overflow-auto min-h-[76vh]">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead
                className="cursor-pointer"
                width="40%"
                onClick={() => toggleSort("name")}
              >
                Nombre
              </TableHead>
              <TableHead
                className="cursor-pointer"
                width="40%"
                onClick={() => toggleSort("address")}
              >
                Dirección
              </TableHead>
              <TableHead width="10%">Teléfono</TableHead>
              <TableHead width="10%">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {api.data?.content.map(b => (
              <TableRow key={b.id} className="border-t border-border hover:[background-color:hsl(var(--secondary))]">
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.address ?? "-"}</TableCell>
                <TableCell>{b.phone ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" onClick={() => navigate(`/branches/view/${b.id}`)}>
                          <FaEye />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver</TooltipContent>
                    </Tooltip>

                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" onClick={() => navigate(`/branches/edit/${b.id}`)}>
                          <FaEdit />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>

                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" onClick={() => setConfirmDeleteId(b.id)}>
                          <FaTrash />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> 
        </Table>
      </div>

      {/* PAGINADO */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="ghost"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
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
        title="Eliminar sucursal"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
