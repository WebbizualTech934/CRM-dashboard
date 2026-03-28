"use client"

import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { CopyrightFooter } from "./CopyrightFooter"

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 xl:p-14 transition-all duration-300">
                    <div className="w-full max-w-[1800px] mx-auto space-y-10">
                        {children}
                    </div>
                </main>
            </div>
            <CopyrightFooter />
        </div>
    )
}
