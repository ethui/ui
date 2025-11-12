import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AbiFunction } from "viem";
import { cn } from "../../../lib/utils.js";
import { Accordion } from "../../shadcn/accordion.js";
import { Input } from "../../shadcn/input.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs.js";
import type { ContractFunctionsListProps } from "../types.js";
import { FunctionItem } from "./function-item.js";
import { RawOperations } from "./raw-operations.js";
import { SignatureOperations } from "./signature-operations.js";

export function ContractFunctionsList({
  abi,
  address,
  chainId,
  sender,
  addresses,
  requiresConnection = true,
  isConnected = false,
  onQuery,
  onWrite,
  onSimulate,
  onRawCall,
  onRawTransaction,
  enableSignature,
  addressRenderer,
  onHashClick,
  title,
  NoAbiComponent,
}: ContractFunctionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const contractFunctions = useMemo(() => {
    if (!abi || !Array.isArray(abi)) return [];
    return abi.filter((item) => item.type === "function") as AbiFunction[];
  }, [abi]);

  const { readFunctions, writeFunctions } = useMemo(() => {
    const filtered = contractFunctions.filter((func) =>
      func.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return {
      readFunctions: filtered.filter(
        (func) =>
          func.stateMutability === "view" || func.stateMutability === "pure",
      ),
      writeFunctions: filtered.filter(
        (func) =>
          func.stateMutability !== "view" && func.stateMutability !== "pure",
      ),
    };
  }, [contractFunctions, searchTerm]);

  const hasRawOperations = onRawCall || onRawTransaction;
  const hasSignature = !!enableSignature;
  const tabCount = 2 + (hasRawOperations ? 1 : 0) + (hasSignature ? 1 : 0);

  return (
    <div className="pb-7">
      <div className="mb-4">
        {title && (
          <span className="mb-3 block font-bold text-base">{title}</span>
        )}

        <div className="relative mb-4">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            placeholder="Search functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="read" className="w-full">
          <TabsList
            className={cn(
              "grid w-full",
              tabCount === 2 && "grid-cols-2",
              tabCount === 3 && "grid-cols-3",
              tabCount === 4 && "grid-cols-4",
            )}
          >
            <TabsTrigger
              value="read"
              className="flex cursor-pointer items-center gap-2"
            >
              Read Contract
              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                {readFunctions.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="write"
              className="flex cursor-pointer items-center gap-2"
            >
              Write Contract
              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                {writeFunctions.length}
              </span>
            </TabsTrigger>
            {hasRawOperations && (
              <TabsTrigger
                value="raw"
                className="flex cursor-pointer items-center gap-2"
              >
                Raw
              </TabsTrigger>
            )}
            {hasSignature && (
              <TabsTrigger
                value="signature"
                className="flex cursor-pointer items-center gap-2"
              >
                Signature
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            forceMount
            value="read"
            className="mt-4 data-[state=inactive]:hidden"
          >
            <div className="rounded-lg bg-card">
              {readFunctions.length > 0 ? (
                <Accordion type="multiple" className="w-full rounded-lg border">
                  {readFunctions.map((func, index) => (
                    <FunctionItem
                      key={`read-${func.name}-${index}`}
                      func={func}
                      index={index}
                      address={address}
                      chainId={chainId}
                      sender={sender}
                      addresses={addresses}
                      requiresConnection={requiresConnection}
                      isConnected={isConnected}
                      onQuery={onQuery}
                      onWrite={onWrite}
                      onSimulate={onSimulate}
                      addressRenderer={addressRenderer}
                      onHashClick={onHashClick}
                    />
                  ))}
                </Accordion>
              ) : NoAbiComponent &&
                !searchTerm &&
                contractFunctions.length === 0 ? (
                <NoAbiComponent />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  {searchTerm
                    ? "No read functions found matching your search."
                    : "No read functions available."}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            forceMount
            value="write"
            className="mt-4 data-[state=inactive]:hidden"
          >
            <div className="rounded-lg bg-card">
              {writeFunctions.length > 0 ? (
                <Accordion type="multiple" className="w-full rounded-lg border">
                  {writeFunctions.map((func, index) => (
                    <FunctionItem
                      key={`write-${func.name}-${index}`}
                      func={func}
                      index={index}
                      address={address}
                      chainId={chainId}
                      sender={sender}
                      addresses={addresses}
                      requiresConnection={requiresConnection}
                      isConnected={isConnected}
                      onQuery={onQuery}
                      onWrite={onWrite}
                      onSimulate={onSimulate}
                      addressRenderer={addressRenderer}
                      onHashClick={onHashClick}
                    />
                  ))}
                </Accordion>
              ) : NoAbiComponent &&
                !searchTerm &&
                contractFunctions.length === 0 ? (
                <NoAbiComponent />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  {searchTerm
                    ? "No write functions found matching your search."
                    : "No write functions available."}
                </div>
              )}
            </div>
          </TabsContent>

          {hasRawOperations && (
            <TabsContent
              forceMount
              value="raw"
              className="mt-4 data-[state=inactive]:hidden"
            >
              <RawOperations
                address={address}
                chainId={chainId}
                sender={sender}
                addresses={addresses}
                requiresConnection={requiresConnection}
                isConnected={isConnected}
                onRawCall={onRawCall}
                onRawTransaction={onRawTransaction}
                addressRenderer={addressRenderer}
                onHashClick={onHashClick}
              />
            </TabsContent>
          )}

          {hasSignature && (
            <TabsContent
              forceMount
              value="signature"
              className="mt-4 data-[state=inactive]:hidden"
            >
              <SignatureOperations
                address={address}
                chainId={chainId}
                sender={sender}
                addresses={addresses}
                requiresConnection={requiresConnection}
                isConnected={isConnected}
                onQuery={onQuery}
                onWrite={onWrite}
                onSimulate={onSimulate}
                addressRenderer={addressRenderer}
                onHashClick={onHashClick}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
