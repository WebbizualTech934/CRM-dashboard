"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-md border border-muted-foreground/30 bg-background/50 outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary",
            className
          )}
          {...props}
        />
        <Check 
          className="absolute h-3.5 w-3.5 text-primary-foreground opacity-0 pointer-events-none transition-opacity peer-checked:opacity-100" 
          strokeWidth={4}
        />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
