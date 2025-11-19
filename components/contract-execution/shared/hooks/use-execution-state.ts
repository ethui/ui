import { useCallback, useState } from "react";
import type { AbiFunction, Address, Hex } from "viem";
import type { ExecutionParams } from "../../types.js";
import { isWriteFunction } from "../utils/utils.js";
import { useExecutionMutations } from "./use-execution-mutations.js";

export interface UseExecutionStateParams {
  abiFunction?: AbiFunction | null;
  defaultCallData?: Hex;
  defaultValue?: bigint;
  defaultSender?: Address;
  onQuery?: (params: ExecutionParams) => Promise<Hex>;
  onWrite?: (params: ExecutionParams) => Promise<Hex>;
  onSimulate?: (params: ExecutionParams) => Promise<Hex>;
  msgSender?: Address;
}

export function useExecutionState({
  abiFunction,
  defaultCallData,
  defaultValue,
  onQuery,
  onWrite,
  onSimulate,
  msgSender,
}: UseExecutionStateParams) {
  const [callData, setCallData] = useState<Hex | undefined>(defaultCallData);
  const [value, setValue] = useState<bigint | undefined>(defaultValue);

  const executionMutations = useExecutionMutations();

  const handleCallDataChange = useCallback(
    ({ data, value: newValue }: { data?: Hex; value?: bigint }) => {
      setCallData(data);
      setValue(newValue);
    },
    [],
  );

  const isWrite = isWriteFunction(abiFunction);

  const handleSimulate = useCallback(() => {
    if (!onSimulate || !callData) return;
    executionMutations.simulate({
      abiFunction: abiFunction || undefined,
      callData,
      value,
      msgSender,
      onSimulate,
    });
  }, [abiFunction, callData, value, msgSender, onSimulate, executionMutations]);

  const handleQuery = useCallback(() => {
    if (!onQuery || !callData) return;
    executionMutations.read({
      abiFunction: abiFunction || undefined,
      callData,
      value,
      msgSender,
      onQuery,
    });
  }, [abiFunction, callData, value, msgSender, onQuery, executionMutations]);

  const handleWrite = useCallback(() => {
    if (!callData || !onWrite) return;
    executionMutations.write({
      abiFunction: abiFunction || undefined,
      callData,
      value,
      msgSender,
      onWrite,
    });
  }, [abiFunction, callData, value, msgSender, onWrite, executionMutations]);

  return {
    callData,
    value,
    handleCallDataChange,
    isWrite,
    result: executionMutations.result,
    isLoading: executionMutations.isLoading,
    handleSimulate,
    handleQuery,
    handleWrite,
  };
}
