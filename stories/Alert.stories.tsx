import type { Meta, StoryObj } from "@storybook/react-vite";

import { CircleCheck, CircleX, Info } from "lucide-react";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/shadcn/alert.js";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>
        This is a description of the information.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CircleCheck className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        This is a description of the information.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <CircleX className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        This is a description of the information.
      </AlertDescription>
    </Alert>
  ),
};
