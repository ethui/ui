import { useState } from "react";
import type { Address, Hex } from "viem";
import type { RawCallParams } from "./types.js";
import type { InternalResult } from "./use-function-execution.js";

interface UseRawExecutionParams {
  isWrite: boolean;
  onExecute: (params: RawCallParams) => Promise<Hex>;
}

export function useRawExecution({ isWrite, onExecute }: UseRawExecutionParams) {
  const [result, setResult] = useState<InternalResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = async (params: {
    callData: string;
    value?: bigint;
    msgSender?: Address;
  }) => {
    if (!params.callData) return;

    setIsExecuting(true);
    try {
      const response = await onExecute({
        data: params.callData as Hex,
        value: params.value,
        msgSender: params.msgSender,
      });

      if (isWrite) {
        setResult({
          type: "execution",
          hash: response,
          cleanResult: "Transaction submitted",
        });
      } else {
        setResult({
          type: "call",
          data: response,
          cleanResult: response,
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    result,
    isExecuting,
    execute,
  };
}
