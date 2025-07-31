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

// Mock addresses for demonstration
const mockAddresses = [
  { address: "0x742d35Cc6639C0532fEb2ba6BEaAF05DF0f1A8a0", alias: "My Wallet" },
  {
    address: "0x8ba1f109551bD432803012645Hac136c9d36a345",
    alias: "Trading Account",
  },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    alias: "Vitalik.eth",
  },
  {
    address: "0xA0b86a33E6441E064a0c7d60F6dc6FcC5e1C5b6b",
    alias: "DEX Contract",
  },
  { address: "0x1234567890123456789012345678901234567890" },
  {
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    alias: "Test Wallet",
  },
];

const mockFetchAddresses = async (query: string) => {
  // No artificial delay for snappy demo

  // If no query, return all addresses (for when dropdown opens)
  if (!query.trim()) {
    return mockAddresses;
  }

  return mockAddresses.filter(
    (addr) =>
      addr.address.toLowerCase().includes(query.toLowerCase()) ||
      addr.alias?.toLowerCase().includes(query.toLowerCase()),
  );
};

// Default story with controlled state to show selected values
const DefaultStory = () => {
  const [value, setValue] = React.useState("");

  return (
    <AddressInput
      value={value}
      onChange={setValue}
      placeholder="Search address"
      fetchAddresses={mockFetchAddresses}
      onAddressSelect={(data) => {
        console.log("Address selected:", data);
        setValue(data.address);
      }}
    />
  );
};

export const Default: Story = {
  render: DefaultStory,
};

// WithChainId story with controlled state
const WithChainIdStory = () => {
  const [value, setValue] = React.useState("");

  return (
    <AddressInput
      value={value}
      onChange={setValue}
      placeholder="Enter Ethereum address..."
      chainId={1}
      fetchAddresses={mockFetchAddresses}
      onAddressSelect={(data) => {
        console.log("Selected address:", data);
        setValue(data.address);
      }}
    />
  );
};

export const WithChainId: Story = {
  render: WithChainIdStory,
};

// Generic AutocompleteTextInput story
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
      // Mock generic search results - instant for demo

      const options = [
        {
          value: "option1",
          label: "First Option",
          description: "Description for first option",
        },
        {
          value: "option2",
          label: "Second Option",
          description: "Description for second option",
        },
        { value: "option3", label: "Third Option" },
        {
          value: query,
          label: `Custom: ${query}`,
          description: "Custom value based on your input",
        },
      ];

      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(query.toLowerCase()) ||
          option.value.toLowerCase().includes(query.toLowerCase()),
      );
    },
    onOptionSelect: (option) => console.log("Selected option:", option),
  },
};

// Form integration story
const FormStory = () => {
  const form = useForm({
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(
      `Transaction will be sent to: ${data.recipient}\nAmount: ${data.amount}`,
    );
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
          onAddressSelect={(data) => {
            console.log("Address selected:", data);
            form.setValue("recipient", data.address);
          }}
        />
        <Form.Text
          name="amount"
          label="Amount"
          type="number"
          placeholder="0.1"
        />
        <Form.Submit label="Send Transaction" />
      </Form>

      <div className="text-xs text-muted-foreground">
        <strong>How to use:</strong>
        <br />
        • Click input to see all available addresses
        <br />
        • Type to filter addresses in real-time
        <br />
        • Click any address to select it
        <br />• Or type any custom address and press Enter/Tab
      </div>
    </div>
  );
};

export const InForm: StoryObj = {
  render: FormStory,
};
