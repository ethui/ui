import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AbiFunction, Address } from "viem";
import { isAddress } from "viem";
import { z } from "zod";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import type { AddressData } from "../../address-autocomplete-input.js";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn/accordion.js";
import type { ExecutionParams } from "../types.js";
import { useFunctionExecution } from "../use-function-execution.js";
import { DefaultResultDisplay } from "./result-display.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  MsgSenderInput,
} from "./shared-components.js";

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
  onQuery: (params: ExecutionParams) => Promise<`0x${string}`>;
  onWrite: (params: ExecutionParams) => Promise<`0x${string}`>;
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
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
    const { result, isSimulating, isExecuting, simulate, execute } =
      useFunctionExecution();

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

    const handleSimulate = () => {
      simulate({
        abiFunction: func,
        callData,
        msgSender: msgSender ? (msgSender as Address) : undefined,
        onQuery,
        onWrite,
        onSimulate,
      });
    };

    const handleExecute = () => {
      execute({
        abiFunction: func,
        callData,
        msgSender: msgSender ? (msgSender as Address) : undefined,
        onQuery,
        onWrite,
        onSimulate,
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
