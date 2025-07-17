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
    name: "hello",
    asyncSubmit: async () => {
      await sleep(500);
    },
    label: "Always valid",
  },
};

export const AlwaysInvalid: Story = {
  args: {
    name: "hello",
    asyncSubmit: async () => {
      await sleep(500);
      throw false;
    },
    label: "Always invalid",
  },
};

export const Required: Story = {
  args: {
    name: "hello",
    asyncSubmit: async (value: string) => {
      await sleep(500);
      if (!value || value === "") {
        throw false;
      }
    },
    label: "Cannot be empty",
  },
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
