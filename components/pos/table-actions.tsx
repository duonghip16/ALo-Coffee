"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { deleteTable } from "@/lib/table-service"
import type { Table } from "@/lib/types/pos"
import { toast } from "sonner"

interface TableActionsProps {
  table: Table
  onEdit: () => void
  onRefresh: () => void
}

export function TableActions({ table, onEdit, onRefresh }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteTable(table.id)
      toast.success("Đã xóa bàn")
      onRefresh()
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-2 right-2">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#6B4423]">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    <ConfirmDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}
      title="Xóa bàn"
      description={`Bạn có chắc chắn muốn xóa ${table.name}? Hành động này không thể hoàn tác.`}
      onConfirm={() => {
        handleDelete()
        setShowDeleteDialog(false)
      }}
    />
    </>
  )
}
