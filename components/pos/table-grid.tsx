"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TableActions } from "./table-actions"
import { TableForm } from "./table-form"
import { SearchFilter } from "./search-filter"
import { Users } from "lucide-react"
import type { Table } from "@/lib/types/pos"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TableGridProps {
  tables: Table[]
  onSelectTable: (table: Table) => void
}

const statusConfig = {
  available: { label: "Trống", color: "bg-green-500", textColor: "text-green-700" },
  serving: { label: "Đang phục vụ", color: "bg-blue-500", textColor: "text-blue-700" },
  completed: { label: "Hoàn thành", color: "bg-purple-500", textColor: "text-purple-700" }
}

export function TableGrid({ tables, onSelectTable }: TableGridProps) {
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterArea, setFilterArea] = useState("all")

  const areas = useMemo(() => {
    const uniqueAreas = new Set(tables.map(t => t.area).filter(Boolean))
    return Array.from(uniqueAreas) as string[]
  }, [tables])

  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchSearch = table.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true
      const matchArea = filterArea === "all" || table.area === filterArea
      return matchSearch && matchArea
    })
  }, [tables, searchTerm, filterArea])

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterArea={filterArea}
        onFilterChange={setFilterArea}
        areas={areas}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTables.map((table, index) => {
          const config = statusConfig[table.status] || statusConfig.available
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
            <Card
              className={cn(
                "p-6 cursor-pointer hover:shadow-xl transition-all relative",
                "border-2",
                table.status === "available" && "hover:border-green-500",
                table.status === "serving" && "border-blue-300",
                table.status === "completed" && "border-purple-300"
              )}
              onClick={() => onSelectTable(table)}
            >
              <TableActions
                table={table}
                onEdit={() => {
                  setEditingTable(table)
                  setShowEditForm(true)
                }}
                onRefresh={() => {}}
              />
            <div className="flex flex-col items-center gap-3">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", config.color)}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{table.name}</h3>
                {table.area && <p className="text-xs text-muted-foreground">{table.area}</p>}
              </div>
              <Badge variant="outline" className={config.textColor}>
                {config.label}
              </Badge>
              {table.capacity && (
                <p className="text-xs text-muted-foreground">{table.capacity} chỗ</p>
              )}
              {(table.status === "serving" || table.status === "completed") && table.currentOrderId && (
                <div className={`text-xs text-center mt-2 p-2 rounded ${
                  table.status === "completed" 
                    ? "bg-purple-50 dark:bg-purple-900/20" 
                    : "bg-blue-50 dark:bg-blue-900/20"
                }`}>
                  <p className={`font-semibold ${
                    table.status === "completed"
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-blue-700 dark:text-blue-300"
                  }`}>
                    {table.status === "completed" ? "Hoàn thành" : "Đang phục vụ"}
                  </p>
                  <p className={`text-[10px] ${
                    table.status === "completed"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}>#{table.currentOrderId.slice(0, 8)}</p>
                </div>
              )}
              </div>
            </Card>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bàn</DialogTitle>
          </DialogHeader>
          {editingTable && (
            <TableForm
              table={editingTable}
              onSuccess={() => {
                setShowEditForm(false)
                setEditingTable(null)
              }}
              onCancel={() => {
                setShowEditForm(false)
                setEditingTable(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
