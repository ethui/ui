import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import type { AbiFunction } from "viem";
import {
  ContractFunctionsList,
  type ExecutionParams,
} from "../components/contract-execution/index.js";
import { Button } from "../components/shadcn/button.js";

const meta: Meta<typeof ContractFunctionsList> = {
  title: "ethui/ContractFunctionsList",
  component: ContractFunctionsList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock addresses for autocomplete
const addresses = [
  {
    address: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    alias: "Test Wallet 1",
    wallet: "MetaMask",
  },
  {
    address: "0x0d21F3BCF7e003A825a8c6EE698EAFaB9d3CC82a",
    alias: "Test Wallet 2",
    wallet: "Coinbase",
  },
];

// Mock ERC20-like ABI with read and write functions
const mockERC20Abi: AbiFunction[] = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "supply", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as AbiFunction[];

// Mock execution handlers - now just return raw hex data
const mockExecute = async (params: ExecutionParams): Promise<`0x${string}`> => {
  console.log("Execute called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isWrite =
    params.abiFunction.stateMutability !== "view" &&
    params.abiFunction.stateMutability !== "pure";

  if (isWrite) {
    // Mock transaction hash for write operations
    return "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  } else {
    // Mock encoded result for read operations (manually encoded for simplicity)
    const mockResults: Record<string, `0x${string}`> = {
      balanceOf:
        "0x00000000000000000000000000000000000000000000003635c9adc5dea00000", // 1000 ETH in wei
      totalSupply:
        "0x0000000000000000000000000000000000000000084595161401484a000000", // 10M tokens
      decimals:
        "0x0000000000000000000000000000000000000000000000000000000000000012", // 18
      symbol:
        "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044d4f434b00000000000000000000000000000000000000000000000000000000", // "MOCK"
    };

    return (
      mockResults[params.abiFunction.name] ||
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  }
};

const mockSimulate = async (
  params: ExecutionParams,
): Promise<`0x${string}`> => {
  console.log("Simulate called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 800));

  const isWrite =
    params.abiFunction.stateMutability !== "view" &&
    params.abiFunction.stateMutability !== "pure";

  if (isWrite) {
    // For write simulations, return encoded success (bool true)
    return "0x0000000000000000000000000000000000000000000000000000000000000001";
  } else {
    // For read functions, same as execute
    return mockExecute(params);
  }
};

// Story: Connected wallet with simulate
export const Connected: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onExecute: mockExecute,
    onSimulate: mockSimulate,
    onHashClick: (hash) => {
      console.log("Hash clicked:", hash);
      window.open(`https://etherscan.io/tx/${hash}`, "_blank");
    },
    title: "Contract Functions",
  },
};

// Story: Disconnected wallet (shows connection alert for write functions)
export const Disconnected: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    addresses,
    requiresConnection: true,
    isConnected: false,
    onExecute: mockExecute,
    onSimulate: mockSimulate,
  },
};

// Story: Without simulate (like ethui)
export const WithoutSimulate: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: false, // ethui is always "connected"
    isConnected: true,
    onExecute: mockExecute,
    // No onSimulate provided
  },
};

// Story: Interactive connection toggle
function InteractiveStory() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-lg border bg-muted p-4">
        <span className="font-semibold">Connection Status:</span>
        <span className={isConnected ? "text-green-600" : "text-red-600"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
        <Button onClick={() => setIsConnected(!isConnected)} size="sm">
          {isConnected ? "Disconnect" : "Connect Wallet"}
        </Button>
      </div>

      <ContractFunctionsList
        abi={mockERC20Abi}
        address="0x1234567890123456789012345678901234567890"
        chainId={1}
        sender={
          isConnected ? "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8" : undefined
        }
        addresses={addresses}
        requiresConnection={true}
        isConnected={isConnected}
        onExecute={mockExecute}
        onSimulate={mockSimulate}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveStory />,
};

// Story: With custom address renderer
const customAddressRenderer = (address: string) => {
  return (
    <span className="rounded bg-blue-100 px-2 py-1 font-mono text-blue-800 text-xs">
      📍 {address.slice(0, 6)}...{address.slice(-4)}
    </span>
  );
};

export const CustomAddressRenderer: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onExecute: mockExecute,
    onSimulate: mockSimulate,
    addressRenderer: customAddressRenderer,
  },
};

// Story: Error handling - errors are now thrown instead of returned
const mockExecuteWithError = async (
  _params: ExecutionParams,
): Promise<`0x${string}`> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error("Execution reverted: insufficient balance");
};

export const WithError: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onExecute: mockExecuteWithError,
    onSimulate: mockSimulate,
  },
};
