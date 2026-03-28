"use client"

import React, { useState } from "react"
import { DataTable, Column } from "@/components/shared/DataTable"
import { RowDetailDrawer } from "./RowDetailDrawer"
import { useCRMData } from "@/hooks/use-crm-data"
import { Task } from "@/providers/crm-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { Calendar, User, Tag, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NewTaskModal } from "@/components/projects/NewTaskModal"

interface TasksTableProps {
    projectId: string
}

export function TasksTable({ projectId }: TasksTableProps) {
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [viewingTask, setViewingTask] = useState<Task | null>(null)
    const { tasks, teamMembers, updateTask, deleteManyTasks, deleteTask } = useCRMData()
    const projectTasks = tasks.filter(t => t.projectId === projectId)

    const columns: Column<Task>[] = [
        {
            header: "Task Title",
            accessorKey: "title",
            sortable: true,
            width: "350px",
            cell: (task: Task) => (
                <div className="flex flex-col gap-1 py-1">
                    <span className="font-bold text-sm text-foreground">{task.title}</span>
                    <span className="text-[11px] font-bold text-muted-foreground/40">{task.description || "No description"}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            width: "160px",
            cell: (task: Task) => {
                const colors = {
                    'Todo': 'bg-slate-500/10 text-slate-600',
                    'In Progress': 'bg-blue-500/10 text-blue-600',
                    'Waiting': 'bg-orange-500/10 text-orange-600',
                    'Review': 'bg-purple-500/10 text-purple-600',
                    'Completed': 'bg-green-500/10 text-green-600',
                    'Blocked': 'bg-red-500/10 text-red-600',
                    'Cancelled': 'bg-gray-500/10 text-gray-400',
                }
                return (
                    <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-none", colors[task.status])}>
                        {task.status}
                    </Badge>
                )
            }
        },
        {
            header: "Priority",
            accessorKey: "priority",
            sortable: true,
            width: "140px",
            cell: (task: Task) => {
                const colors = {
                    'Low': 'bg-slate-500/5 text-slate-500',
                    'Medium': 'bg-blue-500/5 text-blue-500',
                    'High': 'bg-orange-500/5 text-orange-500',
                    'Urgent': 'bg-red-500/10 text-red-600 animate-pulse',
                }
                return (
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", task.priority === 'Urgent' ? 'bg-red-600 animate-ping' : task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-400')} />
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", colors[task.priority].split(' ')[1])}>
                            {task.priority}
                        </span>
                    </div>
                )
            }
        },
        {
            header: "Due Date",
            accessorKey: "dueDate",
            sortable: true,
            width: "150px",
            cell: (task: Task) => (
                <div className="flex items-center gap-2 text-muted-foreground group">
                    <Calendar className="h-4 w-4 opacity-50" />
                    <span className="text-xs font-bold text-foreground/80">
                        {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No deadline"}
                    </span>
                </div>
            )
        },
        {
            header: "Assigned To",
            accessorKey: "assignedTo",
            width: "200px",
            cell: (task: Task) => {
                const member = teamMembers.find(m => m.id === task.assignedTo)
                if (!member) return <span className="text-[10px] font-black uppercase text-muted-foreground/40 italic tracking-widest">Unassigned</span>
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-[10px] font-black bg-primary/10 text-primary">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-foreground">{member.name}</span>
                    </div>
                )
            }
        },
        {
            header: "Reference",
            accessorKey: "relatedType",
            width: "150px",
            cell: (task: Task) => (
                task.relatedType ? (
                    <Badge variant="outline" className="rounded-lg h-6 px-2 text-[9px] font-black uppercase tracking-tighter border-border bg-background/50">
                        {task.relatedType}: {task.relatedId?.slice(0, 4)}...
                    </Badge>
                ) : <span className="text-xs text-muted-foreground italic">-</span>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <DataTable
                data={projectTasks}
                columns={columns}
                searchKey="title"
                searchPlaceholder="Search tasks..."
                entityType="Task"
                onView={(task) => setViewingTask(task)}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => deleteTask(task.id)}
                onBulkDelete={(ids) => deleteManyTasks(ids)}
                onRowClick={(task) => setViewingTask(task)}
                emptyState={
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="h-20 w-20 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary/30">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold">All caught up!</h3>
                            <p className="text-muted-foreground text-sm max-w-[250px] mx-auto mt-1">
                                No tasks found for this project. Start by adding a task to track your progress.
                            </p>
                        </div>
                    </div>
                }
                toolbarActions={
                    <Button 
                        size="sm" 
                        onClick={() => setIsNewModalOpen(true)}
                        className="h-8 rounded-lg bg-primary text-white font-bold px-4 hover:shadow-lg hover:shadow-primary/20 transition-all gap-2"
                    >
                        <Tag className="h-3.5 w-3.5" /> Add Task
                    </Button>
                }
            />

            <NewTaskModal
                open={isNewModalOpen || !!editingTask}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsNewModalOpen(false)
                        setEditingTask(null)
                    }
                }}
                projectId={projectId || "1"}
                task={editingTask}
            />

            <RowDetailDrawer
                open={!!viewingTask}
                onOpenChange={(open) => !open && setViewingTask(null)}
                data={viewingTask}
                onEdit={(task) => setEditingTask(task)}
            />
        </div>
    )
}
