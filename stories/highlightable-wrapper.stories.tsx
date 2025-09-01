import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";
import { HighlightableWrapper } from "../components/highlightable-wrapper.js";
import { Table } from "../components/table.js";

const meta: Meta<typeof HighlightableWrapper> = {
  title: "Components/HighlightableWrapper",
  component: HighlightableWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    highlightKey: { control: "text" },
    className: { control: "text" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const items = [
      { key: "address-1", content: "0x1234...5678" },
      { key: "address-2", content: "0xabcd...efgh" },
      { key: "address-1", content: "0x1234...5678" },
      { key: "address-3", content: "0x9876...5432" },
      { key: "address-2", content: "0xabcd...efgh" },
      { key: "address-4", content: "0xdef0...1234" },
    ];

    return (
      <div className="space-y-2">
        <p className="mb-4 text-muted-foreground text-sm">
          Hover over any address to see all matching addresses highlight:
        </p>
        {items.map((item, index) => (
          <HighlightableWrapper
            key={`${item.key}-${index}`}
            highlightKey={item.key}
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
            className="rounded border p-3 font-mono"
          >
            {item.content}
          </HighlightableWrapper>
        ))}
      </div>
    );
  },
  args: {
    highlightKey: "",
    hoveredKey: null,
    onHover: () => {},
    children: "",
  },
};

export const TableExample: Story = {
  render: () => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const transactions = [
      { id: 1, from: "0x1234...5678", to: "0xabcd...efgh", amount: "1.5 ETH" },
      { id: 2, from: "0xabcd...efgh", to: "0x9876...5432", amount: "0.8 ETH" },
      { id: 3, from: "0x9876...5432", to: "0x1234...5678", amount: "2.1 ETH" },
    ];

    const columns = [
      {
        accessorKey: "from",
        header: "From",
        cell: ({ row }: { row: any }) => (
          <HighlightableWrapper
            highlightKey={row.original.from}
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
            className="font-mono"
          >
            {row.original.from}
          </HighlightableWrapper>
        ),
      },
      {
        accessorKey: "to",
        header: "To",
        cell: ({ row }: { row: any }) => (
          <HighlightableWrapper
            highlightKey={row.original.to}
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
            className="font-mono"
          >
            {row.original.to}
          </HighlightableWrapper>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: { row: any }) => row.original.amount,
      },
    ];

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Hover over addresses to see them highlighted across the table:
        </p>
        <Table data={transactions} columns={columns} />
      </div>
    );
  },
  args: {
    highlightKey: "",
    hoveredKey: null,
    onHover: () => {},
    children: "",
  },
};
