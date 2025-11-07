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
                "p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                "border-2 shadow-lg hover:shadow-2xl",
                table.status === "available" && "bg-gradient-to-br from-white to-green-50 dark:from-[#3d2817] dark:to-[#2d5016]/20 border-green-200 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500",
                table.status === "serving" && "bg-gradient-to-br from-white to-blue-50 dark:from-[#3d2817] dark:to-blue-900/20 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500",
                table.status === "completed" && "bg-gradient-to-br from-white to-purple-50 dark:from-[#3d2817] dark:to-purple-900/20 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500"
              )}
              onClick={() => onSelectTable(table)}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <TableActions
                table={table}
                onEdit={() => {
                  setEditingTable(table)
                  setShowEditForm(true)
                }}
                onRefresh={() => {}}
              />
            <div className="flex flex-col items-center gap-3 relative z-10">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
                  config.color,
                  "group-hover:shadow-xl"
                )}
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <div className="text-center">
                <motion.h3 
                  whileHover={{ scale: 1.05 }}
                  className="font-extrabold text-xl text-[#2A1A12] dark:text-[#FFF9F0]"
                >
                  {table.name}
                </motion.h3>
                {table.area && <p className="text-xs font-semibold text-muted-foreground dark:text-[#E8DCC8]">{table.area}</p>}
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  config.textColor,
                  "font-bold px-3 py-1 shadow-sm",
                  "dark:bg-[#5a3d28] dark:border-[#6B4423]"
                )}
              >
                {config.label}
              </Badge>
              {table.capacity && (
                <p className="text-xs text-muted-foreground">{table.capacity} chỗ</p>
              )}
              {(table.status === "serving" || table.status === "completed") && table.currentOrderId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "text-xs text-center mt-2 p-3 rounded-xl shadow-md border-2",
                    table.status === "completed" 
                      ? "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-700" 
                      : "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700"
                  )}
                >
                  <p className={cn(
                    "font-extrabold text-sm",
                    table.status === "completed"
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-blue-700 dark:text-blue-300"
                  )}>
                    {table.status === "completed" ? "✅ Hoàn thành" : "🔥 Đang phục vụ"}
                  </p>
                  <p className={cn(
                    "text-xs font-mono font-bold mt-1",
                    table.status === "completed"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-blue-600 dark:text-blue-400"
                  )}>#{table.currentOrderId.slice(0, 8)}</p>
                </motion.div>
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
