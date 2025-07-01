import type { Meta, StoryObj } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React, { useState } from "react";
import { AbiItemFormWithPreview } from "../components/abi-form/abi-item-form-with-preview.js";
import { Input } from "../components/shadcn/input.js";

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

// Basic ABI Functions
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

// Complex ABI Functions
const arrayFunction = {
  type: "function",
  name: "batchTransfer",
  inputs: [
    { name: "recipients", type: "address[]" },
    { name: "amounts", type: "uint256[]" },
  ],
  outputs: [{ type: "bool[]" }],
  stateMutability: "nonpayable",
} as const;

const matrixFunction = {
  type: "function",
  name: "setMatrix",
  inputs: [{ name: "matrix", type: "uint256[][]" }],
  outputs: [{ type: "bool" }],
  stateMutability: "nonpayable",
} as const;

const tupleFunction = {
  type: "function",
  name: "complexTransfer",
  inputs: [
    {
      name: "transferData",
      type: "tuple",
      components: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
  ],
  outputs: [{ type: "bool" }],
  stateMutability: "nonpayable",
} as const;

// ABI Function Stories
export const BasicFunction: Story = {
  args: {
    abiFunction: transferFunction,
    address: "0x1234...7890",
    sender: "0x0987...54321",
    chainId: 1,
  },
};

export const WithArrayInputs: Story = {
  args: {
    abiFunction: arrayFunction,
    address: "0x1234...7890",
    sender: "0x0987...54321",
    chainId: 1,
  },
};

export const WithMatrixInput: Story = {
  args: {
    abiFunction: matrixFunction,
    address: "0x1234...7890",
    sender: "0x0987...54321",
    chainId: 1,
  },
};

export const WithTupleInput: Story = {
  args: {
    abiFunction: tupleFunction,
    address: "0x1234...7890",
    sender: "0x0987...54321",
    chainId: 1,
  },
};

// Mode Stories
export const RawMode: Story = {
  args: {
    abiFunction: "raw",
    address: "0x1234...7890",
    sender: "0x0987...54321",
    chainId: 1,
  },
};

function SignatureForm() {
  const [signature, setSignature] = useState(
    "function transfer(address to, uint256 amount) returns (bool)",
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        placeholder="Enter function signature..."
        className="w-full"
      />
      <AbiItemFormWithPreview
        abiFunction="signature"
        signature={signature}
        address="0x1234...7890"
        sender="0x0987...54321"
        chainId={1}
      />
    </div>
  );
}

export const SignatureMode: Story = {
  render: () => <SignatureForm />,
};
