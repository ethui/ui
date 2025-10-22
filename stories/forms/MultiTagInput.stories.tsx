import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/form/index.js";
import { MultiTagInput } from "../../components/multi-tag-input.js";

const meta = {
  title: "Components/Form/MultiTagInput",
  component: MultiTagInput,
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
} satisfies Meta<typeof MultiTagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    () => {
      const [values, setValues] = useState<string[]>([]);
      return <MultiTagInput value={values} onChange={setValues} />;
    },
  ],

  args: {} as any,
};

export const InForm: Story = {
  decorators: [
    () => {
      const schema = z.object({
        tags: z.array(z.string()),
      });
      const form = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: { tags: [] },
      });

      return (
        <Form form={form} onSubmit={() => console.info("submitted")}>
          <Form.MultiTagInput name="tags" />
        </Form>
      );
    },
  ],

  args: {} as any,
};
