"use client"

import React, { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
    ChevronDown,
    MoreHorizontal,
    Download,
    Trash2,
    Search,
    Filter,
    Columns,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Column<T> {
    header: string | React.ReactNode
    accessorKey: keyof T | string
    cell?: (item: T) => React.ReactNode
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
    onDelete?: (item: T) => void
    onBulkDelete?: (ids: string[]) => void
    isLoading?: boolean
    emptyState?: React.ReactNode
    toolbarActions?: React.ReactNode
    rowClickable?: boolean
    onRowClick?: (item: T) => void
    entityType?: string
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    searchPlaceholder = "Search...",
    searchKey,
    onDelete,
    onBulkDelete,
    isLoading = false,
    emptyState,
    toolbarActions,
    rowClickable,
    onRowClick,
    entityType
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        columns.map(c => c.accessorKey as string)
    )
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    // Filtering & Sorting Logic
    const filteredData = useMemo(() => {
        let result = [...data]

        if (searchQuery && searchKey) {
            result = result.filter(item => {
                const val = item[searchKey]
                return String(val).toLowerCase().includes(searchQuery.toLowerCase())
            })
        }

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
    }, [data, searchQuery, searchKey, sortConfig])

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredData.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredData.map(item => item.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
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
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Loading {entityType || "data"}...</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl bg-card border-border/50 h-11 focus:ring-primary/20"
                        />
                    </div>
                    {selectedIds.length > 0 && onBulkDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-xl h-11 px-4 gap-2 animate-in fade-in zoom-in"
                            onClick={() => {
                                if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
                                    onBulkDelete(selectedIds)
                                    setSelectedIds([])
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete {selectedIds.length}</span>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {toolbarActions}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" size="sm" className="rounded-xl h-11 px-4 gap-2 border-border/50">
                                <Columns className="h-4 w-4" /> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
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
                                >
                                    {col.header as string}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-border/40 h-14">
                                <TableHead className="w-[50px] px-6 text-center">
                                    <Checkbox
                                        checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary"
                                    />
                                </TableHead>
                                {columns.filter(c => visibleColumns.includes(c.accessorKey as string)).map((col, i) => (
                                    <TableHead
                                        key={i}
                                        className={cn(
                                            "text-xs font-black uppercase tracking-widest text-muted-foreground/60 px-4",
                                            col.className,
                                            col.sortable && "cursor-pointer hover:text-foreground transition-colors"
                                        )}
                                        onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                                        style={{ width: col.width }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.header}
                                            {col.sortable && <ArrowUpDown className="h-3 w-3" />}
                                        </div>
                                    </TableHead>
                                ))}
                                <TableHead className="w-[80px] px-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className={cn(
                                            "group border-border/30 hover:bg-primary/[0.02] transition-colors h-16",
                                            rowClickable && "cursor-pointer"
                                        )}
                                        onClick={() => rowClickable && onRowClick?.(item)}
                                    >
                                        <TableCell className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedIds.includes(item.id)}
                                                onCheckedChange={() => toggleSelect(item.id)}
                                                className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary"
                                            />
                                        </TableCell>
                                        {columns.filter(c => visibleColumns.includes(c.accessorKey as string)).map((col, i) => (
                                            <TableCell key={i} className={cn("px-4 font-medium text-sm", col.className)}>
                                                {col.cell ? col.cell(item) : (item as any)[col.accessorKey]}
                                            </TableCell>
                                        ))}
                                        <TableCell className="px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all h-9 w-9">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl w-48 p-2">
                                                    <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium text-primary">
                                                        Edit {entityType}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {onDelete && (
                                                        <DropdownMenuItem
                                                            className="rounded-lg gap-2 cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() => {
                                                                if (confirm(`Are you sure you want to delete this ${entityType}?`)) {
                                                                    onDelete(item)
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.filter(c => visibleColumns.includes(c.accessorKey as string)).length + 2}
                                        className="h-[300px] text-center"
                                    >
                                        {emptyState || (
                                            <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <div className="relative">
                                                    <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                        <Search className="h-10 w-10 text-primary/30" />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-background border border-border/50 flex items-center justify-center shadow-lg">
                                                        <Filter className="h-4 w-4 text-muted-foreground/40" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-center max-w-[300px]">
                                                    <p className="text-xl font-black tracking-tighter">No results found</p>
                                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                        We couldn't find any {entityType ? entityType.toLowerCase() + "s" : "data"} matching your current filters or search terms.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination / Footer */}
            <div className="flex items-center justify-between px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <div>Showing {filteredData.length} of {data.length} {entityType || "items"}</div>
                {selectedIds.length > 0 && (
                    <div className="text-primary">{selectedIds.length} items selected</div>
                )}
            </div>
        </div>
    )
}
