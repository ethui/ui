import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn/accordion.js";
import { ExecutionForm } from "../shared/components/execution-form.js";
import type { BaseExecutionProps, ExecutionParams } from "../types.js";

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
  const title = type === "call" ? "Raw Call" : "Raw Transaction";
  const description =
    type === "call"
      ? "Execute eth_call with arbitrary calldata"
      : "Send transaction with arbitrary calldata";

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
        <ExecutionForm
          abiFunction={type === "call" ? "rawCall" : "raw"}
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
          className="mt-4 space-y-4"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
