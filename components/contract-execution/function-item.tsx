import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AbiFunction, Address } from "viem";
import { isAddress } from "viem";
import { z } from "zod";
import { AbiItemFormWithPreview } from "../abi-form/abi-item-form-with-preview.js";
import type { AddressData } from "../address-autocomplete-input.js";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/accordion.js";
import { DefaultResultDisplay } from "./result-display.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  MsgSenderInput,
} from "./shared-components.js";
import type { ExecutionParams, ExecutionResult } from "./types.js";

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

interface FunctionItemProps {
  func: AbiFunction;
  index: number;
  address: Address;
  chainId: number;
  sender?: Address;
  addresses?: AddressData[];
  requiresConnection: boolean;
  isConnected: boolean;
  onExecute: (params: ExecutionParams) => Promise<ExecutionResult>;
  onSimulate?: (params: ExecutionParams) => Promise<ExecutionResult>;
  resultRenderer?: (result: ExecutionResult) => React.ReactNode;
  addressRenderer?: (address: Address) => React.ReactNode;
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
    onExecute,
    onSimulate,
    resultRenderer,
    addressRenderer,
  }: FunctionItemProps) => {
    const [callData, setCallData] = useState<string>("");
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    const form = useForm({
      mode: "onChange",
      resolver: zodResolver(executionFormSchema),
      defaultValues: {
        msgSender: "",
      },
    });

    const msgSender = form.watch().msgSender || "";

    const isWrite =
      func.stateMutability !== "view" && func.stateMutability !== "pure";

    const handleCallDataChange = useCallback(
      (newCallData: string | undefined) => {
        setCallData(newCallData || "");
      },
      [],
    );

    const handleSimulate = async () => {
      if (!callData || !onSimulate) return;
      setIsSimulating(true);
      try {
        const result = await onSimulate({
          abiFunction: func,
          callData: callData as `0x${string}`,
          msgSender: msgSender ? (msgSender as Address) : undefined,
        });
        setResult(result);
      } catch (error) {
        setResult({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsSimulating(false);
      }
    };

    const handleExecute = async () => {
      if (!callData) return;
      setIsExecuting(true);
      try {
        const result = await onExecute({
          abiFunction: func,
          callData: callData as `0x${string}`,
          msgSender: msgSender ? (msgSender as Address) : undefined,
        });
        setResult(result);
      } catch (error) {
        setResult({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsExecuting(false);
      }
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
            <div className="mt-4 space-y-6">
              {isWrite && <MsgSenderInput />}

              {isWrite && requiresConnection && !isConnected && (
                <ConnectWalletAlert />
              )}

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

              <ActionButtons
                isWrite={isWrite}
                callData={callData}
                isSimulating={isSimulating}
                isExecuting={isExecuting}
                isConnected={isConnected}
                hasSimulate={!!onSimulate}
                simulate={handleSimulate}
                execute={handleExecute}
              />

              {result &&
                (resultRenderer ? (
                  resultRenderer(result)
                ) : (
                  <DefaultResultDisplay
                    key={`${result.type}-${result.data}`}
                    result={result}
                  />
                ))}
            </div>
          </FormProvider>
        </AccordionContent>
      </AccordionItem>
    );
  },
);

FunctionItem.displayName = "FunctionItem";
