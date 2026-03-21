"use client"

import React, { useState } from "react"
import { DataTable } from "@/components/shared/DataTable"
import { useCRMData } from "@/hooks/use-crm-data"
import { Task } from "@/providers/crm-provider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, User, Tag, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TasksTableProps {
    projectId: string
}

export function TasksTable({ projectId }: TasksTableProps) {
    const { tasks, teamMembers, updateTask, deleteManyTasks, deleteTask } = useCRMData()
    const projectTasks = tasks.filter(t => t.projectId === projectId)

    const columns: any[] = [
        {
            header: "Task Title",
            accessorKey: "title",
            sortable: true,
            className: "min-w-[250px]",
            cell: (task: Task) => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground">{task.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{task.description || "No description"}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
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
                    <Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none", colors[task.status])}>
                        {task.status}
                    </Badge>
                )
            }
        },
        {
            header: "Priority",
            accessorKey: "priority",
            sortable: true,
            cell: (task: Task) => {
                const colors = {
                    'Low': 'bg-slate-500/5 text-slate-500',
                    'Medium': 'bg-blue-500/5 text-blue-500',
                    'High': 'bg-orange-500/5 text-orange-500',
                    'Urgent': 'bg-red-500/10 text-red-600 animate-pulse',
                }
                return (
                    <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", task.priority === 'Urgent' ? 'bg-red-600' : task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-400')} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", colors[task.priority].split(' ')[1])}>
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
            cell: (task: Task) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-bold">
                        {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No deadline"}
                    </span>
                </div>
            )
        },
        {
            header: "Assigned To",
            accessorKey: "assignedTo",
            cell: (task: Task) => {
                const member = teamMembers.find(m => m.id === task.assignedTo)
                if (!member) return <span className="text-xs text-muted-foreground italic">Unassigned</span>
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border/50">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-[10px] font-bold">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold">{member.name}</span>
                    </div>
                )
            }
        },
        {
            header: "Reference",
            accessorKey: "relatedType",
            cell: (task: Task) => (
                task.relatedType ? (
                    <Badge variant="outline" className="rounded-lg h-6 px-2 text-[9px] font-black uppercase tracking-tighter border-border/50 bg-background/50">
                        {task.relatedType}: {task.relatedId?.slice(0, 4)}...
                    </Badge>
                ) : <span className="text-xs text-muted-foreground italic">-</span>
            )
        }
    ]

    return (
        <DataTable
            data={projectTasks}
            columns={columns}
            searchPlaceholder="Search tasks..."
            searchKey="title"
            entityType="Task"
            onDelete={(task) => deleteTask(task.id)}
            onBulkDelete={(ids) => deleteManyTasks(ids)}
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
        />
    )
}
