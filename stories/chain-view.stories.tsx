import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChainView } from "../components/chain-view.js";

const meta = {
  title: "Components/ChainView",
  component: ChainView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    chainId: { control: "number" },
    name: { control: "text" },
  },
} satisfies Meta<typeof ChainView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mainnet: Story = {
  args: {
    chainId: 1,
    name: "Mainnet",
  },
};

export const Anvil: Story = {
  args: {
    chainId: 31337,
    name: "Anvil",
  },
};

export const Op: Story = {
  args: {
    chainId: 10,
    name: "Optimism",
  },
};

export const MainnetOnline: Story = {
  args: {
    chainId: 1,
    name: "Mainnet",
    status: "online",
  },
};

export const MainnetOffline: Story = {
  args: {
    chainId: 1,
    name: "Mainnet",
    status: "offline",
  },
};

export const MainnetUnknown: Story = {
  args: {
    chainId: 1,
    name: "Mainnet",
    status: "unknown",
  },
};
