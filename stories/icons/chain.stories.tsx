import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChainIcon } from "../../components/icons/chain.js";

const meta = {
  title: "Icons/Chain",
  component: ChainIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    chainId: { control: "number" },
  },
} satisfies Meta<typeof ChainIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mainnet: Story = {
  args: {
    chainId: 1,
  },
};

export const Anvil: Story = {
  args: {
    chainId: 31337,
  },
};

export const Op: Story = {
  args: {
    chainId: 10,
  },
};

export const MainnetOnline: Story = {
  args: {
    chainId: 1,
    status: "online",
  },
};

export const MainnetOffline: Story = {
  args: {
    chainId: 1,
    status: "offline",
  },
};

export const MainnetUnknown: Story = {
  args: {
    chainId: 1,
    status: "unknown",
  },
};
