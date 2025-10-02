import type { AbiFunction, Address } from "abitype";
import type { AddressData } from "components/address-autocomplete-input.js";
import { useCallback, useMemo, useState } from "react";
import { parseAbiItem } from "viem";
import { cn } from "../../lib/utils.js";
import { SolidityCall, type SolidityCallProps } from "../solidity-call.js";
import { AbiItemForm } from "./abi-item-form.js";

interface AbiItemFormWithPreview {
  abiFunction: AbiFunction | "raw" | "rawCall" | "signature";
  signature?: string;
  address: Address;
  sender?: Address;
  chainId: number;
  addresses?: AddressData[];
  defaultCalldata?: `0x${string}`;
  defaultEther?: bigint;
  onChange?: (params: { value?: bigint; data?: `0x${string}` }) => void;
  ArgProps?: SolidityCallProps["ArgProps"];
}

export function AbiItemFormWithPreview({
  abiFunction,
  signature,
  address,
  sender,
  chainId,
  addresses,
  defaultCalldata,
  defaultEther,
  onChange: parentOnChange,
  ArgProps,
}: AbiItemFormWithPreview) {
  const [value, setValue] = useState<bigint | undefined>(defaultEther);
  const [data, setData] = useState<`0x${string}` | undefined>(defaultCalldata);

  const onChange = useCallback(
    ({ value, data }: { value?: bigint; data?: `0x${string}` }) => {
      setValue(value);
      setData(data);
      parentOnChange?.({ value, data });
    },
    [parentOnChange],
  );
  const parsedAbiFunction = useMemo(() => {
    if (abiFunction === "signature" && signature) {
      try {
        return parseAbiItem(signature) as AbiFunction;
      } catch {
        return null;
      }
    }
    return abiFunction === "signature" ? null : abiFunction;
  }, [abiFunction, signature]);

  if (parsedAbiFunction === null) {
    return null;
  }

  const showForm =
    parsedAbiFunction === "raw" ||
    parsedAbiFunction === "rawCall" ||
    (typeof parsedAbiFunction === "object" &&
      parsedAbiFunction.inputs.length > 0);

  return (
    <div className="grid grid-cols-3 gap-2">
      <div
        className={cn(
          "col-span-3",
          showForm ? "md:col-span-1" : "md:col-span-0",
        )}
      >
        <AbiItemForm
          item={parsedAbiFunction}
          onChange={onChange}
          defaultEther={defaultEther}
          defaultCalldata={defaultCalldata}
          addresses={addresses}
        />
      </div>
      <div className={cn("col-span-3", showForm && "md:col-span-2")}>
        {data && sender && (
          <SolidityCall
            {...{
              value,
              data,
              from: sender,
              to: address,
              abi:
                parsedAbiFunction !== "raw" && parsedAbiFunction !== "rawCall"
                  ? [parsedAbiFunction]
                  : [],
              chainId,
              ArgProps,
            }}
          />
        )}
      </div>
    </div>
  );
}
