import { useMemo } from "react";
import { FormProvider } from "react-hook-form";
import type { Abi, AbiFunction, Address, Hex } from "viem";
import { decodeFunctionData } from "viem";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  OptionalInputs,
} from "../shared/components.js";
import { useMsgSenderForm } from "../shared/form-utils.js";
import type { ExecutionParams } from "../shared/types.js";
import { useFunctionExecution } from "../shared/use-function-execution.js";
import { isWriteFunction } from "../shared/utils.js";

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
  const { form, msgSender } = useMsgSenderForm(sender);

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

  const isWrite = isWriteFunction(decodedFunction);

  const functionExecution = useFunctionExecution();

  const handleSimulate = () => {
    if (onSimulate)
      functionExecution.simulate({
        abiFunction: decodedFunction,
        callData: input,
        msgSender,
        onSimulate,
      });
  };

  const handleWrite = () => {
    functionExecution.write({
      abiFunction: decodedFunction,
      callData: input,
      value,
      msgSender,
      onWrite,
    });
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <AbiItemFormWithPreview
          abiFunction={decodedFunction || "raw"}
          address={to}
          sender={msgSender || sender}
          chainId={chainId}
          addresses={addresses}
          defaultCalldata={input}
          defaultEther={value}
          ArgProps={{
            addressRenderer,
          }}
        />

        {requiresConnection && !isConnected && <ConnectWalletAlert />}

        <OptionalInputs />

        <ActionButtons
          isWrite={isWrite}
          callData={input}
          isLoading={functionExecution.isLoading}
          isConnected={isConnected}
          simulate={handleSimulate}
          write={handleWrite}
        />

        {functionExecution.result && (
          <DefaultResultDisplay
            result={functionExecution.result}
            onHashClick={onHashClick}
          />
        )}
      </div>
    </FormProvider>
  );
}
