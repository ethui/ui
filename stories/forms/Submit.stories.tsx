import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/form.js";

const meta = {
  title: "Components/Form/Submit",
  component: Form.Submit,
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
} satisfies Meta<typeof Form.Submit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRequiredInput: Story = {
  decorators: [
    (Story) => {
      const schema = z.object({
        required: z.string().min(1),
      });

      const form = useForm({
        resolver: zodResolver(schema),
      });

      const onSubmit = async () => {
        console.log("submitting");
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("submitted");
        form.reset({}, { keepValues: true });
      };

      return (
        <Form form={form} onSubmit={onSubmit}>
          <Form.Text
            name="required"
            label="Required field"
            className="w-full"
          />
          <div className="flex gap-2">
            <Story />
          </div>
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Save",
    className: "w-full",
  },
};

export const WithOptionalInput: Story = {
  decorators: [
    (Story) => {
      const schema = z.object({
        optional: z.string().optional(),
      });

      const form = useForm({
        resolver: zodResolver(schema),
      });

      const onSubmit = async () => {
        console.log("submitting");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("submitted");
        form.reset({}, { keepValues: true });
      };

      return (
        <Form form={form} onSubmit={onSubmit}>
          <Form.Text
            name="optional"
            label="Optional field"
            className="w-full"
          />
          <div className="flex gap-2">
            <Story />
          </div>
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Submit",
    className: "w-full",
  },
};
