import type { AbiFunction, Address } from "viem";
import type { AddressData } from "../address-autocomplete-input.js";

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
  /** Execute function - returns raw hex result from rpc_eth_call or transaction hash */
  onExecute: (params: ExecutionParams) => Promise<`0x${string}`>;
  /** Optional simulate function - returns raw hex result from simulation */
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
  /** Custom address renderer for form inputs */
  addressRenderer?: (address: Address) => React.ReactNode;
  /** Callback when transaction hash is clicked (for custom navigation) */
  onHashClick?: (hash: string) => void;
  /** Optional title to display above the list */
  title?: string;
}
