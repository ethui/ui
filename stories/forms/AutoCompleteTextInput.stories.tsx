import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/form/index.js";

const fetchStatuses = async (query: string) => {
  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  if (!query) return statuses;

  return statuses.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase()),
  );
};

const meta = {
  title: "Components/Form/AutoCompleteTextInput",
  component: Form.AutoCompleteTextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form.AutoCompleteTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { status: "" } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "status",
    label: "Document Status",
    placeholder: "Choose status...",
    fetchOptions: fetchStatuses,
    className: "w-full",
  },
};
