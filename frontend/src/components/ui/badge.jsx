import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-950 text-white",
        secondary: "border-transparent bg-slate-100 text-slate-600",
        destructive: "border-transparent bg-red-100 text-red-600",
        outline: "text-slate-600 border-slate-200",
        success: "border-transparent bg-emerald-100 text-emerald-700",
        primary: "border-transparent bg-primary/10 text-primary", // The "Cyan Tint" look
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
