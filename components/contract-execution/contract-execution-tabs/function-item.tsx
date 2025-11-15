import { memo, useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";
import type { AbiFunction } from "viem";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn/accordion.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  OptionalInputs,
} from "../shared/components.js";
import { useMsgSenderForm } from "../shared/form-utils.js";
import type { BaseExecutionProps, ExecutionParams } from "../shared/types.js";
import { useFunctionExecution } from "../shared/use-function-execution.js";
import { isWriteFunction } from "../shared/utils.js";

interface FunctionItemProps extends BaseExecutionProps {
  func: AbiFunction;
  index: number;
  onQuery: (params: ExecutionParams) => Promise<`0x${string}`>;
  onWrite: (params: ExecutionParams) => Promise<`0x${string}`>;
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
}

export const FunctionItem = memo(
  ({
    func,
    index,
    address,
    chainId,
    sender,
    addresses,
    requiresConnection,
    isConnected,
    onQuery,
    onWrite,
    onSimulate,
    addressRenderer,
    onHashClick,
  }: FunctionItemProps) => {
    const [callData, setCallData] = useState<string>("");
    const { result, isLoading, read, simulate, write } = useFunctionExecution();
    const { form, msgSender } = useMsgSenderForm(sender);

    const isWrite = isWriteFunction(func);

    const handleCallDataChange = useCallback(
      (newCallData: string | undefined) => {
        setCallData(newCallData || "");
      },
      [],
    );

    const handleSimulate = () => {
      if (!onSimulate || !callData) return;
      simulate({
        abiFunction: func,
        callData: callData as `0x${string}`,
        msgSender,
        onSimulate,
      });
    };

    const handleQuery = () => {
      if (!callData) return;
      read({
        abiFunction: func,
        callData: callData as `0x${string}`,
        msgSender,
        onQuery,
      });
    };

    const handleWrite = () => {
      if (!callData) return;
      write({
        abiFunction: func,
        callData: callData as `0x${string}`,
        msgSender,
        onWrite,
      });
    };

    const functionKey = `${func.name}-${index}`;

    return (
      <AccordionItem
        value={functionKey}
        className="border-border border-b last:border-b-0"
      >
        <AccordionTrigger className="cursor-pointer p-3 text-left hover:no-underline">
          <span className="font-medium text-sm">
            {index + 1}. {func.name}
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <FormProvider {...form}>
            <div className="space-y-4">
              <AbiItemFormWithPreview
                addresses={addresses}
                key={func.name}
                onChange={(data) => {
                  const callData = data.data?.toString() ?? undefined;
                  handleCallDataChange(callData);
                }}
                abiFunction={func}
                address={address}
                sender={sender || address}
                chainId={chainId}
                defaultCalldata={callData as `0x${string}` | undefined}
                ArgProps={
                  addressRenderer
                    ? {
                        addressRenderer,
                      }
                    : undefined
                }
              />

              {isWrite && requiresConnection && !isConnected && (
                <ConnectWalletAlert />
              )}

              <OptionalInputs />

              <ActionButtons
                isWrite={isWrite}
                callData={callData}
                isLoading={isLoading}
                isConnected={isConnected}
                simulate={handleSimulate}
                query={handleQuery}
                write={handleWrite}
              />

              {result && (
                <DefaultResultDisplay
                  key={`${result.type}-${result.data}`}
                  result={result}
                  onHashClick={onHashClick}
                />
              )}
            </div>
          </FormProvider>
        </AccordionContent>
      </AccordionItem>
    );
  },
);

FunctionItem.displayName = "FunctionItem";
