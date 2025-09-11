import { cn } from "../lib/utils.js";
import { useHighlight } from "./providers/highlight-provider.js";

interface HighlightableWrapperProps {
  highlightKey: string;
  className?: string;
  children: React.ReactNode;
}

export function HighlightableWrapper({
  highlightKey,
  className,
  children,
}: HighlightableWrapperProps) {
  const { hoveredKey, setHoveredKey } = useHighlight();

  const isHighlighted =
    hoveredKey?.toLowerCase() === highlightKey.toLowerCase();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: This wrapper only handles hover for visual highlighting
    <div
      onMouseEnter={() => setHoveredKey(highlightKey)}
      onMouseLeave={() => setHoveredKey(null)}
      className={cn(
        isHighlighted && ["bg-yellow-100/80 dark:bg-yellow-900/30"],
        className,
      )}
    >
      {children}
    </div>
  );
}
