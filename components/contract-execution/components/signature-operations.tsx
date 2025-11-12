import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AbiFunction, Address } from "viem";
import { isAddress, parseAbiItem } from "viem";
import { z } from "zod";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import type { AddressData } from "../../address-autocomplete-input.js";
import { Input } from "../../shadcn/input.js";
import { Label } from "../../shadcn/label.js";
import type { ExecutionParams } from "../types.js";
import { useFunctionExecution } from "../use-function-execution.js";
import { DefaultResultDisplay } from "./result-display.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  MsgSenderInput,
} from "./shared-components.js";

const signatureFormSchema = z.object({
  signature: z.string().refine(
    (val) => {
      if (!val) return false;
      try {
        parseAbiItem(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid function signature" },
  ),
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

interface SignatureOperationsProps {
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

export function SignatureOperations({
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
}: SignatureOperationsProps) {
  const [callData, setCallData] = useState<string>("");
  const { result, isSimulating, isExecuting, simulate, execute } =
    useFunctionExecution();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signatureFormSchema),
    defaultValues: {
      signature: "",
      msgSender: "",
    },
  });

  const signature = form.watch("signature");
  const msgSender = form.watch("msgSender") || "";

  const isValidSignature =
    form.getFieldState("signature").invalid === false && signature.length > 0;

  const parsedAbiFunction = useMemo<AbiFunction | null>(() => {
    if (!isValidSignature || !signature) return null;
    try {
      return parseAbiItem(signature) as AbiFunction;
    } catch {
      return null;
    }
  }, [isValidSignature, signature]);

  const isWrite =
    parsedAbiFunction?.stateMutability !== "view" &&
    parsedAbiFunction?.stateMutability !== "pure";

  const handleCallDataChange = useCallback(
    ({ data }: { data?: `0x${string}`; value?: bigint }) => {
      setCallData(data || "");
    },
    [],
  );

  const handleSimulate = () => {
    if (!parsedAbiFunction) return;
    simulate({
      abiFunction: parsedAbiFunction,
      callData,
      msgSender: msgSender ? (msgSender as Address) : undefined,
      onQuery,
      onWrite,
      onSimulate,
    });
  };

  const handleExecute = () => {
    if (!parsedAbiFunction) return;
    execute({
      abiFunction: parsedAbiFunction,
      callData,
      msgSender: msgSender ? (msgSender as Address) : undefined,
      onQuery,
      onWrite,
      onSimulate,
    });
  };

  return (
    <div className="rounded-lg bg-card p-4">
      <FormProvider {...form}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="signature" className="font-semibold text-base">
              Function Signature
            </Label>
            <Input
              placeholder="function transfer(address to, uint256 amount) returns (bool)"
              {...form.register("signature")}
              className="font-mono"
            />
            {form.formState.errors.signature && (
              <p className="text-destructive text-sm">
                {form.formState.errors.signature.message}
              </p>
            )}
          </div>

          {isValidSignature && parsedAbiFunction && (
            <>
              {isWrite && <MsgSenderInput />}

              {isWrite && requiresConnection && !isConnected && (
                <ConnectWalletAlert />
              )}

              <AbiItemFormWithPreview
                addresses={addresses}
                onChange={handleCallDataChange}
                abiFunction="signature"
                signature={signature}
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
            </>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
