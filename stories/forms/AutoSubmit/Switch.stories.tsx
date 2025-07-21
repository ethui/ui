import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutoSubmitSwitch } from "../../../components/form/auto-submit/switch.js";

const meta = {
  title: "Components/Form/AutoSubmit/Switch",
  component: AutoSubmitSwitch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AutoSubmitSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlwaysValid: Story = {
  args: {
    callback: async (_v: string) => {
      await sleep(500);
    },
    name: "valid",
    label: "Always valid",
  },
};

export const AlwaysInvalid: Story = {
  args: {
    callback: async () => {
      await sleep(500);
      throw "invalid";
    },
    name: "invalid",
    label: "Always invalid",
  },
};

export const WithCustomLabel: Story = {
  args: {
    callback: async () => {
      await sleep(500);
    },
    label: "Custom success label",
    name: "custom-label",
    successLabel: "saved",
  },
};

export const Required: Story = {
  args: {
    callback: async (value: string) => {
      await sleep(500);
      if (!value || value === "") {
        throw "cannot be empty";
      }
    },
    name: "required",
    label: "Cannot be empty",
    successLabel: "saved",
  },
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
