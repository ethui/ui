import {
  type AutocompleteOption,
  AutocompleteTextInput,
  type AutocompleteTextInputProps,
} from "./autocomplete-text-input.js";

export interface AddressData {
  address: string;
  alias?: string;
  wallet?: string;
}

export interface AddressAutoCompleteTextInputProps
  extends AutocompleteTextInputProps {
  addresses?: AddressData[];
  chainId?: number;
}

export const AddressAutoCompleteTextInput = ({
  addresses = [],
  placeholder = "Search address",
  emptyMessage = "No addresses found.",
  onChange,
  ...props
}: AddressAutoCompleteTextInputProps) => {
  const options: AutocompleteOption[] = addresses.map((addr) => ({
    value: addr.address,
    label: addr.alias,
    badge: addr.wallet,
  }));

  return (
    <AutocompleteTextInput
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      {...props}
    />
  );
};

export const AddressInput = AddressAutoCompleteTextInput;
