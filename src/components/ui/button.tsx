import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold shadow-lg hover:from-gold-600 hover:to-gold-700 hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-gold-400 focus:ring-offset-2",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-gold-400 bg-transparent text-gold-400 font-semibold shadow-xs hover:border-gold-300 hover:bg-gold-400/10 hover:text-gold-300 focus:ring-2 focus:ring-gold-400 focus:ring-offset-2",
        secondary:
          "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-semibold shadow-lg hover:from-secondary-700 hover:to-secondary-800 hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2",
        ghost:
          "text-dark-300 hover:text-white hover:bg-dark-700/50 dark:hover:bg-accent/50",
        link: "text-gold-500 underline-offset-4 hover:underline hover:text-gold-400",
        luxury:
          "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-semibold shadow-lg hover:from-secondary-700 hover:to-secondary-800 hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 luxury-shadow",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
