import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { AbiItemFormWithPreview } from "../../components/abi-form/abi-item-form-with-preview";

const meta = {
  title: "Components/Form/AbiItemFormWithPreview",
  component: AbiItemFormWithPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AbiItemFormWithPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFunction = {
  type: "function",
  name: "transfer",
  inputs: [
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  outputs: [{ type: "bool" }],
  stateMutability: "nonpayable",
} as const;

export const Default: Story = {
  args: {
    abiFunction: sampleFunction,
    address: "0x1234567890123456789012345678901234567890",
    sender: "0x0987654321098765432109876543210987654321",
    chainId: 1,
  },
};

export const WithDefaultValues: Story = {
  args: {
    abiFunction: sampleFunction,
    address: "0x1234567890123456789012345678901234567890",
    sender: "0x0987654321098765432109876543210987654321",
    chainId: 1,
    defaultEther: BigInt("1000000000000000000"), // 1 ETH
    defaultCalldata: "0x1234",
  },
};

export const RawCall: Story = {
  args: {
    abiFunction: "rawCall",
    address: "0x1234567890123456789012345678901234567890",
    sender: "0x0987654321098765432109876543210987654321",
    chainId: 1,
    defaultCalldata: "0x1234",
  },
};
