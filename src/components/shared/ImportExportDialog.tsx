import { useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Upload,
    Download,
    FileText,
    FileSpreadsheet,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Table as TableIcon,
    Type,
    Link as LinkIcon,
    Hash,
    List
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCRMData } from "@/hooks/use-crm-data"

interface ColumnMapping {
    csvColumn: string
    crmField: string
    type: "Text" | "URL" | "Number" | "Dropdown"
}

export function ImportExportDialog({ mode, type: entityType = "leads", projectId }: { mode: "import" | "export", type?: "leads" | "manufacturers" | "campaigns" | "creative", projectId?: string }) {
    const {
        replaceLeads, leads,
        replaceManufacturers, manufacturers,
        replaceCampaigns, campaigns,
        replaceCreativeAssets, creativeAssets
    } = useCRMData() as any
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<"upload" | "mapping" | "success">("upload")
    const [fileName, setFileName] = useState<string | null>(null)
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvData, setCsvData] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [mappings, setMappings] = useState<ColumnMapping[]>([])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            const lines = text.split("\n").filter(line => line.trim() !== "")
            if (lines.length > 0) {
                const headers = lines[0].split(",").map(h => h.trim())
                setCsvHeaders(headers)

                // Parse data
                // Parse data with a more robust regex to handle quoted commas
                const data = lines.slice(1).map(line => {
                    const values: string[] = []
                    let current = ""
                    let inQuotes = false
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i]
                        if (char === '"') inQuotes = !inQuotes
                        else if (char === ',' && !inQuotes) {
                            values.push(current.trim())
                            current = ""
                        } else {
                            current += char
                        }
                    }
                    values.push(current.trim())

                    const obj: any = {}
                    headers.forEach((header, index) => {
                        obj[header] = values[index] ? values[index].replace(/^"|"$/g, '') : ""
                    })
                    return obj
                })
                setCsvData(data)

                // Initial mappings
                const initialMappings: ColumnMapping[] = headers.map(header => {
                    const lowerHeader = header.toLowerCase()
                    let crmField = ""
                    if (entityType === "manufacturers") {
                        if (lowerHeader.includes("parent")) crmField = "parentCompany"
                        else if (lowerHeader.includes("peer") || lowerHeader.includes("brand")) crmField = "peerBrand"
                        else if (lowerHeader.includes("match") || lowerHeader.includes("rate")) crmField = "productMatchRate"
                        else if (lowerHeader.includes("website") || lowerHeader.includes("link")) crmField = "website"
                        else if (lowerHeader.includes("size")) crmField = "companySize"
                        else if (lowerHeader.includes("country")) crmField = "country"
                        else if (lowerHeader.includes("fit")) crmField = "fitLevel"
                        else if (lowerHeader.includes("linkedin")) crmField = "linkedin"
                        else if (lowerHeader.includes("visual") || lowerHeader.includes("presence")) crmField = "visualPresence"
                        else if (lowerHeader.includes("note")) crmField = "note"
                        else if (lowerHeader.includes("decision") || lowerHeader.includes("maker")) crmField = "decisionMaker"
                        else if (lowerHeader.includes("lead")) crmField = "leadBy"
                        else if (lowerHeader.includes("date")) crmField = "date"
                    } else if (entityType === "campaigns") {
                        if (lowerHeader.includes("name")) crmField = "name"
                        else if (lowerHeader.includes("subject")) crmField = "subject"
                        else if (lowerHeader.includes("status")) crmField = "status"
                        else if (lowerHeader.includes("to")) crmField = "to"
                        else if (lowerHeader.includes("cc")) crmField = "cc"
                        else if (lowerHeader.includes("recipient")) crmField = "recipients"
                        else if (lowerHeader.includes("open")) crmField = "opens"
                        else if (lowerHeader.includes("reply")) crmField = "replies"
                    } else if (entityType === "creative") {
                        if (lowerHeader.includes("company")) crmField = "companyName"
                        else if (lowerHeader.includes("contact") || lowerHeader.includes("person")) crmField = "contactPerson"
                        else if (lowerHeader.includes("email")) crmField = "email"
                        else if (lowerHeader.includes("status")) crmField = "status"
                        else if (lowerHeader.includes("priority")) crmField = "priority"
                        else if (lowerHeader.includes("design") && lowerHeader.includes("status")) crmField = "designStatus"
                        else if (lowerHeader.includes("website") && lowerHeader.includes("status")) crmField = "websiteStatus"
                        else if (lowerHeader.includes("animation")) crmField = "animationStatus"
                        else if (lowerHeader.includes("last")) crmField = "lastContact"
                    } else {
                        if (lowerHeader.includes("first") || lowerHeader.includes("fname")) crmField = "firstName"
                        else if (lowerHeader.includes("last") || lowerHeader.includes("lname")) crmField = "lastName"
                        else if (lowerHeader.includes("email")) crmField = "email"
                        else if (lowerHeader.includes("company") || lowerHeader.includes("corp")) crmField = "company"
                        else if (lowerHeader.includes("job") || lowerHeader.includes("title")) crmField = "jobTitle"
                        else if (lowerHeader.includes("website") || lowerHeader.includes("link") || lowerHeader.includes("url")) crmField = "websiteLink"
                        else if (lowerHeader.includes("speciality")) crmField = "speciality"
                        else if (lowerHeader.includes("sub")) crmField = "subSpeciality"
                        else if (lowerHeader.includes("size")) crmField = "companySize"
                        else if (lowerHeader.includes("country")) crmField = "country"
                        else if (lowerHeader.includes("interest")) crmField = "serviceInterest"
                        else if (lowerHeader.includes("message") || lowerHeader.includes("req")) crmField = "message"
                        else if (lowerHeader.includes("status")) crmField = "status"
                    }

                    return {
                        csvColumn: header,
                        crmField: crmField,
                        type: lowerHeader.includes("website") || lowerHeader.includes("link") ? "URL" : "Text"
                    }
                })
                setMappings(initialMappings)
                setStep("mapping")
            }
        }
        reader.readAsText(file)
    }

    const handleImport = async () => {
        if (mode === "import") {
            const mappedData = csvData.map(row => {
                let item: any = {}
                if (entityType === "manufacturers") {
                    item = {
                        project_id: projectId,
                        date: new Date().toISOString().split('T')[0],
                        fit_level: "Medium",
                        visual_presence: "Medium",
                    }
                } else if (entityType === "campaigns") {
                    item = {
                        project_id: projectId,
                        status: "Draft",
                        opens: 0,
                        replies: 0,
                        recipients: 0
                    }
                } else if (entityType === "creative") {
                    item = {
                        project_id: projectId,
                        status: "NEW",
                        priority: "MEDIUM",
                        designStatus: "TODO",
                        websiteStatus: "TODO"
                    }
                } else {
                    item = {
                        project_id: projectId,
                        status: "New",
                        priority: "Medium",
                        assigned_to: "Admin"
                    }
                }

                // Temporary backward compatibility for mapping layer
                if (projectId) item.projectId = projectId

                mappings.forEach(mapping => {
                    if (mapping.crmField) {
                        item[mapping.crmField] = row[mapping.csvColumn]
                    }
                })
                return item
            })

            if (entityType === "manufacturers") {
                await replaceManufacturers(mappedData)
            } else if (entityType === "campaigns") {
                await replaceCampaigns(mappedData)
            } else if (entityType === "creative") {
                await replaceCreativeAssets(mappedData)
            } else {
                await replaceLeads(mappedData)
            }
            setStep("success")
        }
    }

    const handleExportCSV = () => {
        let dataToExport: any[] = []
        if (entityType === "manufacturers") dataToExport = manufacturers
        else if (entityType === "campaigns") dataToExport = campaigns
        else if (entityType === "creative") dataToExport = creativeAssets
        else dataToExport = leads

        // Filter by projectId if one is provided
        if (projectId) {
            dataToExport = dataToExport.filter((item: any) => item.projectId === projectId || item.project_id === projectId)
        }
        if (dataToExport.length === 0) {
            alert(`No ${entityType} to export`)
            return
        }

        let headers: string[] = []
        let keys: string[] = []

        if (entityType === "manufacturers") {
            headers = ["Date", "Parent Company", "Peer Brand", "Product Match Rate", "Product Link / Website", "Company Size", "Country", "Fit Level", "LinkedIn", "Visual Presence", "Note", "Decision Maker", "Lead By"]
            keys = ["date", "parentCompany", "peerBrand", "productMatchRate", "website", "companySize", "country", "fitLevel", "linkedin", "visualPresence", "note", "decisionMaker", "leadBy"]
        } else if (entityType === "campaigns") {
            headers = ["Name", "Subject", "Status", "To", "CC", "Recipients", "Opens", "Replies"]
            keys = ["name", "subject", "status", "to", "cc", "recipients", "opens", "replies"]
        } else if (entityType === "creative") {
            headers = ["Company", "Contact", "Email", "Status", "Priority", "Design Status", "Website Status", "Animation Status"]
            keys = ["companyName", "contactPerson", "email", "status", "priority", "designStatus", "websiteStatus", "animationStatus"]
        } else {
            headers = ["First Name", "Last Name", "Work Email", "Company Name", "Job Title", "Website Link", "Speciality", "Sub-speciality", "Company Size", "Country", "Lead Stage", "Message", "Status", "Priority"]
            keys = ["firstName", "lastName", "email", "company", "jobTitle", "websiteLink", "speciality", "subSpeciality", "companySize", "country", "serviceInterest", "message", "status", "priority"]
        }

        let csvContent = headers.join(",") + "\n"

        dataToExport.forEach((item: any) => {
            const row = keys.map(k => {
                let val = item[k] || ""
                if (typeof val === "string" && (val.includes(",") || val.includes("\n") || val.includes("\""))) {
                    val = `"${val.replace(/"/g, '""')}"`
                }
                return val
            })
            csvContent += row.join(",") + "\n"
        })

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${entityType}_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setOpen(false)
    }

    const reset = () => {
        setStep("upload")
        setFileName(null)
        setCsvHeaders([])
        setCsvData([])
        setMappings([])
        setOpen(false)
    }

    const crmFields = entityType === "manufacturers" ? [
        { value: "date", label: "Date" },
        { value: "parentCompany", label: "Parent Company" },
        { value: "peerBrand", label: "Peer Brand" },
        { value: "productMatchRate", label: "Product Match Rate" },
        { value: "website", label: "Product Link / Website" },
        { value: "companySize", label: "Company Size" },
        { value: "country", label: "Country" },
        { value: "fitLevel", label: "Fit Level" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "visualPresence", label: "Visual Presence" },
        { value: "note", label: "Note" },
        { value: "decisionMaker", label: "Decision Maker" },
        { value: "leadBy", label: "Lead By" },
    ] : entityType === "campaigns" ? [
        { value: "name", label: "Campaign Name" },
        { value: "subject", label: "Subject" },
        { value: "status", label: "Status" },
        { value: "to", label: "Target To" },
        { value: "cc", label: "Target CC" },
        { value: "recipients", label: "Recipients" },
        { value: "opens", label: "Opens" },
        { value: "replies", label: "Replies" },
    ] : entityType === "creative" ? [
        { value: "companyName", label: "Company Name" },
        { value: "contactPerson", label: "Contact Person" },
        { value: "email", label: "Email" },
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
        { value: "designStatus", label: "Design Status" },
        { value: "websiteStatus", label: "Website Status" },
        { value: "animationStatus", label: "Animation Status" },
        { value: "storyboardStatus", label: "Storyboard Status" },
        { value: "scriptStatus", label: "Script Status" },
    ] : [
        { value: "firstName", label: "First Name" },
        { value: "lastName", label: "Last Name" },
        { value: "email", label: "Work Email" },
        { value: "company", label: "Company Name" },
        { value: "jobTitle", label: "Job Title" },
        { value: "websiteLink", label: "Website Link" },
        { value: "speciality", label: "Speciality" },
        { value: "subSpeciality", label: "Sub-speciality" },
        { value: "companySize", label: "Company Size" },
        { value: "country", label: "Country" },
        { value: "serviceInterest", label: "Service Interest" },
        { value: "message", label: "Message / Requirements" },
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
        { value: "assignedTo", label: "Assigned To" },
        { value: "phone", label: "Phone" },
    ]

    const columnTypes = [
        { value: "Text", icon: Type },
        { value: "URL", icon: LinkIcon },
        { value: "Number", icon: Hash },
        { value: "Dropdown", icon: List },
    ]

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) reset()
            setOpen(val)
        }}>
            <DialogTrigger
                render={
                    <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl h-10 border-border hover:bg-primary/5 hover:text-primary transition-all">
                        {mode === "import" ? <Upload className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {mode === "import" ? "Import" : "Export"}
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader className="bg-primary/5 p-8 border-b border-primary/10">
                    <DialogTitle className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                            {mode === "import" ? <Upload className="h-6 w-6" /> : <Download className="h-6 w-6" />}
                        </div>
                        {mode === "import" ? "Advanced Import" : "Export Data"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium mt-1">
                        {mode === "import"
                            ? "Map your file columns to CRM fields with precision."
                            : "Choose a format to export your project data."}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {mode === "import" ? (
                        <div className="space-y-6">
                            {step === "upload" && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-[2rem] p-12 gap-4 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".csv"
                                        className="hidden"
                                    />
                                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black tracking-tight">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">CSV (max. 10MB)</p>
                                    </div>
                                </div>
                            )}

                            {step === "mapping" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{fileName}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{csvData.length} Rows Detected</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest" onClick={() => setStep("upload")}>Change File</Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                            <div className="col-span-4">CSV Column</div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-4">CRM Field</div>
                                            <div className="col-span-3">Type</div>
                                        </div>

                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                            {mappings.map((mapping, i) => (
                                                <div key={i} className="grid grid-cols-12 gap-4 items-center bg-muted/20 p-3 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                                                    <div className="col-span-4">
                                                        <div className="text-xs font-bold truncate">{mapping.csvColumn}</div>
                                                    </div>
                                                    <div className="col-span-1 flex justify-center">
                                                        <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <Select
                                                            value={mapping.crmField}
                                                            onValueChange={(val) => {
                                                                const newMappings = [...mappings]
                                                                newMappings[i].crmField = val || ""
                                                                setMappings(newMappings)
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-9 rounded-xl border-none bg-background/50 text-[11px] font-bold">
                                                                <SelectValue placeholder="Skip field" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                                <SelectItem value="" className="text-xs font-bold rounded-lg">Skip field</SelectItem>
                                                                {crmFields.map(f => (
                                                                    <SelectItem key={f.value} value={f.value} className="text-xs font-bold rounded-lg">{f.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Select
                                                            value={mapping.type}
                                                            onValueChange={(val: any) => {
                                                                const newMappings = [...mappings]
                                                                newMappings[i].type = val
                                                                setMappings(newMappings)
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-9 rounded-xl border-none bg-background/50 text-[11px] font-bold">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                                {columnTypes.map(t => (
                                                                    <SelectItem key={t.value} value={t.value} className="text-xs font-bold rounded-lg">
                                                                        <div className="flex items-center gap-2">
                                                                            <t.icon className="h-3 w-3" />
                                                                            {t.value}
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === "success" && (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="h-20 w-20 rounded-[2rem] bg-green-500/10 flex items-center justify-center text-green-600 animate-in zoom-in duration-500">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black tracking-tighter">Import Successful!</h3>
                                        <p className="text-muted-foreground font-medium mt-1">{csvData.length} {entityType} have been added to your project.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Button onClick={handleExportCSV} variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all group">
                                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <span className="font-black uppercase tracking-widest text-[10px]">Export as CSV</span>
                            </Button>
                            <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all group">
                                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <FileSpreadsheet className="h-6 w-6" />
                                </div>
                                <span className="font-black uppercase tracking-widest text-[10px]">Export as Excel</span>
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0">
                    {mode === "import" ? (
                        step === "upload" ? (
                            <Button disabled className="w-full h-14 rounded-2xl font-black uppercase tracking-widest opacity-50">Select File to Continue</Button>
                        ) : step === "mapping" ? (
                            <Button onClick={handleImport} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none">Start Import</Button>
                        ) : (
                            <Button onClick={reset} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">Close</Button>
                        )
                    ) : (
                        <Button onClick={handleExportCSV} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none">Download CSV</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
