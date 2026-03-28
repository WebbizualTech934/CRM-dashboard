"use client"

import { useState, useRef, useCallback, MouseEvent } from "react"
import { useCRMData, CustomSchema, CustomColumnDef, CustomRecord } from "@/hooks/use-crm-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription
} from "@/components/ui/sheet"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Table2, Plus, Trash2, X, Search, Database, FileText,
    Hash, Calendar, ToggleLeft, Link, Mail, ArrowLeft, Save, PlusCircle,
    MoreHorizontal, Download, Upload, Filter, SortAsc, SortDesc, Edit3,
    CheckSquare, LayoutGrid, Rows, ChevronDown, RefreshCw, Check, Maximize2, Columns, Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Column type definitions ──────────────────────────────────────────────────
const COLUMN_TYPES = [
    { value: "text",    label: "Single line text", icon: FileText  },
    { value: "number",  label: "Number",           icon: Hash      },
    { value: "date",    label: "Date picker",      icon: Calendar  },
    { value: "boolean", label: "Single checkbox",  icon: ToggleLeft},
    { value: "select",  label: "Dropdown select",  icon: ChevronDown },
    { value: "url",     label: "URL property",     icon: Link      },
    { value: "email",   label: "Email address",    icon: Mail      },
]

const COLORS = [
    "var(--primary)", // CRM Primary
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#3b82f6", // Blue
]

// ── Utility helpers ──────────────────────────────────────────────────────────
function generateId() { return `col_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }

function parseCSV(text: string): string[][] {
    return text.split("\n").filter(Boolean).map(row =>
        row.split(",").map(cell => cell.replace(/^"(.*)"$/, "$1").trim())
    )
}

function toCSV(headers: string[], rows: Record<string, string>[]): string {
    const header = headers.join(",")
    const body = rows.map(r => headers.map(h => `"${(r[h] || "").replace(/"/g, '""')}"`).join(",")).join("\n")
    return `${header}\n${body}`
}

