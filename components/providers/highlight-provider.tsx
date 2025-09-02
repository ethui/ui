import { createContext, type ReactNode, useContext, useState } from "react";

interface HighlightContextType {
  hoveredKey: string | null;
  setHoveredKey: (key: string | null) => void;
}

const HighlightContext = createContext<HighlightContextType>({
  hoveredKey: null,
  setHoveredKey: () => {},
});

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <HighlightContext.Provider value={{ hoveredKey, setHoveredKey }}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlight must be used within a HighlightProvider");
  }
  return context;
}
