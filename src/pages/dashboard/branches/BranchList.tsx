import { useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBranches, deleteBranch } from "../../../api/branches"
import type { Branch } from "../../../types/branch"
import { Button } from "../../../components/ui/button"
import { ConfirmDialog } from "../../../components/ui/confirmDialog"
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa"
import { useApi } from "../../../hooks/useApi"
import { toast } from "sonner"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table"
import { SkeletonPage } from "../../../components/ui/skeletonPage"

export default function BranchList() {
  const navigate = useNavigate()
  const api = useApi<Branch[]>()
  const actionApi = useApi<void>()

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  /*const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data: Branch[] = await getBranches()
      setBranches(data)
    } catch (err: any) {
      setError(err?.message || "Error cargando sucursales")

      if ([401, 403].includes(err?.response?.status)) {
        localStorage.removeItem("token")
        navigate("/auth/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])*/

  useEffect(() => {
    api.call(() => getBranches())
  }, [])

  /*async function handleDelete(id: number) {
    if (!confirm("Borrar sucursal?")) return
    try {
      await deleteBranch(id)
      load()
    } catch (err: any) {
      alert("Error borrando: " + (err?.response?.data || err.message))
    }
  }*/

  const handleView = useCallback(
    (id: number) => navigate(`/branches/view/${id}`),
    [navigate]
  )

  const handleEdit = useCallback(
    (id: number) => navigate(`/branches/edit/${id}`),
    [navigate]
  )

  const handleRemove = useCallback((id: number) => {
    setConfirmDeleteId(id)
  }, [])

  const confirmRemove = useCallback(async () => {
    if (!confirmDeleteId) return
    try {
      await actionApi.call(() => deleteBranch(confirmDeleteId))
      toast.success("Sucursal eliminada")
      api.call(() => getBranches())
      setConfirmDeleteId(null)
    } catch {
      toast.error("Error al eliminar sucursal")
    }
  }, [confirmDeleteId])

  if (api.loading && !api.data) return <SkeletonPage />

  /*return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sucursales</h1>
        <Button variant="ghost" onClick={() => navigate(`/branches/create`)}>
          <FaPlus />
        </Button>
      </div>

      {branches.length === 0 && <div>No hay sucursales</div>}

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Calle</th>
            <th className="text-left p-2">Teléfono</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(b => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.address}</td>
              <td className="p-2">{b.phone}</td>

              <td className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/branches/view/${b.id}`)}>
                  <FaEye />
                </Button>

                <Button variant="ghost" onClick={() => navigate(`/branches/edit/${b.id}`)}>
                  <FaEdit />
                </Button>

                <Button variant="ghost" onClick={() => handleDelete(b.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )*/
  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sucursales</h1>
        <Button variant="ghost" onClick={() => navigate(`/branches/create`)}>
          <FaPlus />
        </Button>
      </div>

      <div className="flex-1 overflow-auto min-h-[76vh]">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead width="30%">Nombre</TableHead>
              <TableHead width="40%">Dirección</TableHead>
              <TableHead width="20%">Teléfono</TableHead>
              <TableHead width="10%">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {api.data?.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.address || "-"}</TableCell>
                <TableCell>{b.phone || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" onClick={() => handleView(b.id)}>
                      <FaEye />
                    </Button>
                    <Button variant="ghost" onClick={() => handleEdit(b.id)}>
                      <FaEdit />
                    </Button>
                    <Button variant="ghost" onClick={() => handleRemove(b.id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Eliminar sucursal"
        description="¿Estás seguro?"
        confirmText="Si"
        cancelText="No"
        onConfirm={confirmRemove}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
