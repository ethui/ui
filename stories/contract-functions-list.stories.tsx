import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import type { Abi } from "viem";
import { ContractExecutionTabs } from "../components/contract-execution/contract-execution-tabs/index.js";
import type { ExecutionParams } from "../components/contract-execution/shared/types.js";
import { Button } from "../components/shadcn/button.js";

const meta: Meta<typeof ContractExecutionTabs> = {
  title: "ethui/ContractExecutionTabs",
  component: ContractExecutionTabs,
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
const mockERC20Abi = [
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
] as const satisfies Abi;

// Mock execution handlers - now just return raw hex data
const mockQuery = async (params: ExecutionParams): Promise<`0x${string}`> => {
  console.log("Query called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // If no abiFunction (raw call), return generic result
  if (!params.abiFunction) {
    return "0x0000000000000000000000000000000000000000000000000000000000000001";
  }

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
};

const mockWrite = async (params: ExecutionParams): Promise<`0x${string}`> => {
  console.log("Write called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock transaction hash for write operations
  return "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
};

const mockSimulate = async (
  params: ExecutionParams,
): Promise<`0x${string}`> => {
  console.log("Simulate called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 800));

  // If no abiFunction, can't simulate
  if (!params.abiFunction) {
    return "0x0000000000000000000000000000000000000000000000000000000000000001";
  }

  const isWrite =
    params.abiFunction.stateMutability !== "view" &&
    params.abiFunction.stateMutability !== "pure";

  if (isWrite) {
    // For write simulations, return encoded success (bool true)
    return "0x0000000000000000000000000000000000000000000000000000000000000001";
  } else {
    // For read functions, same as query
    return mockQuery(params);
  }
};

// Story: Basic usage with all features
export const Default: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onQuery: mockQuery,
    onWrite: mockWrite,
    onSimulate: mockSimulate,
    enableRaw: true,
    enableSignature: true,
  },
};

// Story: Without simulate and raw operations (minimal setup)
export const WithoutSimulateAndRaw: Story = {
  args: {
    abi: mockERC20Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: false,
    isConnected: true,
    onQuery: mockQuery,
    onWrite: mockWrite,
    // No onSimulate or raw tabs
    enableRaw: false,
    enableSignature: false,
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

      <ContractExecutionTabs
        abi={mockERC20Abi}
        address="0x1234567890123456789012345678901234567890"
        chainId={1}
        sender={
          isConnected ? "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8" : undefined
        }
        addresses={addresses}
        requiresConnection={true}
        isConnected={isConnected}
        onQuery={mockQuery}
        onWrite={mockWrite}
        onSimulate={mockSimulate}
        enableRaw={true}
        enableSignature={true}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveStory />,
};

// Story: Error handling - errors are now thrown instead of returned
const mockWriteWithError = async (
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
    onQuery: mockQuery,
    onWrite: mockWriteWithError,
    onSimulate: mockSimulate,
    enableRaw: true,
    enableSignature: true,
  },
};

// Story: Empty ABI (shows only signature and raw operations)
export const EmptyAbi: Story = {
  args: {
    abi: [] as Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onQuery: mockQuery,
    onWrite: mockWrite,
    onSimulate: mockSimulate,
    enableRaw: true,
    enableSignature: true,
  },
};

// Custom component to render when there's no ABI
function CustomNoAbi() {
  return (
    <div className="space-y-4 p-8 text-center">
      <div>
        <h3 className="mb-2 font-semibold text-lg">No ABI Available</h3>
        <p className="mx-auto max-w-md text-muted-foreground text-sm">
          This contract doesn't have a verified ABI. You can still interact with
          it using the Raw or Signature tabs.
        </p>
      </div>
    </div>
  );
}

// Story: Empty ABI with custom no ABI component
export const EmptyAbiWithCustomComponent: Story = {
  args: {
    abi: [] as Abi,
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onQuery: mockQuery,
    onWrite: mockWrite,
    onSimulate: mockSimulate,
    enableRaw: true,
    enableSignature: true,
    NoAbiComponent: CustomNoAbi,
  },
};
