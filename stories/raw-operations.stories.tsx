import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  RawOperations,
  type RawCallParams,
} from "../components/contract-execution/index.js";

const meta: Meta<typeof RawOperations> = {
  title: "ethui/RawOperations",
  component: RawOperations,
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

// Mock raw operation handlers
const mockRawCall = async (params: RawCallParams): Promise<`0x${string}`> => {
  console.log("Raw call executed:", params);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock raw hex result (encoded uint256: 42)
  return "0x000000000000000000000000000000000000000000000000000000000000002a";
};

const mockRawTransaction = async (
  params: RawCallParams,
): Promise<`0x${string}`> => {
  console.log("Raw transaction executed:", params);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock transaction hash
  return "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
};

// Story: Both operations available
export const BothOperations: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onRawCall: mockRawCall,
    onRawTransaction: mockRawTransaction,
  },
};

// Story: Only raw call available
export const OnlyRawCall: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onRawCall: mockRawCall,
    // No onRawTransaction
  },
};

// Story: Only raw transaction available
export const OnlyRawTransaction: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    // No onRawCall
    onRawTransaction: mockRawTransaction,
  },
};

// Story: Disconnected wallet (shows connection alert for raw transaction)
export const Disconnected: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    addresses,
    requiresConnection: true,
    isConnected: false,
    onRawCall: mockRawCall,
    onRawTransaction: mockRawTransaction,
  },
};

// Story: With custom address renderer
const customAddressRenderer = (address: string) => {
  return (
    <span className="rounded bg-purple-100 px-2 py-1 font-mono text-purple-800 text-xs">
      🔧 {address.slice(0, 6)}...{address.slice(-4)}
    </span>
  );
};

export const CustomAddressRenderer: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onRawCall: mockRawCall,
    onRawTransaction: mockRawTransaction,
    addressRenderer: customAddressRenderer,
  },
};

// Story: With error handling
const mockRawTransactionWithError = async (
  _params: RawCallParams,
): Promise<`0x${string}`> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error("Transaction reverted: insufficient gas");
};

export const WithError: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onRawCall: mockRawCall,
    onRawTransaction: mockRawTransactionWithError,
  },
};

// Story: With hash click handler
export const WithHashClick: Story = {
  args: {
    address: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    sender: "0x0077014b4C74d9b1688847386B24Ed23Fdf14Be8",
    addresses,
    requiresConnection: true,
    isConnected: true,
    onRawCall: mockRawCall,
    onRawTransaction: mockRawTransaction,
    onHashClick: (hash) => {
      console.log("Hash clicked:", hash);
      alert(`Opening explorer for: ${hash}`);
      window.open(`https://etherscan.io/tx/${hash}`, "_blank");
    },
  },
};
