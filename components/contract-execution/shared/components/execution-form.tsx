import React from "react";
import { FormProvider } from "react-hook-form";
import type { AbiFunction, Address } from "viem";
import { AbiItemFormWithPreview } from "../../../abi-form/abi-item-form-with-preview.js";
import type { AddressData } from "../../../address-autocomplete-input.js";
import type { ExecutionParams } from "../../types.js";
import { useExecutionState } from "../hooks/use-execution-state.js";
import { useMsgSenderForm } from "../utils/form-utils.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  OptionalInputs,
} from "./components.js";

interface ExecutionFormProps {
  abiFunction?: AbiFunction | "raw" | "rawCall" | "signature" | null;
  signature?: string;
  parsedAbiFunction?: AbiFunction | null;
  address: Address;
  chainId: number;
  sender?: Address;
  addresses?: AddressData[];
  requiresConnection: boolean;
  isConnected: boolean;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
  defaultCalldata?: `0x${string}`;
  defaultEther?: bigint;
  executionParams: {
    onQuery?: (params: ExecutionParams) => Promise<`0x${string}`>;
    onWrite?: (params: ExecutionParams) => Promise<`0x${string}`>;
    onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
  };
  className?: string;
}

export function ExecutionForm({
  abiFunction,
  signature,
  parsedAbiFunction,
  address,
  chainId,
  sender,
  addresses,
  requiresConnection,
  isConnected,
  addressRenderer,
  onHashClick,
  defaultCalldata,
  defaultEther,
  executionParams,
  className,
}: ExecutionFormProps) {
  const { form, msgSender } = useMsgSenderForm(sender);

  const executionAbiFunction =
    parsedAbiFunction ??
    (abiFunction && typeof abiFunction === "object" ? abiFunction : undefined);

  const execution = useExecutionState({
    abiFunction: executionAbiFunction,
    defaultCallData: defaultCalldata,
    defaultValue: defaultEther,
    msgSender,
    ...executionParams,
  });

  const finalIsWrite =
    abiFunction === "raw"
      ? true
      : abiFunction === "rawCall"
        ? false
        : execution.isWrite;

  return (
    <FormProvider {...form}>
      <div className={className}>
        <AbiItemFormWithPreview
          addresses={addresses}
          onChange={execution.handleCallDataChange}
          abiFunction={abiFunction ?? "raw"}
          signature={signature}
          address={address}
          sender={msgSender}
          chainId={chainId}
          defaultCalldata={defaultCalldata}
          defaultEther={defaultEther}
          ArgProps={addressRenderer ? { addressRenderer } : undefined}
        />

        {finalIsWrite && requiresConnection && !isConnected && (
          <ConnectWalletAlert />
        )}

        <OptionalInputs />

        <ActionButtons
          isWrite={finalIsWrite}
          callData={execution.callData}
          isLoading={execution.isLoading}
          isConnected={isConnected}
          simulate={
            executionParams.onSimulate ? execution.handleSimulate : undefined
          }
          query={executionParams.onQuery ? execution.handleQuery : undefined}
          write={executionParams.onWrite ? execution.handleWrite : undefined}
        />

        {execution.result && (
          <DefaultResultDisplay
            result={execution.result}
            onHashClick={onHashClick}
          />
        )}
      </div>
    </FormProvider>
  );
}
