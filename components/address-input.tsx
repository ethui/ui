import { useCallback } from "react";
import {
  AutocompleteTextInput,
  type AutocompleteOption,
  type AutocompleteTextInputProps,
} from "./autocomplete-text-input.js";

export interface AddressData {
  address: string;
  alias?: string;
  chainId?: number;
}

export interface AddressInputProps
  extends Omit<AutocompleteTextInputProps, "fetchOptions" | "onOptionSelect"> {
  onAddressSelect?: (addressData: AddressData) => void;
  fetchAddresses?: (query: string) => Promise<AddressData[]>;
  chainId?: number;
}

const defaultFetchAddresses = async (query: string): Promise<AddressData[]> => {
  const mockAddresses: AddressData[] = [
    {
      address: "0x742d35Cc6639C0532fEb2ba6BEaAF05DF0f1A8a0",
      alias: "My Wallet",
    },
    {
      address: "0x8ba1f109551bD432803012645Hac136c9d36a345",
      alias: "Trading Account",
    },
    {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      alias: "Vitalik.eth",
    },
  ];

  if (!query.trim()) {
    return mockAddresses;
  }

  return mockAddresses.filter(
    (addr) =>
      addr.address.toLowerCase().includes(query.toLowerCase()) ||
      addr.alias?.toLowerCase().includes(query.toLowerCase()),
  );
};

export const AddressInput = ({
  onAddressSelect,
  fetchAddresses = defaultFetchAddresses,
  chainId,
  placeholder = "Search address",
  emptyMessage = "No addresses found.",
  onChange,
  ...props
}: AddressInputProps) => {
  const fetchOptions = useCallback(
    async (query: string): Promise<AutocompleteOption[]> => {
      try {
        const addresses = await fetchAddresses(query);
        return addresses.map((addr) => ({
          value: addr.address,
          label: addr.alias || addr.address,
          description: addr.alias ? addr.address : undefined,
        }));
      } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
      }
    },
    [fetchAddresses],
  );

  const handleOptionSelect = useCallback(
    (option: AutocompleteOption) => {
      const addressData: AddressData = {
        address: option.value,
        alias: option.description ? option.label : undefined,
        chainId,
      };

      onChange?.(option.value);

      onAddressSelect?.(addressData);
    },
    [onAddressSelect, chainId, onChange],
  );

  return (
    <AutocompleteTextInput
      fetchOptions={fetchOptions}
      onOptionSelect={handleOptionSelect}
      onChange={onChange}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      {...props}
    />
  );
};
