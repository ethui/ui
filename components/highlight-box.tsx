import { cn } from "../lib/utils.js";

export interface HighlightBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function HighlightBox({ children, className }: HighlightBoxProps) {
  return (
    <div className={cn("max-w-full bg-accent p-2", className)}>{children}</div>
  );
}
