import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/form/index.js";

const meta = {
  title: "Components/Form/OTP",
  component: Form.OTP,
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
} satisfies Meta<typeof Form.OTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { default: "" } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Default OTP input",
    className: "w-full",
    maxLength: 6,
    slotClassName: "h-14 w-14 text-2xl",
  },
};

export const CustomLength: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { otp: "" } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "otp",
    label: "4-digit OTP",
    className: "w-full",
    slotClassName: "h-14 w-14",
    maxLength: 4,
  },
};

export const WithDefaultValue: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { otp: "123456" } });
      return (
        <Form
          form={form}
          onSubmit={() => console.log("submitted")}
          className="w-full"
        >
          <Story />
          <pre>result: {JSON.stringify(form.watch("otp"))}</pre>
        </Form>
      );
    },
  ],

  args: {
    name: "otp",
    label: "OTP with default value",
    className: "w-full",
    slotClassName: "h-14 w-14",
    maxLength: 6,
  },
};
