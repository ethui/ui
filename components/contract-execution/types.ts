import type { AbiFunction, Address } from "viem";
import type { AddressData } from "../address-autocomplete-input.js";

export type ExecutionResult = {
  type: "call" | "simulation" | "execution" | "error";
  data?: string;
  hash?: string;
  cleanResult?: string;
  error?: string;
};

export interface ExecutionParams {
  abiFunction: AbiFunction;
  callData: `0x${string}`;
  msgSender?: Address;
  value?: bigint;
}

export interface ContractFunctionsListProps {
  /** Full contract ABI (will be filtered internally) */
  abi: AbiFunction[];
  /** Contract address */
  address: Address;
  /** Chain ID */
  chainId: number;
  /** Sender address (for simulations/calls) */
  sender?: Address;
  /** List of addresses for autocomplete */
  addresses?: AddressData[];
  /** Whether wallet connection is required for write functions */
  requiresConnection?: boolean;
  /** Whether user is connected (for write functions) */
  isConnected?: boolean;
  /** Execute function (write operations and view function calls) */
  onExecute: (params: ExecutionParams) => Promise<ExecutionResult>;
  /** Optional simulate function (for write functions) */
  onSimulate?: (params: ExecutionParams) => Promise<ExecutionResult>;
  /** Custom result renderer (overrides default) */
  resultRenderer?: (result: ExecutionResult) => React.ReactNode;
  /** Custom address renderer for form inputs */
  addressRenderer?: (address: Address) => React.ReactNode;
}
