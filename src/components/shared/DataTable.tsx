"use client"

import React, { useState, useMemo, useRef } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Trash2,
    Search,
    Filter,
    Columns,
    SortAsc,
    SortDesc,
    Check,
    Database,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
    header: string | React.ReactNode
    accessorKey: keyof T | string
    cell?: (item: T, index: number) => React.ReactNode
    sortable?: boolean
    filterable?: boolean
    className?: string
    width?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchPlaceholder?: string
    searchKey?: keyof T
    searchKeys?: (keyof T)[]
    onView?: (item: T) => void
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    onBulkDelete?: (ids: string[]) => void
    isLoading?: boolean
    emptyState?: React.ReactNode
    toolbarActions?: React.ReactNode
    rowClickable?: boolean
    onRowClick?: (item: T) => void
    entityType?: string
    filters?: {
        key: keyof T
        label: string
        options: { label: string, value: string }[]
    }[]
    customRowActions?: (item: T) => { label: string, onClick: () => void, icon?: React.ReactNode, variant?: string }[]
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    searchPlaceholder = "Search records...",
    searchKey,
    searchKeys,
    onView,
    onEdit,
    onDelete,
    onBulkDelete,
    isLoading = false,
    emptyState,
    toolbarActions,
    rowClickable,
    onRowClick,
    entityType = "Record",
    filters: filterConfig,
    customRowActions
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        columns.map(c => c.accessorKey as string)
    )
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleHorizScroll = (dir: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300
            scrollContainerRef.current.scrollBy({
                left: dir === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    // Filtering & Sorting Logic
    const filteredData = useMemo(() => {
        let result = [...data]

        // Global Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const keys = searchKeys || (searchKey ? [searchKey] : [])
            
            if (keys.length > 0) {
                result = result.filter(item => {
                    return keys.some(key => {
                        const val = item[key]
                        return String(val).toLowerCase().includes(query)
                    })
                })
            }
        }

        // Active Filters
        Object.keys(activeFilters).forEach(key => {
            const filterValue = activeFilters[key]
            if (filterValue && filterValue !== "_all") {
                result = result.filter(item => {
                    const val = (item as any)[key]
                    return String(val) === filterValue
                })
            }
        })

        // Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = (a as any)[sortConfig.key]
                const bVal = (b as any)[sortConfig.key]
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [data, searchQuery, searchKey, searchKeys, sortConfig, activeFilters])

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredData.length && filteredData.length > 0) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredData.map(item => item.id)))
        }
    }

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIds(prev => {
            const n = new Set(prev)
            n.has(id) ? n.delete(id) : n.add(id)
            return n
        })
    }

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
            }
            return { key, direction: 'asc' }
        })
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-white rounded-[2.5rem] border border-border/80 shadow-sm">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Loading {entityType}s...</p>
            </div>
        )
    }

    const visibleColsData = columns.filter(c => visibleColumns.includes(c.accessorKey as string))

    return (
        <div className="flex flex-col border border-border/80 rounded-[2rem] bg-white shadow-2xl shadow-primary/5 overflow-hidden h-[calc(100vh-220px)] min-h-[500px]">
            {/* Filter / Search Bar */}
            {/* Filter / Search Bar */}
            <div className="h-24 bg-slate-50 border-b border-border flex items-center px-10 gap-6 shrink-0">
                <div className="relative w-[500px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 h-14 text-sm bg-white border border-border/80 rounded-2xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 font-bold placeholder:text-muted-foreground/30 transition-all focus-visible:border-primary/50"
                    />
                </div>
                
                {filterConfig && filterConfig.length > 0 && <div className="h-8 w-[1px] bg-border/60 mx-2" />}
                
                <div className="flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar max-w-[40%]">
                    {filterConfig?.map(filter => (
                        <Select
                            key={filter.key as string}
                            value={activeFilters[filter.key as string] || "_all"}
                            onValueChange={(val: any) => setActiveFilters(prev => ({ ...prev, [filter.key as string]: val }))}
                        >
                            <SelectTrigger className="h-14 rounded-2xl bg-white border border-border/80 min-w-[200px] font-bold text-xs text-foreground transition-all hover:bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/10 shadow-sm px-6">
                                <SelectValue placeholder={`Filter by ${filter.label}`} />
                            </SelectTrigger>
                            <SelectContent className="rounded-[1.5rem] border-border shadow-2xl p-2 bg-white ring-1 ring-black/5">
                                <SelectItem value="_all" className="font-bold text-xs text-muted-foreground rounded-xl py-3 cursor-pointer">All {filter.label}</SelectItem>
                                {filter.options.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold text-foreground rounded-xl py-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-6">
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-600 rounded-2xl px-6 py-3 border border-red-100 transition-all animate-in fade-in slide-in-from-right-4 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-widest">{selectedIds.size} selected</span>
                            <div className="h-4 w-[1px] bg-red-200 mx-2" />
                            <button onClick={() => {
                                if (onBulkDelete && confirm(`Are you sure you want to delete ${selectedIds.size} items? This action cannot be undone.`)) {
                                    onBulkDelete(Array.from(selectedIds))
                                    setSelectedIds(new Set())
                                }
                            }} className="text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Bulk Delete
                            </button>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center h-14 px-8 rounded-2xl border border-border/80 font-black uppercase tracking-widest text-[10px] hover:bg-white hover:border-primary/30 transition-all shadow-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/10">
                                <Columns className="h-4 w-4 mr-3 text-primary/60" /> Columns
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[280px] rounded-[1.5rem] shadow-2xl border border-border p-3 bg-white font-bold ring-1 ring-black/5">
                                <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/40 mb-2">Show/Hide Columns</div>
                                {columns.map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col.accessorKey as string}
                                        checked={visibleColumns.includes(col.accessorKey as string)}
                                        onCheckedChange={(checked) => {
                                            setVisibleColumns(prev =>
                                                checked
                                                    ? [...prev, col.accessorKey as string]
                                                    : prev.filter(c => c !== col.accessorKey)
                                            )
                                        }}
                                        className="text-xs rounded-xl py-3.5 cursor-pointer px-4 font-bold focus:bg-primary/5 focus:text-primary transition-all"
                                    >
                                        {typeof col.header === 'string' ? col.header : (col.accessorKey as string).charAt(0).toUpperCase() + (col.accessorKey as string).slice(1)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-2 border-l border-border pl-6 ml-2">
                            <Button variant="outline" size="icon" className="h-12 w-12 text-muted-foreground/60 hover:text-primary hover:bg-white hover:border-primary/30 rounded-2xl transition-all shadow-sm border-border/80" onClick={() => handleHorizScroll('left')}>
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-12 w-12 text-muted-foreground/60 hover:text-primary hover:bg-white hover:border-primary/30 rounded-2xl transition-all shadow-sm border-border/80" onClick={() => handleHorizScroll('right')}>
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {toolbarActions}
                </div>
            </div>

            {/* Data Grid / Spreadsheet */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto bg-white relative custom-scrollbar">
                <table className="w-full text-sm border-collapse table-fixed min-w-full">
                    <thead className="sticky top-0 z-[40] shadow-md border-b-2 border-slate-200">
                        <tr className="bg-slate-50 h-16">
                            <th className="w-20 h-16 sticky left-0 z-[50] bg-slate-50 border-r-2 border-slate-200 text-center px-0 shadow-[2px_0_10px_rgba(0,0,0,0.03)]">
                                <button onClick={toggleSelectAll} className="flex items-center justify-center w-full h-full transition-all active:scale-90">
                                    <div className={cn("h-5 w-5 rounded-[0.6rem] border-2 flex items-center justify-center transition-all shadow-sm",
                                        selectedIds.size === filteredData.length && filteredData.length > 0
                                            ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20"
                                            : "border-slate-300 bg-white hover:border-primary/50")}>
                                        {selectedIds.size === filteredData.length && filteredData.length > 0 && <Check className="h-3.5 w-3.5 stroke-[4]" />}
                                    </div>
                                </button>
                            </th>
                            {visibleColsData.map((col, i) => (
                                <th key={i} className="px-10 h-16 text-left border-r border-slate-200 font-black text-[11px] uppercase tracking-[0.2em] select-none hover:bg-slate-100/50 transition-colors whitespace-nowrap bg-slate-50 text-slate-500" style={{ width: col.width || '250px' }}>
                                    {col.sortable ? (
                                        <button onClick={() => handleSort(col.accessorKey as string)} className="flex items-center gap-3 w-full group transition-all">
                                            {col.header}
                                            <span className="transition-all transform group-hover:scale-110">
                                                {sortConfig?.key === col.accessorKey
                                                    ? (sortConfig.direction === "asc" ? <SortAsc className="h-4 w-4 text-primary" /> : <SortDesc className="h-4 w-4 text-primary" />)
                                                    : <SortAsc className="h-4 w-4 opacity-0 group-hover:opacity-100 text-slate-300" />}
                                            </span>
                                        </button>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            ))}
                            <th className="w-[160px] h-16 px-10 border-l-2 border-slate-200 bg-slate-50 sticky right-0 z-[50] font-black text-[11px] uppercase tracking-[0.2em] text-center shadow-[-2px_0_10px_rgba(0,0,0,0.03)] text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={visibleColsData.length + 2} className="text-center py-32 bg-slate-50/10 border-b border-border">
                                    {emptyState || (
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                                                <Database className="h-8 w-8" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">No {entityType.toLowerCase()}s found matching filters.</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map(item => {
                                const isSelected = selectedIds.has(item.id)
                                return (
                                    <tr key={item.id}
                                        className={cn("border-b border-slate-100 group transition-all relative h-20 hover:bg-slate-50/50",
                                            isSelected ? "bg-primary/[0.03]" : "bg-white",
                                            (rowClickable !== false && (onRowClick || onView)) && "cursor-pointer"
                                        )}
                                        onClick={() => {
                                            if (rowClickable !== false) {
                                                if (onRowClick) onRowClick(item)
                                                else if (onView) onView(item)
                                            }
                                        }}
                                    >
                                        <td className={cn("w-20 sticky left-0 z-[30] border-r-2 border-slate-100 text-center px-0 transition-all", 
                                            isSelected ? "bg-slate-50/80" : "bg-white group-hover:bg-slate-50/80 shadow-[2px_0_10px_rgba(0,0,0,0.03)]")}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={(e) => toggleSelect(item.id, e)} className="flex items-center justify-center w-full h-full transition-all active:scale-95">
                                                <div className={cn("h-5 w-5 rounded-[0.6rem] border-2 flex items-center justify-center transition-all shadow-sm",
                                                    isSelected ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : "border-slate-300 bg-white hover:border-primary/50")}>
                                                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[4]" />}
                                                </div>
                                            </button>
                                        </td>
                                        
                                        {visibleColsData.map((col, i) => (
                                            <td key={i} className={cn("px-10 h-20 border-r border-slate-100 text-sm font-bold text-slate-700 transition-all group-hover:text-primary transition-colors", col.className)}>
                                                <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                                    {col.cell ? col.cell(item, filteredData.indexOf(item)) : (item as any)[col.accessorKey]}
                                                </div>
                                            </td>
                                        ))}

                                        <td className="w-[160px] h-20 px-10 bg-white border-l-2 border-slate-100 group-hover:bg-slate-50 sticky right-0 z-[30] transition-all shadow-[-2px_0_10px_rgba(0,0,0,0.03)]">
                                            <div className="flex items-center gap-2 transition-all justify-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-12 w-12 p-0 text-slate-400 hover:text-primary hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-[1.1rem] focus:outline-none transition-all hover:rotate-90">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] shadow-2xl border border-border p-3 bg-white ring-1 ring-black/5" onClick={e=>e.stopPropagation()}>
                                                          <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/40 mb-2">Actions</div>
                                                          {(onView || onRowClick) && (
                                                              <DropdownMenuItem 
                                                                 onClick={() => (onView || onRowClick)?.(item)} 
                                                                 className="text-xs font-black gap-3 rounded-xl cursor-pointer py-3.5 px-4 hover:bg-slate-50 text-foreground transition-all"
                                                              >
                                                                  <Database className="h-4 w-4 text-primary" /> View Full Profile
                                                              </DropdownMenuItem>
                                                          )}
                                                          {onEdit && (
                                                              <DropdownMenuItem 
                                                                 onClick={() => onEdit(item)} 
                                                                 className="text-xs font-black gap-3 rounded-xl cursor-pointer py-3.5 px-4 hover:bg-slate-50 text-foreground transition-all"
                                                              >
                                                                  <SortAsc className="h-4 w-4 text-amber-500 rotate-90" /> Edit Record
                                                              </DropdownMenuItem>
                                                          )}
                                                          
                                                          {(onView || onEdit) && customRowActions && <DropdownMenuSeparator className="my-2 bg-border/40" />}
                                                          
                                                          {customRowActions && customRowActions(item).map((action, idx) => (
                                                              <DropdownMenuItem 
                                                                  key={idx} 
                                                                  onClick={action.onClick} 
                                                                  className={cn("text-xs font-black gap-3 rounded-xl cursor-pointer py-3.5 px-4 hover:bg-slate-50 text-foreground transition-all", action.variant === 'destructive' ? "text-red-500 focus:bg-red-50 focus:text-red-500" : "")}
                                                              >
                                                                  {action.icon || <Database className="h-4 w-4 opacity-40" />}
                                                                  {action.label}
                                                              </DropdownMenuItem>
                                                          ))}                                                            
                                                          {onDelete && (
                                                              <>
                                                                  <DropdownMenuSeparator className="my-2 bg-border/40" />
                                                                  <DropdownMenuItem
                                                                      className="text-xs font-black gap-3 rounded-xl cursor-pointer py-3.5 px-4 text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-500 transition-all font-black uppercase tracking-widest"
                                                                      onClick={() => {
                                                                          if (confirm(`Are you absolutely sure you want to delete this ${entityType}?`)) {
                                                                              onDelete(item)
                                                                          }
                                                                      }}
                                                                  >
                                                                      <Trash2 className="h-4 w-4" /> Delete Record
                                                                  </DropdownMenuItem>
                                                              </>
                                                          )}
                                                     </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        {/* Final spacing row to ensure last item is readable */}
                        <tr><td colSpan={visibleColsData.length + 2} className="h-32 bg-white"></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
