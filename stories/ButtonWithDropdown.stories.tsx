import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import React from "react";
import { ButtonWithDropdown } from "../components/button-with-dropdown.js";
import { Button } from "../components/shadcn/button.js";

const meta = {
  title: "Components/ButtonWithDropdown",
  component: ButtonWithDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "text" },
    children: { control: "text" },
    options: { control: undefined },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ButtonWithDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
    children: "macOS",
    options: [
      <Button key="macOS" variant="ghost">
        macOS
      </Button>,
      <Button key="Linux" variant="ghost">
        Linux
      </Button>,
    ],
  },
};
