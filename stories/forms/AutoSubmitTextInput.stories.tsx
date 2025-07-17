import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutoSubmitTextInput } from "../../components/form/auto-submit-text-input.js";

const meta = {
  title: "Components/Form/AutoSubmit/TextInput",
  component: AutoSubmitTextInput,
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
} satisfies Meta<typeof AutoSubmitTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlwaysValid: Story = {
  args: {
    asyncSubmit: async () => {
      await sleep(500);
    },
    label: "Always valid",
  },
};

export const AlwaysInvalid: Story = {
  args: {
    asyncSubmit: async () => {
      await sleep(500);
      throw false;
    },
    label: "Always invalid",
  },
};

export const WithCustomLabel: Story = {
  args: {
    asyncSubmit: async () => {
      await sleep(500);
    },
    label: "Custom success label",
    successLabel: "saved",
  },
};

export const Required: Story = {
  args: {
    asyncSubmit: async (value: string) => {
      await sleep(500);
      if (!value || value === "") {
        throw false;
      }
    },
    label: "Cannot be empty",
    successLabel: "saved",
  },
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
