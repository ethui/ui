import clsx from "clsx";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button.js";

type InternalResult = {
  type: "call" | "simulation" | "execution" | "error";
  data?: string;
  hash?: string;
  cleanResult?: string;
  error?: string;
};

interface DefaultResultDisplayProps {
  result: InternalResult;
  onHashClick?: (hash: string) => void;
}

export function DefaultResultDisplay({
  result,
  onHashClick,
}: DefaultResultDisplayProps) {
  const [showRawData, setShowRawData] = useState(false);

  const isError = result.type === "error";

  return (
    <div className="mt-4 w-full space-y-3">
      {result.hash && (
        <div className="space-y-1">
          <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Transaction Hash
          </div>
          {onHashClick ? (
            <button
              type="button"
              onClick={() => onHashClick(result.hash!)}
              className="group inline-flex cursor-pointer items-center gap-1 break-all text-left font-mono text-sidebar-ring text-sm hover:underline"
            >
              {result.hash}
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
            </button>
          ) : (
            <div className="break-all font-mono text-sm">{result.hash}</div>
          )}
        </div>
      )}

      {/* Main Result */}
      {result.cleanResult && (
        <div className="space-y-2">
          <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {result.type === "call"
              ? "Result"
              : result.type === "simulation"
                ? "Simulation Result"
                : "Result"}
          </div>
          <div
            className={clsx(
              "rounded-md p-4 font-mono text-base",
              isError ? "bg-red-50 text-red-900" : "bg-muted",
            )}
          >
            <span className="w-fit break-all">{result.cleanResult}</span>
          </div>
        </div>
      )}

      {result.error && (
        <div className="space-y-2">
          <div className="font-medium text-red-600 text-xs uppercase tracking-wide">
            Error
          </div>
          <div className="rounded-md bg-red-50 p-4 font-mono text-red-900 text-sm">
            {result.error}
          </div>
        </div>
      )}

      {result.data && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawData(!showRawData)}
            className="h-8 px-2 text-muted-foreground text-xs"
          >
            {showRawData ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                Hide raw data
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                Show raw data
              </>
            )}
          </Button>

          {showRawData && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-4 font-mono text-xs">
              {result.data}
            </pre>
          )}
        </div>
      )}

      {!result.cleanResult && !result.error && result.data && (
        <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-4 font-mono text-sm">
          {result.data}
        </pre>
      )}
    </div>
  );
}
