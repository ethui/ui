import type { Meta, StoryObj } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React, { useState } from "react";
import type { Abi } from "viem";
import {
  ContractFunctionsList,
  type ExecutionParams,
  type ExecutionResult,
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
const mockERC20Abi: Abi = [
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
] as Abi;

// Mock execution handlers
const mockExecute = async (
  params: ExecutionParams,
): Promise<ExecutionResult> => {
  console.log("Execute called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isWrite =
    params.abiFunction.stateMutability !== "view" &&
    params.abiFunction.stateMutability !== "pure";

  if (isWrite) {
    // Mock transaction hash for write operations
    return {
      type: "execution",
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      data: JSON.stringify(
        {
          transactionHash:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          blockNumber: "0x123456",
          gasUsed: "0x5208",
          status: "0x1",
        },
        null,
        2,
      ),
    };
  } else {
    // Mock result for read operations
    const mockResults: Record<string, string> = {
      balanceOf: "1000000000000000000000",
      totalSupply: "10000000000000000000000000",
      decimals: "18",
      symbol: "MOCK",
    };

    const result = mockResults[params.abiFunction.name] || "0";

    return {
      type: "call",
      cleanResult: result,
      data: JSON.stringify({ result }, null, 2),
    };
  }
};

const mockSimulate = async (
  params: ExecutionParams,
): Promise<ExecutionResult> => {
  console.log("Simulate called with:", params);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    type: "simulation",
    cleanResult: "Simulation successful",
    data: JSON.stringify(
      {
        success: true,
        gasEstimate: "21000",
        returnData:
          "0x0000000000000000000000000000000000000000000000000000000000000001",
      },
      null,
      2,
    ),
  };
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

// Story: Custom result renderer
const customResultRenderer = (result: ExecutionResult) => {
  return (
    <div className="w-full rounded-lg border-2 border-purple-500 bg-purple-50 p-6">
      <h3 className="mb-2 font-bold text-purple-900">Custom Result Display</h3>
      <p className="text-purple-700">Type: {result.type}</p>
      {result.cleanResult && (
        <p className="text-purple-700">Result: {result.cleanResult}</p>
      )}
      {result.hash && <p className="text-purple-700">Hash: {result.hash}</p>}
      {result.error && <p className="text-red-700">Error: {result.error}</p>}
    </div>
  );
};

export const CustomResultRenderer: Story = {
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
    resultRenderer: customResultRenderer,
  },
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

// Story: Error handling
const mockExecuteWithError = async (
  _params: ExecutionParams,
): Promise<ExecutionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    type: "error",
    error: "Execution reverted: insufficient balance",
  };
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
