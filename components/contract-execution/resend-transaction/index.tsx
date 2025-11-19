import { useMemo } from "react";
import type { Abi, AbiFunction, Address, Hex } from "viem";
import { decodeFunctionData } from "viem";
import { ExecutionForm } from "../shared/components/execution-form.js";
import type { ExecutionParams } from "../types.js";

export interface ResendTransactionProps {
  to: Address;
  input: Hex;
  value?: bigint;
  abi?: Abi;
  chainId: number;
  sender?: Address;
  addresses?: any[];
  requiresConnection?: boolean;
  isConnected?: boolean;
  onWrite: (params: ExecutionParams) => Promise<Hex>;
  onSimulate?: (params: ExecutionParams) => Promise<Hex>;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
}

export function ResendTransaction({
  to,
  input,
  value,
  abi,
  chainId,
  sender,
  addresses,
  requiresConnection = true,
  isConnected = false,
  onWrite,
  onSimulate,
  addressRenderer,
  onHashClick,
}: ResendTransactionProps) {
  const decodedFunction = useMemo(() => {
    if (!abi || input === "0x") return undefined;

    try {
      const decoded = decodeFunctionData({ abi, data: input });
      const abiFunction = abi.find(
        (item) =>
          item.type === "function" && item.name === decoded.functionName,
      ) as AbiFunction | undefined;

      return abiFunction;
    } catch {
      return undefined;
    }
  }, [abi, input]);

  return (
    <ExecutionForm
      abiFunction={decodedFunction || "raw"}
      address={to}
      chainId={chainId}
      sender={sender}
      addresses={addresses}
      requiresConnection={requiresConnection}
      isConnected={isConnected}
      addressRenderer={addressRenderer}
      onHashClick={onHashClick}
      defaultCalldata={input}
      defaultEther={value}
      executionParams={{
        onWrite,
        onSimulate,
      }}
      className="space-y-4"
    />
  );
}
