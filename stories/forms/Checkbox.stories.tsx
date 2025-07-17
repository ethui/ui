import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/form/index.js";

const meta = {
  title: "Components/Form/Checkbox",
  component: Form.Checkbox,
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
} satisfies Meta<typeof Form.Checkbox>;

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
    label: "Default checkbox",
    className: "w-full",
  },
};

export const Checked: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { default: true } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "default",
    label: "Default checkbox",
    className: "w-full",
  },
};

export const RequiredField: Story = {
  decorators: [
    (Story) => {
      const schema = z.object({
        required: z.boolean({ message: "error message" }),
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
    label: "Required checkbox",
    className: "w-full",
  },
};
