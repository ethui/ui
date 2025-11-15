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
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  OptionalInputs,
} from "../shared/components.js";
import { useMsgSenderForm } from "../shared/form-utils.js";
import type { BaseExecutionProps, ExecutionParams } from "../shared/types.js";
import { useFunctionExecution } from "../shared/use-function-execution.js";

interface RawOperationsProps extends BaseExecutionProps {
  onQuery: (params: ExecutionParams) => Promise<`0x${string}`>;
  onWrite: (params: ExecutionParams) => Promise<`0x${string}`>;
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
}

export function RawOperations({
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
}: RawOperationsProps) {
  return (
    <div className="rounded-lg bg-card">
      <Accordion type="multiple" className="w-full rounded-lg border">
        <RawOperationItem
          type="call"
          address={address}
          chainId={chainId}
          sender={sender}
          addresses={addresses}
          requiresConnection={requiresConnection}
          isConnected={isConnected}
          onQuery={onQuery}
          addressRenderer={addressRenderer}
          onHashClick={onHashClick}
        />
        <RawOperationItem
          type="transaction"
          address={address}
          chainId={chainId}
          sender={sender}
          addresses={addresses}
          requiresConnection={requiresConnection}
          isConnected={isConnected}
          onWrite={onWrite}
          onSimulate={onSimulate}
          addressRenderer={addressRenderer}
          onHashClick={onHashClick}
        />
      </Accordion>
    </div>
  );
}

interface RawOperationItemProps extends BaseExecutionProps {
  type: "call" | "transaction";
  onQuery?: (params: ExecutionParams) => Promise<`0x${string}`>;
  onWrite?: (params: ExecutionParams) => Promise<`0x${string}`>;
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
}

function RawOperationItem({
  type,
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
}: RawOperationItemProps) {
  const [callData, setCallData] = useState<string>("");
  const [value, setValue] = useState<bigint | undefined>();
  const { form, msgSender } = useMsgSenderForm(sender);

  const isWrite = type === "transaction";
  const { result, isLoading, read, simulate, write } = useFunctionExecution();
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

  const handleSimulate = () => {
    if (!callData || !onSimulate) return;
    simulate({
      abiFunction: undefined,
      callData: callData as Hex,
      value,
      msgSender,
      onSimulate,
    });
  };

  const handleQuery = () => {
    if (!callData || !onQuery) return;
    read({
      abiFunction: undefined,
      callData: callData as Hex,
      value,
      msgSender,
      onQuery,
    });
  };

  const handleWrite = () => {
    if (!callData || !onWrite) return;
    write({
      abiFunction: undefined,
      callData: callData as Hex,
      value,
      msgSender,
      onWrite,
    });
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
          <div className="mt-4 space-y-4">
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
}
