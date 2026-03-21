"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function CopyrightFooter() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <>
            {/* Hover Trigger Area */}
            <div 
                className="fixed bottom-0 left-0 right-0 h-10 z-[45] pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            {/* Sliding Footer */}
            <footer 
                className={cn(
                    "fixed bottom-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-center px-8 transition-transform duration-500 ease-out z-50 pointer-events-none",
                    isHovered ? "translate-y-0" : "translate-y-full"
                )}
            >
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-6">
                    <span>© 2024 Digital Marketing CRM</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>All Rights Reserved</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Internal Sales Portal</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-primary/60">Production Level v1.0</span>
                </div>
            </footer>
        </>
    )
}
