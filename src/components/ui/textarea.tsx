import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground bg-card border-amber-500/20 flex field-sizing-content min-h-16 w-full rounded-lg border px-4 py-3 text-base shadow-sm transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:shadow-md",
        "hover:border-amber-500/30 hover:shadow-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
