import { parse } from "@ethui/abiparse";
import { useCallback, useState } from "react";
import { Debug, stringify } from "../../lib/utils.js";
import { Input } from "../shadcn/input.js";
import type { InnerProps } from "./abi-input.js";

export type BasicProps = Omit<InnerProps, "depth" | "type" | "label">;
export function Basic({ name, defaultValue, onChange, debug }: BasicProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parse(e.target.value);
      setValue(value);
      onChange(value);
    },
    [onChange],
  );

  return (
    <div>
      <Input
        type="text"
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue && stringify(defaultValue, 0)}
      />
      {debug && <Debug value={value} />}
    </div>
  );
}
