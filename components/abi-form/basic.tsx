import { parse } from "@ethui/abiparse";
import {
  AddressAutoCompleteTextInput,
  type AddressData,
} from "components/address-autocomplete-input.js";
import { useCallback, useState } from "react";
import { Debug, stringify } from "../../lib/utils.js";
import { Input } from "../shadcn/input.js";
import type { InnerProps } from "./abi-input.js";

export type BasicProps = Omit<InnerProps, "depth" | "label"> & {
  addresses?: AddressData[];
};
export function Basic({
  name,
  defaultValue,
  onChange,
  debug,
  type,
  addresses,
}: BasicProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parse(e.target.value);

      console.log("value", value);
      setValue(value);
      onChange(value);
    },
    [onChange],
  );

  const handleSelect = (option: string) => {
    const value = parse(option);
    setValue(value);
    onChange(value);
  };

  return (
    <div>
      {type === "address" && addresses ? (
        <AddressAutoCompleteTextInput
          name={name}
          onChange={handleChange}
          onSelect={handleSelect}
          defaultValue={defaultValue && stringify(defaultValue, 0)}
          addresses={addresses}
        />
      ) : (
        <Input
          type="text"
          name={name}
          onChange={handleChange}
          defaultValue={defaultValue && stringify(defaultValue, 0)}
        />
      )}

      {debug && <Debug value={value} />}
    </div>
  );
}
