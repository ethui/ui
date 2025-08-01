import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { AddressInput } from "../components/address-input.js";
import { AutocompleteTextInput } from "../components/autocomplete-text-input.js";
import { Form } from "../components/form/index.js";

const meta: Meta<typeof AddressInput> = {
  title: "Components/AddressInput",
  component: AddressInput,
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
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockAddresses = [
  { address: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF", alias: "My Wallet" },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    alias: "Trading Account",
  },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    alias: "Vitalik.eth",
  },
  {
    address: "0x9d4454B023096f34B160D6B654540c56A1F81688",
    alias: "DEX Contract",
  },
  { address: "0x1234567890123456789012345678901234567890" },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    alias: "Test Wallet",
  },
];

const mockFetchAddresses = async (query: string) => {
  if (!query.trim()) {
    return mockAddresses;
  }

  return mockAddresses.filter(
    (addr) =>
      addr.address.toLowerCase().includes(query.toLowerCase()) ||
      addr.alias?.toLowerCase().includes(query.toLowerCase()),
  );
};

const DefaultStory = () => {
  const [value, setValue] = React.useState("");

  return (
    <AddressInput
      value={value}
      onChange={setValue}
      placeholder="Search address"
      fetchAddresses={mockFetchAddresses}
    />
  );
};

export const Default: Story = {
  render: DefaultStory,
};

const AutocompleteTextInputMeta: Meta<typeof AutocompleteTextInput> = {
  title: "Components/AutocompleteTextInput",
  component: AutocompleteTextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const AutocompleteGeneric: StoryObj<typeof AutocompleteTextInputMeta> = {
  args: {
    placeholder: "Search for anything...",
    fetchOptions: async (query: string) => {
      const options = [
        {
          value: "option1",
          label: "First Option",
        },
        {
          value: "option2",
          label: "Second Option",
        },
        { value: "option3", label: "Third Option" },
        {
          value: query,
          label: `Custom: ${query}`,
        },
      ];

      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(query.toLowerCase()) ||
          option.value.toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
};

const FormStory = () => {
  const form = useForm({
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-96 space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Click the input to see all available addresses, then type to filter or
        select one.
      </div>
      <Form form={form} onSubmit={onSubmit}>
        <Form.AddressInput
          name="recipient"
          label="Recipient Address"
          placeholder="Click to see addresses or type to search..."
          fetchAddresses={mockFetchAddresses}
        />
        <Form.Text
          name="amount"
          label="Amount"
          type="number"
          placeholder="0.1"
        />
        <Form.Submit label="Send Transaction" />
      </Form>
    </div>
  );
};

export const InForm: StoryObj = {
  render: FormStory,
};
