import { memo } from "react";
import type { AbiFunction } from "viem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn/accordion.js";
import { ExecutionForm } from "../shared/components/execution-form.js";
import type { BaseExecutionProps, ExecutionParams } from "../types.js";

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
          <ExecutionForm
            abiFunction={func}
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
        </AccordionContent>
      </AccordionItem>
    );
  },
);

FunctionItem.displayName = "FunctionItem";
