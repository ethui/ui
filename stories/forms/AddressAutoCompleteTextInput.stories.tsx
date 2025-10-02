import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/form/index.js";

const mockAddresses = [
  {
    address: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
    alias: "My Wallet",
    wallet: "MyWallet",
  },
  {
    address: "0x9d4454B023096f34B160D6B654540c56A1F81688",
    alias: "Trading Account",
  },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    alias: "Vitalik.eth",
    wallet: "Vitalik",
  },
  {
    address: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
    alias: "DEX Contract",
  },
  { address: "0x1234567890123456789012345678901234567890" },
  {
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    alias: "Test Wallet",
    wallet: "Test",
  },
];

const meta = {
  title: "Components/Form/AddressAutoCompleteTextInput",
  component: Form.AddressAutoCompleteTextInput,
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
} satisfies Meta<typeof Form.AddressAutoCompleteTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const form = useForm({ defaultValues: { recipient: "" } });
      return (
        <Form form={form} onSubmit={() => console.log("submitted")}>
          <Story />
        </Form>
      );
    },
  ],

  args: {
    name: "recipient",
    label: "Recipient Address",
    placeholder: "Search addresses...",
    addresses: mockAddresses,
    className: "w-full",
  },
};

export const WithForm: Story = {
  decorators: [
    (Story) => {
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
        <Form form={form} onSubmit={onSubmit}>
          <Story />
          <Form.Text
            name="amount"
            label="Amount (ETH)"
            type="number"
            placeholder="0.1"
          />
          <Form.Submit label="Send Transaction" />
        </Form>
      );
    },
  ],

  args: {
    name: "recipient",
    label: "Recipient Address",
    placeholder: "Search addresses...",
    addresses: mockAddresses,
    className: "w-full",
  },
};
