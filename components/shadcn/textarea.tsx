import { cn } from "../../lib/utils.js";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  icon?: React.ReactNode;
}

function Textarea({ className, icon, ...props }: TextareaProps) {
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          "flex min-h-[60px] w-full border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          icon && "pr-10",
          className,
        )}
        {...props}
      />
      {icon && (
        <div className="pointer-events-none absolute top-2 right-0 flex items-center pr-3">
          {icon}
        </div>
      )}
    </div>
  );
}

export { Textarea };
