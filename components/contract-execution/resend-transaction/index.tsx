import { useMemo } from "react";
import { FormProvider } from "react-hook-form";
import type { Abi, AbiFunction, Address, Hex } from "viem";
import { decodeFunctionData } from "viem";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import type { ExecutionParams, RawCallParams } from "../shared/types.js";
import { useFunctionExecution } from "../shared/use-function-execution.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  MsgSenderInput,
} from "../shared/components.js";
import { useMsgSenderForm } from "../shared/form-utils.js";
import { useRawExecution } from "../shared/use-raw-execution.js";
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
  onQuery: (params: ExecutionParams) => Promise<Hex>;
  onWrite: (params: ExecutionParams) => Promise<Hex>;
  onSimulate?: (params: ExecutionParams) => Promise<Hex>;
  onRawTransaction?: (params: RawCallParams) => Promise<Hex>;
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
  onQuery,
  onWrite,
  onSimulate,
  onRawTransaction,
  addressRenderer,
  onHashClick,
}: ResendTransactionProps) {
  const { form, msgSender } = useMsgSenderForm(sender);

  const decodedFunction = useMemo(() => {
    if (!abi || input === "0x") return null;

    try {
      const decoded = decodeFunctionData({ abi, data: input });
      const abiFunction = abi.find(
        (item) =>
          item.type === "function" && item.name === decoded.functionName,
      ) as AbiFunction | undefined;

      return abiFunction || null;
    } catch {
      return null;
    }
  }, [abi, input]);

  const isWrite = isWriteFunction(decodedFunction);

  const functionExecution = useFunctionExecution();
  const rawExecution = useRawExecution({
    isWrite: true,
    onExecute: onRawTransaction || (async () => "0x" as Hex),
  });

  const handleSimulate = () => {
    if (decodedFunction && onSimulate) {
      functionExecution.simulate({
        abiFunction: decodedFunction,
        callData: input,
        msgSender,
        onQuery,
        onWrite,
        onSimulate,
      });
    }
  };

  const handleExecute = () => {
    if (decodedFunction) {
      functionExecution.execute({
        abiFunction: decodedFunction,
        callData: input,
        msgSender,
        onQuery,
        onWrite,
      });
    } else {
      rawExecution.execute({
        callData: input,
        value,
        msgSender,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <MsgSenderInput />

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

        <ActionButtons
          isWrite={isWrite}
          callData={input}
          isSimulating={functionExecution.isSimulating}
          isExecuting={
            functionExecution.isExecuting || rawExecution.isExecuting
          }
          isConnected={isConnected}
          hasSimulate={!!onSimulate && !!decodedFunction}
          simulate={handleSimulate}
          execute={handleExecute}
        />

        {decodedFunction && functionExecution.result && (
          <DefaultResultDisplay
            result={functionExecution.result}
            onHashClick={onHashClick}
          />
        )}

        {!decodedFunction && rawExecution.result && (
          <DefaultResultDisplay
            result={rawExecution.result}
            onHashClick={onHashClick}
          />
        )}
      </div>
    </FormProvider>
  );
}
