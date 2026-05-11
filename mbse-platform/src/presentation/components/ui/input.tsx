import * as React from "react";
import { cn } from "@/presentation/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Pass when using Input standalone (outside a Form context). Adds red border + message below. */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
          "transition-all duration-150 placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Standalone error prop (used outside Form context)
          error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
          // Form context: FormControl sets aria-invalid="true" automatically
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive aria-[invalid=true]:focus-visible:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
