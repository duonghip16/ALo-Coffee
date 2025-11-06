"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterArea?: string
  onFilterChange?: (value: string) => void
  areas?: string[]
}

export function SearchFilter({ searchTerm, onSearchChange, filterArea, onFilterChange, areas }: SearchFilterProps) {
  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bàn..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {areas && areas.length > 0 && onFilterChange && (
        <Select value={filterArea} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Khu vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {areas.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
