import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Abi } from "viem";
import { ResendTransaction } from "../components/contract-execution/resend-transaction/index.js";
import type { ExecutionParams } from "../components/contract-execution/types.js";

const meta: Meta<typeof ResendTransaction> = {
  title: "ethui/ResendTransaction",
  component: ResendTransaction,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock ERC20 ABI
const mockERC20Abi = [
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
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
  },
] as const satisfies Abi;

// Mock encoded transfer call
const mockTransferCalldata =
  "0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890000000000000000000000000000000000000000000000000000000000000000a" as const;

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

const mockWrite = async (params: ExecutionParams): Promise<`0x${string}`> => {
  console.log("Write called with:", params);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
};

const mockSimulate = async (
  params: ExecutionParams,
): Promise<`0x${string}`> => {
  console.log("Simulate called with:", params);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return "0x0000000000000000000000000000000000000000000000000000000000000001";
};

// Story: Resend with ABI (decoded function)
export const WithAbi: Story = {
  args: {
    to: "0x1234567890123456789012345678901234567890",
    input: mockTransferCalldata,
    abi: mockERC20Abi,
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onWrite: mockWrite,
    onSimulate: mockSimulate,
    onHashClick: (hash: string) => {
      console.log("Hash clicked:", hash);
      window.open(`https://etherscan.io/tx/${hash}`, "_blank");
    },
  },
};

// Story: Resend without ABI (raw transaction)
export const WithoutAbi: Story = {
  args: {
    to: "0x1234567890123456789012345678901234567890",
    input: mockTransferCalldata,
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onWrite: mockWrite,
    onHashClick: (hash: string) => {
      console.log("Hash clicked:", hash);
    },
  },
};

// Story: Disconnected wallet
export const Disconnected: Story = {
  args: {
    to: "0x1234567890123456789012345678901234567890",
    input: mockTransferCalldata,
    abi: mockERC20Abi,
    chainId: 1,
    addresses,
    requiresConnection: true,
    isConnected: false,
    onWrite: mockWrite,
    onSimulate: mockSimulate,
  },
};
