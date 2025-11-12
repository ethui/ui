import { useCallback, useState } from "react";
import type { AbiFunction, Address } from "viem";
import { decodeFunctionResult } from "viem";
import type { ExecutionParams } from "./types.js";
import { formatDecodedResult } from "./utils.js";

export type InternalResult = {
  type: "call" | "simulation" | "execution" | "error";
  data?: string;
  hash?: string;
  cleanResult?: string;
  error?: string;
};

interface UseFunctionExecutionParams {
  abiFunction: AbiFunction;
  callData: string;
  msgSender?: Address;
  onQuery: (params: ExecutionParams) => Promise<`0x${string}`>;
  onWrite: (params: ExecutionParams) => Promise<`0x${string}`>;
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
}

export function useFunctionExecution() {
  const [result, setResult] = useState<InternalResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const simulate = useCallback(
    async ({
      abiFunction,
      callData,
      msgSender,
      onSimulate,
    }: UseFunctionExecutionParams) => {
      if (!callData || !onSimulate) return;

      const isWrite =
        abiFunction.stateMutability !== "view" &&
        abiFunction.stateMutability !== "pure";

      setIsSimulating(true);
      try {
        const rawResult = await onSimulate({
          abiFunction,
          callData: callData as `0x${string}`,
          msgSender,
        });

        if (isWrite) {
          setResult({
            type: "simulation",
            cleanResult: "Simulation successful",
            data: rawResult,
          });
        } else {
          try {
            const decoded = decodeFunctionResult({
              abi: [abiFunction],
              functionName: abiFunction.name,
              data: rawResult,
            });

            setResult({
              type: "simulation",
              cleanResult: formatDecodedResult(decoded),
              data: rawResult,
            });
          } catch {
            setResult({
              type: "simulation",
              data: rawResult,
            });
          }
        }
      } catch (error) {
        setResult({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsSimulating(false);
      }
    },
    [],
  );

  const execute = useCallback(
    async ({
      abiFunction,
      callData,
      msgSender,
      onQuery,
      onWrite,
    }: UseFunctionExecutionParams) => {
      if (!callData) return;

      const isWrite =
        abiFunction.stateMutability !== "view" &&
        abiFunction.stateMutability !== "pure";

      setIsExecuting(true);
      try {
        if (isWrite) {
          const hash = await onWrite({
            abiFunction,
            callData: callData as `0x${string}`,
            msgSender,
          });

          setResult({
            type: "execution",
            hash,
            cleanResult: "Transaction submitted",
          });
        } else {
          const rawResult = await onQuery({
            abiFunction,
            callData: callData as `0x${string}`,
            msgSender,
          });

          try {
            const decoded = decodeFunctionResult({
              abi: [abiFunction],
              functionName: abiFunction.name,
              data: rawResult,
            });

            setResult({
              type: "call",
              cleanResult: formatDecodedResult(decoded),
              data: rawResult,
            });
          } catch {
            setResult({
              type: "call",
              data: rawResult,
            });
          }
        }
      } catch (error) {
        setResult({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [],
  );

  return {
    result,
    isSimulating,
    isExecuting,
    simulate,
    execute,
  };
}
