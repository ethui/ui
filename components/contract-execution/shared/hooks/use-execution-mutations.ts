import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { AbiFunction, Address, Hex } from "viem";
import { decodeFunctionResult } from "viem";
import type { ExecutionParams } from "../../types.js";
import { formatDecodedResult } from "../utils/utils.js";

export type InternalResult = {
  type: "read" | "simulate" | "write" | "error";
  data?: string;
  hash?: Hex;
  cleanResult?: string;
  error?: string;
};

function decodeResult(
  abiFunction: AbiFunction | undefined,
  rawResult: Hex,
): string | undefined {
  if (!abiFunction) return undefined;
  try {
    const decoded = decodeFunctionResult({
      abi: [abiFunction],
      functionName: abiFunction.name,
      data: rawResult,
    });
    return formatDecodedResult(decoded);
  } catch {
    return undefined;
  }
}

interface BaseExecutionParams {
  abiFunction?: AbiFunction;
  callData: Hex;
  value?: bigint;
  msgSender: Address | undefined;
}

interface ReadParams extends BaseExecutionParams {
  onQuery: (params: ExecutionParams) => Promise<Hex>;
}

interface SimulateParams extends BaseExecutionParams {
  onSimulate: (params: ExecutionParams) => Promise<Hex>;
}

interface WriteParams extends BaseExecutionParams {
  onWrite: (params: ExecutionParams) => Promise<Hex>;
}

export function useExecutionMutations() {
  const [result, setResult] = useState<InternalResult | null>(null);

  const readMutation = useMutation({
    mutationFn: async ({
      abiFunction,
      callData,
      value,
      msgSender,
      onQuery,
    }: ReadParams) => {
      const rawResult = await onQuery({
        abiFunction,
        callData,
        value,
        msgSender,
      });
      const cleanResult = decodeResult(abiFunction, rawResult);
      return {
        type: "read" as const,
        data: rawResult,
        cleanResult: cleanResult || rawResult,
      };
    },
    onSuccess: (data) => setResult(data),
    onError: (error) =>
      setResult({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
  });

  const simulateMutation = useMutation({
    mutationFn: async ({
      abiFunction,
      callData,
      value,
      msgSender,
      onSimulate,
    }: SimulateParams) => {
      const rawResult = await onSimulate({
        abiFunction,
        callData,
        value,
        msgSender,
      });
      const cleanResult = decodeResult(abiFunction, rawResult);
      return {
        type: "simulate" as const,
        data: rawResult,
        cleanResult: cleanResult || "Simulation successful",
      };
    },
    onSuccess: (data) => setResult(data),
    onError: (error) =>
      setResult({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
  });

  const writeMutation = useMutation({
    mutationFn: async ({
      abiFunction,
      callData,
      value,
      msgSender,
      onWrite,
    }: WriteParams) => {
      const hash = await onWrite({ abiFunction, callData, value, msgSender });
      return {
        type: "write" as const,
        hash,
        cleanResult: "Transaction submitted",
      };
    },
    onSuccess: (data) => setResult(data),
    onError: (error) =>
      setResult({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
  });

  const isLoading =
    readMutation.isPending ||
    simulateMutation.isPending ||
    writeMutation.isPending;

  return {
    result,
    isLoading,
    read: readMutation.mutate,
    simulate: simulateMutation.mutate,
    write: writeMutation.mutate,
  };
}
