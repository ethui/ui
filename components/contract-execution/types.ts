import type { Abi, AbiFunction, Address, Hex } from "viem";
import type { AddressData } from "../address-autocomplete-input.js";

export interface BaseExecutionProps {
  address: Address;
  chainId: number;
  sender?: Address;
  addresses?: AddressData[];
  requiresConnection: boolean;
  isConnected: boolean;
  addressRenderer?: (address: Address) => React.ReactNode;
  onHashClick?: (hash: string) => void;
}

export interface ExecutionParams {
  abiFunction?: AbiFunction;
  callData: Hex;
  msgSender?: Address;
  value?: bigint;
}

export interface ContractExecutionTabsProps {
  /** Full contract ABI (will be filtered internally for functions) */
  abi: Abi;
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
  /** Query function for read-only calls - returns raw hex result */
  onQuery: (params: ExecutionParams) => Promise<`0x${string}`>;
  /** Write function for state-changing transactions - returns transaction hash */
  onWrite: (params: ExecutionParams) => Promise<`0x${string}`>;
  /** Optional simulate function for write functions - returns raw hex result from simulation */
  onSimulate?: (params: ExecutionParams) => Promise<`0x${string}`>;
  /** Enable raw call/transaction tab (default: true) */
  enableRaw?: boolean;
  /** Enable signature-based interaction tab (default: true) */
  enableSignature?: boolean;
  /** Custom address renderer for form inputs */
  addressRenderer?: (address: Address) => React.ReactNode;
  /** Callback when transaction hash is clicked (for custom navigation) */
  onHashClick?: (hash: string) => void;
  /** Optional title to display above the list */
  title?: string;
  /** Optional component to render when there are no functions in the ABI */
  NoAbiComponent?: React.ComponentType;
}
