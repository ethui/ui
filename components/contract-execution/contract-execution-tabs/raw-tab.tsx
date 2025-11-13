import { useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";
import type { Hex } from "viem";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn/accordion.js";
import { Button } from "../../shadcn/button.js";
import {
  ConnectWalletAlert,
  DefaultResultDisplay,
  MsgSenderInput,
} from "../shared/components.js";
import { useMsgSenderForm } from "../shared/form-utils.js";
import type { BaseExecutionProps, RawCallParams } from "../shared/types.js";
import { useRawExecution } from "../shared/use-raw-execution.js";

interface RawOperationsProps extends BaseExecutionProps {
  onRawCall?: (params: RawCallParams) => Promise<`0x${string}`>;
  onRawTransaction?: (params: RawCallParams) => Promise<`0x${string}`>;
}

export function RawOperations({
  address,
  chainId,
  sender,
  addresses,
  requiresConnection,
  isConnected,
  onRawCall,
  onRawTransaction,
  addressRenderer,
  onHashClick,
}: RawOperationsProps) {
  return (
    <div className="rounded-lg bg-card">
      <Accordion type="multiple" className="w-full rounded-lg border">
        {onRawCall && (
          <RawOperationItem
            type="call"
            address={address}
            chainId={chainId}
            sender={sender}
            addresses={addresses}
            requiresConnection={requiresConnection}
            isConnected={isConnected}
            onExecute={onRawCall}
            addressRenderer={addressRenderer}
            onHashClick={onHashClick}
          />
        )}
        {onRawTransaction && (
          <RawOperationItem
            type="transaction"
            address={address}
            chainId={chainId}
            sender={sender}
            addresses={addresses}
            requiresConnection={requiresConnection}
            isConnected={isConnected}
            onExecute={onRawTransaction}
            addressRenderer={addressRenderer}
            onHashClick={onHashClick}
          />
        )}
      </Accordion>
    </div>
  );
}

interface RawOperationItemProps extends BaseExecutionProps {
  type: "call" | "transaction";
  onExecute: (params: RawCallParams) => Promise<`0x${string}`>;
}

function RawOperationItem({
  type,
  address,
  chainId,
  sender,
  addresses,
  requiresConnection,
  isConnected,
  onExecute,
  addressRenderer,
  onHashClick,
}: RawOperationItemProps) {
  const [callData, setCallData] = useState<string>("");
  const [value, setValue] = useState<bigint | undefined>();
  const { form, msgSender } = useMsgSenderForm(sender);

  const isWrite = type === "transaction";
  const {
    result,
    isExecuting,
    execute: executeRaw,
  } = useRawExecution({
    isWrite,
    onExecute,
  });
  const title = type === "call" ? "Raw Call" : "Raw Transaction";
  const description =
    type === "call"
      ? "Execute eth_call with arbitrary calldata"
      : "Send transaction with arbitrary calldata";

  const handleCallDataChange = useCallback(
    ({ data, value: newValue }: { data?: Hex; value?: bigint }) => {
      setCallData(data || "");
      setValue(newValue);
    },
    [],
  );

  const handleExecute = () => {
    executeRaw({ callData, value, msgSender });
  };

  return (
    <AccordionItem
      value={type}
      className="border-border border-b last:border-b-0"
    >
      <AccordionTrigger className="cursor-pointer p-3 text-left hover:no-underline">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <FormProvider {...form}>
          <div className="mt-4 space-y-6">
            {isWrite && <MsgSenderInput />}

            <AbiItemFormWithPreview
              addresses={addresses}
              onChange={handleCallDataChange}
              abiFunction={type === "call" ? "rawCall" : "raw"}
              address={address}
              sender={sender || address}
              chainId={chainId}
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

            <div className="flex flex-row items-center justify-center gap-2">
              <Button
                onClick={handleExecute}
                disabled={!callData || isExecuting || (isWrite && !isConnected)}
                className="w-fit"
              >
                {isExecuting
                  ? "Executing..."
                  : type === "call"
                    ? "Call"
                    : "Send Transaction"}
              </Button>
            </div>

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
}
