import type { Meta, StoryObj } from "@storybook/react";

import React, { useEffect } from "react";
import { Form } from "../../components/form.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
    label: "Required textarea",
    className: "w-full",
  },
};
