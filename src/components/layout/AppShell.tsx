"use client"

import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-10 lg:p-14">
                    <div className="max-w-[1600px] mx-auto space-y-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
