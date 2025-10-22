import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/form/index.js";

const meta = {
  title: "Components/Form/Textarea",
  component: Form.Textarea,
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
} satisfies Meta<typeof Form.Textarea>;

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
    label: "Default textarea",
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
    label: "Default textarea",
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
      }, [form]);
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
    label: "Required textarea",
    className: "w-full",
  },
};