// ── Main page component ──────────────────────────────────────────────────────
export default function CustomTablesPage() {
    const {
        customSchemas, customRecords,
        addCustomSchema, updateCustomSchema, deleteCustomSchema,
        addCustomRecord, updateCustomRecord, deleteCustomRecord,
        isLoaded, currentUser
    } = useCRMData()

    // ── Routing state
    const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null)
    const [schemaSearch, setSchemaSearch] = useState("")

    // ── Table Schema Edit/Create Panel
    const [isSchemaPanelOpen, setIsSchemaPanelOpen] = useState(false)
    const [editingSchemaId, setEditingSchemaId] = useState<string | null>(null)
    const [schemaName, setSchemaName] = useState("")
    const [schemaDesc, setSchemaDesc] = useState("")
    const [schemaColor, setSchemaColor] = useState(COLORS[0])
    const [schemaCols, setSchemaCols] = useState<Omit<CustomColumnDef,"id">[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // ── Record Panel (Add/Edit)
    const [isRecordPanelOpen, setIsRecordPanelOpen] = useState(false)
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
    const [recordData, setRecordData] = useState<Record<string,string>>({})
    const [isSavingRecord, setIsSavingRecord] = useState(false)

    // ── Data Grid state
    const [tableSearch, setTableSearch] = useState("")
    const [sortCol, setSortCol] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
    const [filterCol, setFilterCol] = useState<string>("all")
    const [filterVal, setFilterVal] = useState("")
    const [inlineEditingCell, setInlineEditingCell] = useState<{rowId:string; colId:string} | null>(null)
    const [inlineEditingVal, setInlineEditingVal] = useState("")
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isLoaded) return null

    const selectedSchema = customSchemas.find(s => s.id === selectedSchemaId)
    const allRecords     = customRecords.filter(r => r.schemaId === selectedSchemaId)

    // ── Filters & Sort 
    let visibleRecords = [...allRecords]
    if (tableSearch) {
        visibleRecords = visibleRecords.filter(r =>
            Object.values(r.data).some(v => String(v).toLowerCase().includes(tableSearch.toLowerCase()))
        )
    }
    if (filterCol !== "all" && filterVal) {
        visibleRecords = visibleRecords.filter(r =>
            String(r.data[filterCol] || "").toLowerCase().includes(filterVal.toLowerCase())
        )
    }
    if (sortCol) {
        visibleRecords.sort((a, b) => {
            const av = String(a.data[sortCol] || "")
            const bv = String(b.data[sortCol] || "")
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
        })
    }

    const filteredSchemas = customSchemas.filter(s =>
        (s.name.toLowerCase().includes(schemaSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(schemaSearch.toLowerCase())) &&
        (s.createdBy === currentUser?.id || !s.createdBy)
    )

    // ── Schema Panel functions
    const openCreateSchema = () => {
        setEditingSchemaId(null)
        setSchemaName(""); setSchemaDesc(""); setSchemaCols([]); setSchemaColor(COLORS[0])
        setIsSchemaPanelOpen(true)
    }
    const openEditSchema = (schema: CustomSchema) => {
        setEditingSchemaId(schema.id)
        setSchemaName(schema.name); setSchemaDesc(schema.description); setSchemaColor(schema.color); setSchemaCols(schema.columns)
        setIsSchemaPanelOpen(true)
    }
    const addCol = () => setSchemaCols(p => [...p, { name: "", type: "text", required: false }])
    const setCol = (i: number, k: keyof Omit<CustomColumnDef,"id">, v: any) =>
        setSchemaCols(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c))
    const removeCol = (i: number) => setSchemaCols(p => p.filter((_,idx) => idx !== i))

    const handleSaveSchema = async () => {
        if (!schemaName.trim() || schemaCols.length === 0) return
        setIsSaving(true)
        const columnsToSave = schemaCols.map((c, i) => ({ ...c, id: (c as any).id || generateId(), name: c.name || `Column ${i+1}` }))
        if (editingSchemaId) {
            await updateCustomSchema(editingSchemaId, {
                name: schemaName.trim(), description: schemaDesc, color: schemaColor, columns: columnsToSave
            })
        } else {
            await addCustomSchema({
                name: schemaName.trim(), description: schemaDesc, icon: "Table", color: schemaColor, columns: columnsToSave, createdBy: currentUser?.id || "Admin"
            })
        }
        setIsSchemaPanelOpen(false); setIsSaving(false)
    }

    // ── Record Panel functions
    const openAddRecord = () => {
        setEditingRecordId(null); setRecordData({}); setIsRecordPanelOpen(true)
    }
    const openEditRecord = (record: CustomRecord) => {
        setEditingRecordId(record.id); setRecordData(record.data); setIsRecordPanelOpen(true)
    }
    const handleSaveRecord = async () => {
        if (!selectedSchema) return
        setIsSavingRecord(true)
        if (editingRecordId) {
            await updateCustomRecord(editingRecordId, { data: recordData })
        } else {
            await addCustomRecord({ schemaId: selectedSchema.id, data: recordData, createdBy: currentUser?.id || "Admin" })
        }
        setIsRecordPanelOpen(false); setIsSavingRecord(false)
    }

    // ── Inline Cell Editing functions
    const startInlineEdit = (rowId: string, colId: string, cur: string) => {
        setInlineEditingCell({ rowId, colId })
        setInlineEditingVal(cur)
    }
    const commitInlineEdit = async () => {
        if (!inlineEditingCell) return
        const rec = allRecords.find(r => r.id === inlineEditingCell.rowId)
        if (!rec) { setInlineEditingCell(null); return }
        const newVal = inlineEditingVal.trim()
        if (rec.data[inlineEditingCell.colId] !== newVal) {
            await updateCustomRecord(inlineEditingCell.rowId, { data: { ...rec.data, [inlineEditingCell.colId]: newVal } })
        }
        setInlineEditingCell(null)
    }

    // ── Sort toggle
    const handleSort = (colId: string) => {
        if (sortCol === colId) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortCol(colId); setSortDir("asc") }
    }

    // ── Multi-select & Actions
    const toggleRow = (id: string, e: MouseEvent) => {
        e.stopPropagation()
        setSelectedRows(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
    }
    const toggleAll = () => setSelectedRows(selectedRows.size === visibleRecords.length && visibleRecords.length > 0 ? new Set() : new Set(visibleRecords.map(r => r.id)))
    const deleteSelected = async () => {
        for (const id of selectedRows) await deleteCustomRecord(id)
        setSelectedRows(new Set())
    }

    // ── Import / Export
    const handleExportCSV = () => {
        if (!selectedSchema) return
        const headers = selectedSchema.columns.map(c => c.name)
        const colIds  = selectedSchema.columns.map(c => c.id)
        const rows    = visibleRecords.map(r => Object.fromEntries(headers.map((h, i) => [h, r.data[colIds[i]] || ""])))
        const csv     = toCSV(headers, rows)
        const blob    = new Blob([csv], { type: "text/csv" })
        const url     = URL.createObjectURL(blob)
        const a       = document.createElement("a"); a.href = url; a.download = `${selectedSchema.name}.csv`; a.click()
        URL.revokeObjectURL(url)
    }
    const handleExportExcel = () => {
        if (!selectedSchema) return
        const headers = selectedSchema.columns.map(c => c.name)
        const colIds  = selectedSchema.columns.map(c => c.id)
        const tsv     = [headers.join("\t"), ...visibleRecords.map(r => headers.map((_,i) => r.data[colIds[i]] || "").join("\t"))].join("\n")
        const blob    = new Blob([tsv], { type: "application/vnd.ms-excel" })
        const url     = URL.createObjectURL(blob)
        const a       = document.createElement("a"); a.href = url; a.download = `${selectedSchema.name}.xls`; a.click()
        URL.revokeObjectURL(url)
    }
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file || !selectedSchema) return
        const reader = new FileReader()
        reader.onload = async (ev) => {
            const text = ev.target?.result as string
            const rows = parseCSV(text)
            const [headerRow, ...dataRows] = rows
            if (!headerRow) return
            for (const dataRow of dataRows) {
                const data: Record<string,string> = {}
                selectedSchema.columns.forEach(col => {
                    const colIdx = headerRow.findIndex(h => h.toLowerCase() === col.name.toLowerCase())
                    if (colIdx >= 0) data[col.id] = dataRow[colIdx] || ""
                })
                await addCustomRecord({ schemaId: selectedSchema.id, data, createdBy: "Admin" })
            }
        }
        reader.readAsText(file)
        e.target.value = ""
    }

    // ── Schema Panel Input Builder
    const renderPanelInput = (col: CustomColumnDef, val: string, set: (v: string) => void) => {
        switch (col.type) {
            case "boolean":
                return (
                    <button onClick={() => set(val === "true" ? "false" : "true")}
                        className={cn("h-10 w-full rounded-md border text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            val === "true" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent hover:bg-muted border-input")}>
                        <div className={cn("h-4 w-4 rounded-[3px] border flex items-center justify-center", val === "true" ? "border-transparent text-current" : "border-muted-foreground/30")}>
                            {val === "true" && <Check className="h-3 w-3" />}
                        </div>
                        {val === "true" ? "Yes" : "No"}
                    </button>
                )
            case "date":
                return <Input type="date" value={val} onChange={e => set(e.target.value)} className="h-10" />
            case "number":
                return <Input type="number" value={val} onChange={e => set(e.target.value)} className="h-10" placeholder="0" />
            case "select":
                return (
                    <Select value={val} onValueChange={v => v && set(v)}>
                        <SelectTrigger className="h-10"><SelectValue placeholder={`Select ${col.name}…`} /></SelectTrigger>
                        <SelectContent>{(col.options || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                )
            default:
                return <Input value={val} onChange={e => set(e.target.value)} className="h-10"
                    placeholder={col.type === "email" ? "name@example.com" : col.type === "url" ? "https://…" : `Enter ${col.name}`} />
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // 1) NO SCHEMA SELECTED (CARDS VIEW)
    // ────────────────────────────────────────────────────────────────────────
    if (!selectedSchema) return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Database className="h-6 w-6 text-primary" />
                        Custom Objects
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and define your custom data structures.</p>
                </div>
                <Button onClick={openCreateSchema} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Create custom object
                </Button>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-md border shadow-sm">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search objects…" value={schemaSearch} onChange={e => setSchemaSearch(e.target.value)}
                        className="pl-9 h-9 text-sm rounded-sm bg-slate-50 border-slate-200" />
                </div>
                <div className="h-5 w-[1px] bg-slate-200 mx-2" />
                <span className="text-sm text-slate-500 font-medium">{filteredSchemas.length} objects defined</span>
            </div>

            {filteredSchemas.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <Database className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">No objects found</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4 max-w-sm">Build your first custom object to track unique business data securely inside your CRM.</p>
                    <Button onClick={openCreateSchema} variant="outline" className="rounded-sm">Build object schema</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSchemas.map(schema => {
                        const cnt = customRecords.filter(r => r.schemaId === schema.id).length
                        return (
                            <div key={schema.id} onClick={() => { setSelectedSchemaId(schema.id); setTableSearch(""); setSortCol(null); setSelectedRows(new Set()); setFilterCol("all"); setFilterVal("") }}
                                className="group bg-white border border-border rounded-2xl border border-border shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full overflow-hidden">
                                <div className="h-1 w-full rounded-t-md" style={{ background: schema.color }} />
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-800 truncate pr-4">{schema.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{schema.description || "Custom business object"}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48" onClick={e => e.stopPropagation()}>
                                                <DropdownMenuItem onClick={() => openEditSchema(schema)} className="gap-2 focus:bg-slate-50">
                                                    <Settings className="h-4 w-4 text-slate-500" /> Edit schema definition
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => deleteCustomSchema(schema.id)} className="text-red-600 focus:bg-red-50 focus:text-red-600 gap-2">
                                                    <Trash2 className="h-4 w-4" /> Delete object
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-6 flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Records</span>
                                            <span className="text-xl font-bold text-slate-800">{cnt}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Properties</span>
                                            <span className="text-xl font-bold text-slate-800">{schema.columns.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center text-xs text-slate-500 justify-between mt-auto">
                                    <span>Created {new Date(schema.createdAt).toLocaleDateString()}</span>
                                    <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View data →</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Create/Edit Schema Panel ───────────────────────── */}
            <Sheet open={isSchemaPanelOpen} onOpenChange={setIsSchemaPanelOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md md:max-w-xl p-0 border-l border-slate-200 shadow-xl flex flex-col bg-white">
                    <SheetHeader className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                        <SheetTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {editingSchemaId ? "Edit custom object" : "Create custom object"}
                        </SheetTitle>
                        <SheetDescription className="text-xs">Define properties to store structured data in your CRM.</SheetDescription>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b">1. Object Details</h3>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-medium">Object Name <span className="text-red-500">*</span></Label>
                                <Input value={schemaName} onChange={e => setSchemaName(e.target.value)} placeholder="e.g. Invoices, Attendees, Vehicles" className="h-9 rounded-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-medium">Description</Label>
                                <Input value={schemaDesc} onChange={e => setSchemaDesc(e.target.value)} placeholder="What is this object used for?" className="h-9 rounded-sm" />
                            </div>
                            <div className="space-y-1.5 pt-2">
                                <Label className="text-xs text-slate-600 font-medium tracking-tight">Accent Color</Label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {COLORS.map(c => (
                                        <button key={c} onClick={() => setSchemaColor(c)}
                                            className={cn("h-7 w-7 rounded-full border-2 transition-all", schemaColor === c ? "border-slate-800 shadow-sm scale-105" : "border-transparent opacity-80 hover:opacity-100")}
                                            style={{ background: c }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-semibold text-slate-800">2. Object Properties (Columns)</h3>
                                <Button size="sm" variant="ghost" onClick={addCol} className="h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 px-2 rounded-sm gap-1">
                                    <Plus className="h-3 w-3" /> Add property
                                </Button>
                            </div>
                            
                            {schemaCols.length === 0 ? (
                                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-sm p-6 text-center">
                                    <Columns className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">Your object needs at least one property.</p>
                                    <Button size="sm" onClick={addCol} variant="outline" className="mt-3 h-8 text-xs bg-white">Create property</Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {schemaCols.map((col, i) => (
                                        <div key={i} className="bg-white border border-slate-200 rounded-sm p-3 shadow-sm flex flex-col gap-2 relative group">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Property Name</Label>
                                                    <Input value={col.name} onChange={e => setCol(i, "name", e.target.value)} placeholder="e.g. Amount, License Plate" className="h-8 text-sm" />
                                                </div>
                                                <div className="w-[140px] space-y-1">
                                                    <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Field Type</Label>
                                                    <Select value={col.type} onValueChange={v => v && setCol(i, "type", v)}>
                                                        <SelectTrigger className="h-8 text-xs font-medium bg-slate-50"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {COLUMN_TYPES.map(t => (
                                                                <SelectItem key={t.value} value={t.value} className="text-xs">
                                                                    <div className="flex items-center gap-2"><t.icon className="h-3 w-3 text-slate-400"/> {t.label}</div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            {col.type === "select" && (
                                                <div className="bg-slate-50 p-2 mt-1 rounded border border-slate-100">
                                                    <Label className="text-[10px] text-slate-500">Dropdown options (comma separated)</Label>
                                                    <Input placeholder="Option 1, Option 2, Option 3" className="h-7 text-xs mt-1" onChange={e => setCol(i, "options", e.target.value.split(",").map(o=>o.trim()).filter(Boolean))} />
                                                </div>
                                            )}
                                            <button onClick={() => removeCol(i)} className="absolute -top-2 -right-2 h-5 w-5 bg-white border border-slate-200 shadow-sm rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button variant="ghost" size="sm" onClick={addCol} className="w-full h-8 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 border-dashed rounded-sm bg-slate-50">
                                        + Add another property
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <SheetFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50 mt-auto flex-row justify-between sm:justify-between items-center sm:space-x-0">
                        <Button variant="outline" onClick={() => setIsSchemaPanelOpen(false)} className="rounded-sm h-9 bg-white">Cancel</Button>
                        <Button onClick={handleSaveSchema} disabled={isSaving || !schemaName.trim() || schemaCols.length === 0} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            {isSaving ? "Saving..." : editingSchemaId ? "Update Schema" : "Create Object"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )

    // ────────────────────────────────────────────────────────────────────────
    // 2) SPREADSHEET (DATA GRID) VIEW - HUBSPOT STYLE
    // ────────────────────────────────────────────────────────────────────────
    const columns = selectedSchema.columns

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 -mx-8 bg-slate-50/50">
            {/* Top Navigation Bar */}
            <div className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSchemaId(null)} className="text-slate-500 hover:bg-slate-100 h-8 w-8 px-0 rounded-sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                    <Database className="h-4 w-4" style={{ color: selectedSchema.color }} />
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">{selectedSchema.name}</h1>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0 border-none rounded-sm ml-2">
                        {allRecords.length} records
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-sm text-xs border-slate-300 font-medium" onClick={() => fileInputRef.current?.click()}>
                        Import
                    </Button>
                    <input ref={fileInputRef} type="file" accept=".csv,.tsv" className="hidden" onChange={handleImport} />
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-9 px-4 rounded-xl border border-border bg-card/50  font-bold text-xs hover:bg-white transition-all inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
                            Actions <ChevronDown className="h-3 w-3 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-md bg-white border border-slate-200 shadow-md p-1 min-w-[160px]">
                            <DropdownMenuItem onClick={handleExportCSV} className="text-xs focus:bg-slate-100 rounded-sm py-1.5 px-2.5 cursor-pointer">Export as CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcel} className="text-xs focus:bg-slate-100 rounded-sm py-1.5 px-2.5 cursor-pointer">Export as Excel (.xls)</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem onClick={() => openEditSchema(selectedSchema)} className="text-xs focus:bg-slate-100 rounded-sm py-1.5 px-2.5 cursor-pointer text-slate-600">
                                Edit properties
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button size="sm" onClick={openAddRecord} className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] ml-2 px-6">
                        Create record
                    </Button>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-3 shrink-0">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input placeholder={`Search ${selectedSchema.name.toLowerCase()}...`} value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                        className="pl-9 h-9 text-xs border-border rounded-xl shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 bg-white border border-border transition-all" />
                </div>
                
                <div className="h-5 w-[1px] bg-slate-200 mx-1" />
                
                <div className="flex items-center bg-slate-50 rounded-sm border border-slate-200 p-0.5">
                    <Select value={filterCol} onValueChange={v => v && setFilterCol(v)}>
                        <SelectTrigger className="h-7 text-xs font-semibold bg-transparent border-none shadow-none focus:ring-0 w-32 pr-2 px-2 text-slate-600">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-xs font-medium">All columns</SelectItem>
                            {columns.map(c => <SelectItem key={c.id} value={c.id} className="text-xs font-medium">{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {filterCol !== "all" && (
                        <>
                            <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                            <Input placeholder="Contains..." value={filterVal} onChange={e => setFilterVal(e.target.value)} 
                                className="h-7 w-32 px-2 bg-transparent text-xs border-none shadow-none focus-visible:ring-0 placeholder:text-slate-400" />
                        </>
                    )}
                </div>

                {selectedRows.size > 0 && (
                    <div className="ml-auto flex items-center gap-2 bg-primary/10 text-primary rounded-xl px-4 py-2 border border-primary/20">
                        <span className="text-xs font-bold">{selectedRows.size} selected</span>
                        <div className="h-3 w-[1px] bg-primary/30 mx-1" />
                        <button onClick={deleteSelected} className="text-xs font-bold hover:underline flex items-center gap-1">
                            <Trash2 className="h-3 w-3" /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Data Grid / Spreadsheet */}
            <div className="flex-1 overflow-auto bg-white relative">
                <table className="w-full text-sm border-collapse table-fixed min-w-max">
                    <thead className="bg-[#f5f8fa] border-b border-slate-200 sticky top-0 z-20 shadow-sm text-slate-600">
                        <tr>
                            <th className="w-10 h-[36px] sticky left-0 z-30 bg-[#f5f8fa] border-r border-slate-200 text-center px-0">
                                <button onClick={toggleAll} className="flex items-center justify-center w-full h-full">
                                    <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-colors",
                                        selectedRows.size === visibleRecords.length && visibleRecords.length > 0
                                            ? "bg-primary border-primary text-white"
                                            : "border-slate-300 bg-white")}>
                                        {selectedRows.size === visibleRecords.length && visibleRecords.length > 0 && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                    </div>
                                </button>
                            </th>
                            {columns.map(col => (
                                <th key={col.id} className="w-48 px-4 h-[36px] text-left border-r border-slate-200 font-semibold text-[11px] uppercase tracking-wider select-none">
                                    <button onClick={() => handleSort(col.id)} className="flex items-center gap-1.5 w-full hover:text-slate-900 group">
                                        {col.name}
                                        <span className="text-slate-400">
                                            {sortCol === col.id
                                                ? (sortDir === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)
                                                : <SortAsc className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                                        </span>
                                    </button>
                                </th>
                            ))}
                            <th className="w-full px-4 border-b border-slate-200 bg-[#f5f8fa]"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-[13px] text-slate-800">
                        {visibleRecords.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="text-center py-20 bg-slate-50 border-b border-slate-100">
                                    <Database className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-600">No records found matching your filters.</p>
                                    <p className="text-xs text-slate-400 mt-1">Adjust your search or click "Create record" to add data.</p>
                                </td>
                            </tr>
                        ) : (
                            visibleRecords.map((rec, idx) => {
                                const isSelected = selectedRows.has(rec.id)
                                return (
                                    <tr key={rec.id} 
                                        className={cn("border-b border-slate-200 group hover:bg-[#f5f8fa] transition-colors relative cursor-default",
                                            isSelected ? "bg-blue-50/40" : "")}
                                        onClick={() => openEditRecord(rec)}
                                    >
                                        <td className={cn("w-10 h-[40px] sticky left-0 z-10 border-r border-slate-200 text-center px-0 transition-colors", 
                                            isSelected ? "bg-blue-50/40" : "bg-white group-hover:bg-[#f5f8fa]")}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={(e) => toggleRow(rec.id, e)} className="flex items-center justify-center w-full h-full">
                                                <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-colors shadow-sm",
                                                    isSelected ? "bg-primary border-primary text-white" : "border-slate-300 bg-white")}>
                                                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                                </div>
                                            </button>
                                        </td>
                                        
                                        {columns.map(col => {
                                            const val = rec.data[col.id] || ""
                                            const isEditing = inlineEditingCell?.rowId === rec.id && inlineEditingCell?.colId === col.id
                                            
                                            return (
                                                <td key={col.id} 
                                                    className="px-4 h-[40px] border-r border-slate-200 overflow-hidden text-ellipsis whitespace-nowrap relative"
                                                    onDoubleClick={(e) => { e.stopPropagation(); startInlineEdit(rec.id, col.id, val) }}
                                                    onClick={(e) => { if (isEditing) e.stopPropagation() }}
                                                >
                                                    {isEditing ? (
                                                        <div className="absolute inset-0 bg-primary/5 border-2 border-primary z-20 flex items-center px-3" onClick={e=>e.stopPropagation()}>
                                                            <input
                                                                autoFocus
                                                                value={inlineEditingVal}
                                                                onChange={e => setInlineEditingVal(e.target.value)}
                                                                onBlur={commitInlineEdit}
                                                                onKeyDown={e => { if (e.key === "Enter") commitInlineEdit(); if (e.key === "Escape") setInlineEditingCell(null) }}
                                                                className="w-full bg-transparent outline-none text-[13px] font-medium text-slate-900"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {col.type === "boolean" ? (
                                                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-semibold", val === "true" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>
                                                                    {val === "true" ? "Yes" : "No"}
                                                                </span>
                                                            ) : col.type === "url" || col.type === "email" ? (
                                                                <a href={col.type === "email" ? `mailto:${val}` : val} target="_blank" rel="noopener noreferrer" 
                                                                    className="text-primary font-bold hover:underline inline-block truncate max-w-full"
                                                                    onClick={e => e.stopPropagation()}>
                                                                    {val || "—"}
                                                                </a>
                                                            ) : (
                                                                <span className="truncate block w-full">{val || <span className="text-slate-300">—</span>}</span>
                                                            )}
                                                            {/* Inline edit hint on hover */}
                                                            <div className="absolute right-2 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="bg-white/90 p-1 rounded-sm shadow-sm border border-slate-200 text-slate-400 hover:text-primary"
                                                                    title="Double click to edit">
                                                                    <Edit3 className="h-3 w-3" />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            )
                                        })}
                                        <td className="w-full px-4 border-b border-transparent bg-transparent group-hover:bg-[#f5f8fa]">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end pr-4">
                                                <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-0 rounded-lg"
                                                    onClick={(e) => { e.stopPropagation(); openEditRecord(rec) }}>
                                                    Preview
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        {/* Empty spacing block */}
                        <tr><td colSpan={columns.length + 2} className="h-20 bg-white"></td></tr>
                    </tbody>
                </table>
            </div>

            {/* ── Record Details Side Panel (Create & Edit) ───────────────────── */}
            <Sheet open={isRecordPanelOpen} onOpenChange={setIsRecordPanelOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l border-slate-200 shadow-2xl flex flex-col bg-slate-50">
                    <SheetHeader className="px-6 py-5 border-b border-slate-200 bg-white shadow-sm z-10">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center">
                                <Database className="h-3 w-3 text-slate-500" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedSchema.name} Record</span>
                        </div>
                        <SheetTitle className="text-xl font-bold text-slate-800">
                            {editingRecordId ? "Edit record details" : "Create new record"}
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-sm font-semibold text-slate-800">Property values</h3>
                            </div>
                            <div className="p-5 space-y-5">
                                {columns.map(col => (
                                    <div key={col.id} className="space-y-1.5 grid grid-cols-[120px_1fr] items-start gap-3">
                                        <Label className="text-[12px] text-slate-600 font-medium pt-2">{col.name}</Label>
                                        <div>
                                            {renderPanelInput(col, recordData[col.id] || "", v => setRecordData(p => ({ ...p, [col.id]: v })))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center sm:justify-between sm:space-x-0">
                        <div>
                            {editingRecordId && (
                                <Button variant="ghost" onClick={async () => { await deleteCustomRecord(editingRecordId); setIsRecordPanelOpen(false) }} 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium h-9 px-3 rounded-sm">
                                    Delete Record
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsRecordPanelOpen(false)} className="rounded-sm h-9 bg-white font-medium text-slate-600 border-slate-300">Cancel</Button>
                            <Button onClick={handleSaveRecord} disabled={isSavingRecord} className="rounded-xl h-10 px-8 bg-primary hover:bg-primary/90 text-white font-bold border-none shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                {isSavingRecord ? "Saving..." : "Save details"}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}