import type { Meta, StoryObj } from "@storybook/react-vite";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/form.js";

const meta = {
  title: "Components/Form/NumberField",
  component: Form.NumberField,
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
} satisfies Meta<typeof Form.NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { default: null } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Default number",
    className: "w-full",
  },
};

export const WithIcon: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { default: null } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Default number",
    icon: <Check className="stroke-success" />,
    className: "w-full",
  },
};

export const RequiredField: Story = {
  decorators: [
    (Story) => {
      const schema = z.object({
        required: z.string({ message: "error message" }).min(1),
      });
      const form = useForm({ resolver: zodResolver(schema), mode: "onBlur" });
      useEffect(() => {
        form.trigger();
      }, [form.trigger]);
      return (
        <Form
          form={form}
          onSubmit={() => console.log("submitted")}
          className="w-full"
        >
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "required",
    label: "Required number",
    className: "w-full",
  },
};
