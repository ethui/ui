import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { Address } from "viem";
import { isAddress } from "viem";
import { z } from "zod";
import { AbiItemFormWithPreview } from "../abi-form/abi-item-form-with-preview.js";
import type { AddressData } from "../address-autocomplete-input.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/accordion.js";
import { Button } from "../shadcn/button.js";
import { DefaultResultDisplay } from "./result-display.js";
import { ConnectWalletAlert, MsgSenderInput } from "./shared-components.js";
import type { RawCallParams } from "./types.js";

type InternalResult = {
  type: "call" | "execution" | "error";
  data?: string;
  hash?: string;
  cleanResult?: string;
  error?: string;
};

const executionFormSchema = z.object({
  msgSender: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return isAddress(val);
      },
      { message: "Invalid address format" },
    )
    .optional(),
});

interface RawOperationsProps {
  address: Address;
  chainId: number;
  sender?: Address;
  addresses?: AddressData[];
  requiresConnection: boolean;
  isConnected: boolean;
  onRawCall?: (params: RawCallParams) => Promise<`0x${string}`>;
  onRawTransaction?: (params: RawCallParams) => Promise<`0x${string}`>;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
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
    <div className="rounded-lg border bg-card">
      <Accordion type="multiple" className="w-full">
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

interface RawOperationItemProps {
  type: "call" | "transaction";
  address: Address;
  chainId: number;
  sender?: Address;
  addresses?: AddressData[];
  requiresConnection: boolean;
  isConnected: boolean;
  onExecute: (params: RawCallParams) => Promise<`0x${string}`>;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
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
  const [result, setResult] = useState<InternalResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(executionFormSchema),
    defaultValues: {
      msgSender: "",
    },
  });

  const msgSender = form.watch().msgSender || "";

  const isWrite = type === "transaction";
  const title = type === "call" ? "Raw Call" : "Raw Transaction";
  const description =
    type === "call"
      ? "Execute eth_call with arbitrary calldata"
      : "Send transaction with arbitrary calldata";

  const handleCallDataChange = useCallback(
    ({ data, value: newValue }: { data?: `0x${string}`; value?: bigint }) => {
      setCallData(data || "");
      setValue(newValue);
    },
    [],
  );

  const handleExecute = async () => {
    if (!callData) return;
    setIsExecuting(true);
    try {
      const result = await onExecute({
        data: callData as `0x${string}`,
        value,
        msgSender: msgSender ? (msgSender as Address) : undefined,
      });

      if (isWrite) {
        setResult({
          type: "execution",
          hash: result,
          cleanResult: "Transaction submitted",
        });
      } else {
        setResult({
          type: "call",
          data: result,
          cleanResult: result,
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsExecuting(false);
    }
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

            {isWrite && requiresConnection && !isConnected && (
              <ConnectWalletAlert />
            )}

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
