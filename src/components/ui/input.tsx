import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, rightElement, ...props }, ref) => {
    const hasValue =
      typeof props.value === "string" && props.value.length > 0

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "peer h-[42px] w-full rounded-md border border-input bg-transparent px-3 pt-5 text-sm outline-none focus:outline-none",// focus:ring-2 focus:ring-ring",
            className
          )}
          {...props}
        />

        {label && (
          <label
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all",
              "peer-focus:top-2 peer-focus:text-xs peer-focus:text-foreground",
              hasValue && "top-2 text-xs"
            )}
          >
            {label}
          </label>
        )}

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
