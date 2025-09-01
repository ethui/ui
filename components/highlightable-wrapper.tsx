import { cn } from "../lib/utils.js";

interface HighlightableWrapperProps {
  highlightKey: string;
  hoveredKey: string | null;
  onHover: (key: string | null) => void;
  className?: string;
  children: React.ReactNode;
}

export function HighlightableWrapper({
  highlightKey,
  hoveredKey,
  onHover,
  className,
  children,
}: HighlightableWrapperProps) {
  const isHighlighted =
    hoveredKey?.toLowerCase() === highlightKey.toLowerCase();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: This wrapper only handles hover for visual highlighting
    <div
      onMouseEnter={() => onHover(highlightKey)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        isHighlighted && ["bg-yellow-100/80 dark:bg-yellow-900/30"],
        className,
      )}
    >
      {children}
    </div>
  );
}
