import { cn } from "../../lib/utils.js";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input
        className={cn(
          "flex h-9 w-full border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          icon && "pr-10",
          className,
        )}
        {...props}
      />
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          {icon}
        </div>
      )}
    </div>
  );
}

export { Input };
