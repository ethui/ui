import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { AbiItemFormWithPreview } from "../components/abi-form/abi-item-form-with-preview";

const meta: Meta<typeof AbiItemFormWithPreview> = {
  title: "ethui/AbiItemFormWithPreview",
  component: AbiItemFormWithPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    address: { control: "text" },
    sender: { control: "text" },
    chainId: { control: "number" },
    defaultCalldata: { control: "text" },
    defaultEther: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const transferFunction = {
  type: "function",
  name: "transfer",
  inputs: [
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  outputs: [{ type: "bool" }],
  stateMutability: "nonpayable",
} as const;

export const WithAbiFunction: Story = {
  args: {
    abiFunction: transferFunction,
    address: "0x1234567890123456789012345678901234567890",
    sender: "0x0987654321098765432109876543210987654321",
    chainId: 1,
  },
};

export const Raw: Story = {
  args: {
    abiFunction: "raw",
    address: "0x1234567890123456789012345678901234567890",
    sender: "0x0987654321098765432109876543210987654321",
    chainId: 1,
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
