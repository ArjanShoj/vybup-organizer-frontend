import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm [a&]:hover:from-purple-700 [a&]:hover:to-purple-800",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-sm [a&]:hover:from-secondary-700 [a&]:hover:to-secondary-800",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-purple-400 text-purple-300 bg-transparent [a&]:hover:bg-purple-500/10 [a&]:hover:text-white [a&]:hover:border-purple-300",
        luxury:
          "border-transparent bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-md [a&]:hover:from-secondary-600 [a&]:hover:to-secondary-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
