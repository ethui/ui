import type { Meta, StoryObj } from "@storybook/react-vite";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../components/table.js";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
  {
    hash: "0x1234567890abcdef1234567890abcdef12345678",
    blockNumber: "18456789",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    value: "1000000000000000000",
    gas: "21000",
    gasPrice: "20000000000",
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    blockNumber: "18456790",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    value: "500000000000000000",
    gas: "21000",
    gasPrice: "20000000000",
  },
  {
    hash: "0x9876543210fedcba9876543210fedcba98765432",
    blockNumber: "18456791",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    value: "0",
    gas: "100000",
    gasPrice: "20000000000",
  },
];

const columnHelper = createColumnHelper<(typeof mockData)[0]>();

const columns = [
  columnHelper.accessor("hash", {
    header: "Transaction Hash",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue().slice(0, 13)}...</span>
    ),
  }),
  columnHelper.accessor("blockNumber", {
    header: "Block",
    cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
  }),
  columnHelper.accessor("from", {
    header: "From",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">
        {getValue().slice(0, 6)}...{getValue().slice(-4)}
      </span>
    ),
  }),
  columnHelper.accessor("to", {
    header: "To",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">
        {getValue().slice(0, 6)}...{getValue().slice(-4)}
      </span>
    ),
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {getValue() === "0" ? "0 ETH" : `${Number(getValue()) / 1e18} ETH`}
      </span>
    ),
  }),
];

export const Default: Story = {
  args: {
    data: mockData,
    columns: columns,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    data: mockData,
    columns: columns,
    variant: "secondary",
    showHeader: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    data: [],
    columns: columns,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};
