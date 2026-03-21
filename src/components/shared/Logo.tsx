"use client"

import Image from "next/image"
import { LayoutDashboard } from "lucide-react"

interface LogoProps {
    size?: "sm" | "md" | "lg"
    showTagline?: boolean
}

export function Logo({ size = "md", showTagline = false }: LogoProps) {
    const sizes = {
        sm: { img: 32, text: "text-lg" },
        md: { img: 44, text: "text-2xl" },
        lg: { img: 56, text: "text-3xl" },
    }
    const cfg = sizes[size]

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-3">
                {/* Try logo.png; if not found, fallback to icon */}
                <div
                    className="relative flex-shrink-0"
                    style={{ width: cfg.img, height: cfg.img }}
                >
                    <Image
                        src="/logo.png"
                        alt="CRM Logo"
                        width={cfg.img}
                        height={cfg.img}
                        className="object-contain"
                        onError={(e) => {
                            // Fallback: hide broken image, show icon sibling
                            ;(e.target as HTMLImageElement).style.display = "none"
                            const next = (e.target as HTMLImageElement).nextElementSibling
                            if (next) (next as HTMLElement).style.display = "flex"
                        }}
                    />
                    {/* Fallback icon (hidden by default) */}
                    <div
                        className="absolute inset-0 hidden items-center justify-center bg-primary rounded-2xl"
                        style={{ display: "none" }}
                    >
                        <LayoutDashboard
                            className="text-primary-foreground"
                            style={{ width: cfg.img * 0.55, height: cfg.img * 0.55 }}
                        />
                    </div>
                </div>

                <span className={`${cfg.text} font-black tracking-tighter text-foreground`}>
                    Digital<span className="text-primary">CRM</span>
                </span>
            </div>
            {showTagline && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Digital Marketing Sales CRM
                </p>
            )}
        </div>
    )
}
