import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { AbiFunction, Address, Hex } from "viem";
import { parseAbiItem } from "viem";
import { z } from "zod";
import { AbiItemFormWithPreview } from "../../abi-form/abi-item-form-with-preview.js";
import { Input } from "../../shadcn/input.js";
import { Label } from "../../shadcn/label.js";
import {
  ActionButtons,
  ConnectWalletAlert,
  DefaultResultDisplay,
  MsgSenderInput,
} from "../shared/components.js";
import { msgSenderSchema } from "../shared/form-utils.js";
import type { BaseExecutionProps, ExecutionParams } from "../shared/types.js";
import { useFunctionExecution } from "../shared/use-function-execution.js";
import { isWriteFunction } from "../shared/utils.js";

const signatureFormSchema = z
  .object({
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
  })
  .merge(msgSenderSchema);

interface SignatureOperationsProps extends BaseExecutionProps {
  onQuery: (params: ExecutionParams) => Promise<Hex>;
  onWrite: (params: ExecutionParams) => Promise<Hex>;
  onSimulate?: (params: ExecutionParams) => Promise<Hex>;
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
  const [callData, setCallData] = useState("");
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
  const msgSenderValue = form.watch("msgSender");
  const msgSender: Address | undefined = msgSenderValue
    ? (msgSenderValue as Address)
    : undefined;

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

  const isWrite = isWriteFunction(parsedAbiFunction);

  const handleCallDataChange = useCallback(
    ({ data }: { data?: Hex; value?: bigint }) => {
      setCallData(data || "");
    },
    [],
  );

  const handleSimulate = () => {
    if (!parsedAbiFunction || !callData) return;
    simulate({
      abiFunction: parsedAbiFunction,
      callData,
      msgSender,
      onQuery,
      onWrite,
      onSimulate,
    });
  };

  const handleExecute = () => {
    if (!parsedAbiFunction || !callData) return;
    execute({
      abiFunction: parsedAbiFunction,
      callData,
      msgSender,
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

              {isWrite && requiresConnection && !isConnected && (
                <ConnectWalletAlert />
              )}

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
