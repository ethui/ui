import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button.js";
import type { ExecutionResult } from "./types.js";

export function DefaultResultDisplay({ result }: { result: ExecutionResult }) {
  const [showFullResult, setShowFullResult] = useState(false);

  const getTitle = () => {
    switch (result.type) {
      case "call":
        return "Call Result";
      case "simulation":
        return "Simulation Result";
      case "execution":
        return "Transaction Receipt";
      case "error":
        return "Error";
    }
  };

  const isError = result.type === "error";

  return (
    <div className="w-full rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-lg">{getTitle()}</h3>

      {result.hash && (
        <div className="mb-4 rounded bg-muted p-3">
          <span className="font-semibold">Transaction Hash: </span>
          <span className="break-all font-mono text-sm">{result.hash}</span>
        </div>
      )}

      {result.cleanResult && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className={clsx("font-semibold", isError && "text-red-600")}>
              Result:
            </span>
            {result.data && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullResult(!showFullResult)}
                className="h-6 px-2"
              >
                {showFullResult ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    Show Details
                  </>
                )}
              </Button>
            )}
          </div>
          <div
            className={clsx(
              "max-w-4xl rounded border p-3",
              isError
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50",
            )}
          >
            <span
              className={clsx(
                "font-mono text-red-700 text-sm",
                isError && "text-red-700",
              )}
            >
              {result.cleanResult}
            </span>
          </div>

          {showFullResult && result.data && (
            <div className="mt-4">
              <span className="font-semibold">Full Response:</span>
              <pre className="mt-2 w-full max-w-4xl whitespace-pre-wrap break-all rounded bg-muted p-4">
                {result.data}
              </pre>
            </div>
          )}
        </div>
      )}

      {result.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <span className="font-mono text-red-700 text-sm">{result.error}</span>
        </div>
      )}

      {!result.cleanResult && !result.error && result.data && (
        <pre className="w-full whitespace-pre-wrap break-all rounded bg-muted p-4">
          {result.data}
        </pre>
      )}
    </div>
  );
}
