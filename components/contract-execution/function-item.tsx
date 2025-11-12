import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AbiFunction, Address } from "viem";
import { decodeFunctionResult, isAddress } from "viem";
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
import type { ExecutionParams } from "./types.js";

type InternalResult = {
  type: "call" | "simulation" | "execution" | "error";
  data?: string;
  hash?: string;
  cleanResult?: string;
  error?: string;
};

function formatDecodedResult(result: unknown): string {
  if (typeof result === "bigint") {
    return result.toString();
  }
  if (Array.isArray(result)) {
    return JSON.stringify(
      result,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
  }
  if (typeof result === "object" && result !== null) {
    return JSON.stringify(
      result,
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
  }
  return String(result);
}

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
    const [result, setResult] = useState<InternalResult | null>(null);
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
        const rawResult = await onSimulate({
          abiFunction: func,
          callData: callData as `0x${string}`,
          msgSender: msgSender ? (msgSender as Address) : undefined,
        });

        if (isWrite) {
          setResult({
            type: "simulation",
            cleanResult: "Simulation successful",
            data: rawResult,
          });
        } else {
          try {
            const decoded = decodeFunctionResult({
              abi: [func],
              functionName: func.name,
              data: rawResult,
            });

            setResult({
              type: "simulation",
              cleanResult: formatDecodedResult(decoded),
              data: rawResult,
            });
          } catch {
            setResult({
              type: "simulation",
              data: rawResult,
            });
          }
        }
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
        if (isWrite) {
          // Call write function - returns transaction hash
          const hash = await onWrite({
            abiFunction: func,
            callData: callData as `0x${string}`,
            msgSender: msgSender ? (msgSender as Address) : undefined,
          });

          setResult({
            type: "execution",
            hash,
            cleanResult: "Transaction submitted",
          });
        } else {
          // Call query function - returns raw hex
          const rawResult = await onQuery({
            abiFunction: func,
            callData: callData as `0x${string}`,
            msgSender: msgSender ? (msgSender as Address) : undefined,
          });

          try {
            const decoded = decodeFunctionResult({
              abi: [func],
              functionName: func.name,
              data: rawResult,
            });

            setResult({
              type: "call",
              cleanResult: formatDecodedResult(decoded),
              data: rawResult,
            });
          } catch {
            setResult({
              type: "call",
              data: rawResult,
            });
          }
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
