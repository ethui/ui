import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { AbiFunction, Hex } from "viem";
import { parseAbiItem } from "viem";
import { z } from "zod";
import { Input } from "../../shadcn/input.js";
import { Label } from "../../shadcn/label.js";
import { ExecutionForm } from "../shared/components/execution-form.js";
import type { BaseExecutionProps, ExecutionParams } from "../types.js";

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
});

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
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signatureFormSchema),
    defaultValues: {
      signature: "",
    },
  });

  const signature = form.watch("signature");
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

  return (
    <div className="rounded-lg bg-card py-4">
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
          <ExecutionForm
            abiFunction="signature"
            signature={signature}
            parsedAbiFunction={parsedAbiFunction}
            address={address}
            chainId={chainId}
            sender={sender}
            addresses={addresses}
            requiresConnection={requiresConnection}
            isConnected={isConnected}
            addressRenderer={addressRenderer}
            onHashClick={onHashClick}
            executionParams={{
              onQuery,
              onWrite,
              onSimulate,
            }}
            className="space-y-4"
          />
        )}
      </div>
    </div>
  );
}
