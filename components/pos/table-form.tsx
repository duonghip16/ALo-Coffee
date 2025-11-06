"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTable, updateTable } from "@/lib/table-service"
import type { Table, TableStatus } from "@/lib/types/pos"
import { toast } from "sonner"

interface TableFormProps {
  table?: Table
  onSuccess: () => void
  onCancel: () => void
}

export function TableForm({ table, onSuccess, onCancel }: TableFormProps) {
  const [name, setName] = useState(table?.name || "")
  const [area, setArea] = useState(table?.area || "")
  const [capacity, setCapacity] = useState(table?.capacity?.toString() || "")
  const [status, setStatus] = useState<TableStatus>(table?.status || "available")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (table) {
        await updateTable(table.id, { name, area, capacity: Number(capacity), status })
        toast.success("Cập nhật bàn thành công")
      } else {
        await createTable({ name, area, capacity: Number(capacity), status })
        toast.success("Thêm bàn thành công")
      }
      onSuccess()
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tên bàn *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bàn 1" required />
      </div>
      <div>
        <Label>Khu vực</Label>
        <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Tầng 1" />
      </div>
      <div>
        <Label>Số chỗ ngồi</Label>
        <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="4" />
      </div>
      <div>
        <Label>Trạng thái</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as TableStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Trống</SelectItem>
            <SelectItem value="serving">Đang phục vụ</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Hủy
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Đang lưu..." : table ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  )
}
