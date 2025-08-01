import { useCallback } from "react";
import {
  AutocompleteTextInput,
  type AutocompleteOption,
  type AutocompleteTextInputProps,
} from "./autocomplete-text-input.js";

export interface AddressData {
  address: string;
  alias?: string;
  wallet?: string;
}

export interface AddressInputProps
  extends Omit<AutocompleteTextInputProps, "fetchOptions" | "onOptionSelect"> {
  fetchAddresses: (query: string) => Promise<AddressData[]>;
  chainId?: number;
}

export interface AddressAutoCompleteTextInputProps extends AddressInputProps {}

export const AddressAutoCompleteTextInput = ({
  fetchAddresses,
  placeholder = "Search address",
  emptyMessage = "No addresses found.",
  onChange,
  ...props
}: AddressAutoCompleteTextInputProps) => {
  const fetchOptions = useCallback(
    async (query: string): Promise<AutocompleteOption[]> => {
      try {
        const addresses = await fetchAddresses(query);
        return addresses.map((addr) => ({
          value: addr.address,
          label: addr.alias,
          badge: addr.wallet,
        }));
      } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
      }
    },
    [fetchAddresses],
  );

  return (
    <AutocompleteTextInput
      fetchOptions={fetchOptions}
      onChange={onChange}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      {...props}
    />
  );
};

export const AddressInput = AddressAutoCompleteTextInput;
