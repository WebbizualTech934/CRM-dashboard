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
            <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Loading {entityType}s...</p>
            </div>
        )
    }

    const visibleColsData = columns.filter(c => visibleColumns.includes(c.accessorKey as string))

    return (
        <div className="flex flex-col border border-border/50 rounded-[2.5rem] bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden h-[calc(100vh-220px)] min-h-[500px]">
            {/* Filter / Search Bar */}
            <div className="h-20 bg-card/40 border-b border-border/50 flex items-center px-8 gap-4 shrink-0">
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 text-sm bg-muted/20 border-none rounded-2xl shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold"
                    />
                </div>
                
                {filterConfig && filterConfig.length > 0 && <div className="h-5 w-[1px] bg-slate-200 mx-1" />}
                
                <div className="flex items-center gap-3">
                    {filterConfig?.map(filter => (
                        <Select
                            key={filter.key as string}
                            value={activeFilters[filter.key as string] || "_all"}
                            onValueChange={(val: any) => setActiveFilters(prev => ({ ...prev, [filter.key as string]: val }))}
                        >
                            <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-none min-w-[160px] font-bold text-xs text-foreground transition-all focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder={`Filter by ${filter.label}`} />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-2 backdrop-blur-xl">
                                <SelectItem value="_all" className="font-bold text-xs text-muted-foreground rounded-xl">All {filter.label}</SelectItem>
                                {filter.options.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold text-foreground rounded-xl py-3">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {selectedIds.size > 0 ? (
                        <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-2xl px-4 py-2 border border-primary/20 transition-all animate-in fade-in slide-in-from-right-2">
                            <span className="text-xs font-black uppercase tracking-tight">{selectedIds.size} selected</span>
                            <div className="h-3 w-[1px] bg-primary/30 mx-1" />
                            <button onClick={() => {
                                if (onBulkDelete && confirm(`Delete ${selectedIds.size} items?`)) {
                                    onBulkDelete(Array.from(selectedIds))
                                    setSelectedIds(new Set())
                                }
                            }} className="text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                                <Trash2 className="h-3 w-3" /> Bulk Delete
                            </button>
                        </div>
                    ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mr-2">{filteredData.length} total {entityType.toLowerCase()}s</span>
                    )}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-2xl border border-border/50 font-bold text-xs hover:bg-muted/50 transition-all shadow-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <Columns className="h-4 w-4 mr-2" /> Columns
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[220px] rounded-2xl shadow-2xl border-none p-2 backdrop-blur-xl">
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
                                    className="text-xs font-bold rounded-xl py-3 cursor-pointer"
                                >
                                    {col.header as string}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm" onClick={() => handleHorizScroll('left')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm" onClick={() => handleHorizScroll('right')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {toolbarActions}
                </div>
            </div>

            {/* Data Grid / Spreadsheet */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto bg-transparent relative custom-scrollbar">
                <table className="w-full text-sm border-collapse table-fixed min-w-max">
                    <thead className="bg-muted/30 border-b border-border/50 sticky top-0 z-20 shadow-sm text-muted-foreground backdrop-blur-md">
                        <tr>
                            <th className="w-14 h-[50px] sticky left-0 z-30 bg-muted/40 border-r border-border/50 text-center px-0">
                                <button onClick={toggleSelectAll} className="flex items-center justify-center w-full h-full">
                                    <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center transition-all shadow-sm",
                                        selectedIds.size === filteredData.length && filteredData.length > 0
                                            ? "bg-primary border-primary text-white scale-110"
                                            : "border-border/50 bg-card hover:border-primary/50")}>
                                        {selectedIds.size === filteredData.length && filteredData.length > 0 && <Check className="h-3 w-3 stroke-[3]" />}
                                    </div>
                                </button>
                            </th>
                            {visibleColsData.map((col, i) => (
                                <th key={i} className="px-6 h-[50px] text-left border-r border-border/50 font-black text-[10px] uppercase tracking-widest select-none overflow-hidden" style={{ width: col.width || '180px' }}>
                                    {col.sortable ? (
                                        <button onClick={() => handleSort(col.accessorKey as string)} className="flex items-center gap-2 w-full hover:text-primary transition-all group">
                                            {col.header}
                                            <span className="transition-all">
                                                {sortConfig?.key === col.accessorKey
                                                    ? (sortConfig.direction === "asc" ? <SortAsc className="h-3.5 w-3.5 text-primary" /> : <SortDesc className="h-3.5 w-3.5 text-primary" />)
                                                    : <SortAsc className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0" />}
                                            </span>
                                        </button>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            ))}
                            <th className="w-[100px] px-6 border-b border-l border-border/50 bg-muted/30 sticky right-0 z-30 backdrop-blur-md"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-[13px] text-slate-800">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={visibleColsData.length + 2} className="text-center py-24 bg-slate-50 border-b border-slate-100">
                                    {emptyState || (
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Database className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-600">No {entityType.toLowerCase()}s found matching your filters.</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map(item => {
                                const isSelected = selectedIds.has(item.id)
                                return (
                                    <tr key={item.id}
                                        className={cn("border-b border-border/50 group hover:bg-primary/5 transition-all relative h-16",
                                            isSelected ? "bg-primary/5" : "",
                                            (rowClickable !== false && (onRowClick || onView)) && "cursor-pointer"
                                        )}
                                        onClick={() => {
                                            if (rowClickable !== false) {
                                                if (onRowClick) onRowClick(item)
                                                else if (onView) onView(item)
                                            }
                                        }}
                                    >
                                        <td className={cn("w-14 h-16 sticky left-0 z-10 border-r border-border/50 text-center px-0 transition-all", 
                                            isSelected ? "bg-primary/10" : "bg-card/40 group-hover:bg-primary/5")}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={(e) => toggleSelect(item.id, e)} className="flex items-center justify-center w-full h-full">
                                                <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center transition-all shadow-sm",
                                                    isSelected ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : "border-border/50 bg-card hover:border-primary/50")}>
                                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                                </div>
                                            </button>
                                        </td>
                                        
                                        {visibleColsData.map((col, i) => (
                                            <td key={i} className={cn("px-6 h-16 border-r border-border/50 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-foreground/80", col.className)}>
                                                {col.cell ? col.cell(item, filteredData.indexOf(item)) : (item as any)[col.accessorKey]}
                                            </td>
                                        ))}

                                        <td className="w-[100px] px-6 border-b border-l border-border/50 bg-card/40 group-hover:bg-primary/5 sticky right-0 z-10 backdrop-blur-md transition-all">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all justify-end scale-90 group-hover:scale-100">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-9 w-9 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-none p-2 bg-white/95 backdrop-blur-sm" onClick={e=>e.stopPropagation()}>
                                                         {(onView || onRowClick) && (
                                                             <DropdownMenuItem 
                                                                onClick={() => (onView || onRowClick)?.(item)} 
                                                                className="text-xs font-bold gap-2 rounded-lg cursor-pointer py-2 px-3 hover:bg-primary/5 text-slate-700"
                                                             >
                                                                 <Database className="h-3.5 w-3.5 text-blue-500" /> View Details
                                                             </DropdownMenuItem>
                                                         )}
                                                         {onEdit && (
                                                             <DropdownMenuItem 
                                                                onClick={() => onEdit(item)} 
                                                                className="text-xs font-bold gap-2 rounded-lg cursor-pointer py-2 px-3 hover:bg-primary/5 text-slate-700"
                                                             >
                                                                 <SortAsc className="h-3.5 w-3.5 text-orange-500 rotate-90" /> Edit Record
                                                             </DropdownMenuItem>
                                                         )}
                                                         
                                                         {(onView || onEdit) && customRowActions && <DropdownMenuSeparator className="my-1 bg-slate-100" />}
                                                         
                                                         {customRowActions && customRowActions(item).map((action, idx) => (
                                                             <DropdownMenuItem 
                                                                 key={idx} 
                                                                 onClick={action.onClick} 
                                                                 className={cn("text-xs font-bold gap-2 rounded-lg cursor-pointer py-2 px-3 hover:bg-primary/5 text-slate-700", action.variant === 'destructive' ? "text-red-600 focus:bg-red-50 focus:text-red-600" : "")}
                                                             >
                                                                 {action.icon || <Database className="h-3.5 w-3.5 opacity-40" />}
                                                                 {action.label}
                                                             </DropdownMenuItem>
                                                         ))}                                                            
                                                         {onDelete && (
                                                             <>
                                                                 <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                                                 <DropdownMenuItem
                                                                     className="text-xs font-bold gap-2 rounded-lg cursor-pointer py-2 px-3 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                                                                     onClick={() => {
                                                                         if (confirm(`Delete this ${entityType}?`)) {
                                                                             onDelete(item)
                                                                         }
                                                                     }}
                                                                 >
                                                                     <Trash2 className="h-3.5 w-3.5" /> Delete
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
                        {/* Empty spacing block */}
                        <tr><td colSpan={visibleColsData.length + 2} className="h-20 bg-white"></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
