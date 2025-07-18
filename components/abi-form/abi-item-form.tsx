import { useCallback, useEffect, useState } from "react";
import type { AbiFunction } from "viem";
import { encodeFunctionData } from "viem/utils";
import { decodeDefaultArgs } from "../../lib/utils.js";
import { Button } from "../shadcn/button.js";
import { AbiInput } from "./abi-input.js";

interface AbiItemFormProps {
  item?: AbiFunction | "raw" | "rawCall";
  debug?: boolean;
  onChange?: (params: {
    item?: AbiFunction;
    value?: bigint;
    data?: `0x${string}`;
    args?: any[];
  }) => void;
  onSubmit?: () => void;
  submit?: boolean;
  defaultCalldata?: `0x${string}`;
  defaultEther?: bigint;
}

export type { AbiFunction };

export function AbiItemForm({
  item: abiItem,
  debug = false,
  defaultCalldata,
  defaultEther,
  onChange,
  onSubmit = () => {},
  submit = false,
}: AbiItemFormProps) {
  if (!abiItem || abiItem === "raw" || abiItem === "rawCall") {
    return (
      <RawItemForm
        {...{
          debug,
          onChange,
          onSubmit,
          defaultCalldata,
          defaultEther,
        }}
      />
    );
  }

  return (
    <AbiItemFormInner
      {...{
        submit,
        item: abiItem,
        debug,
        onChange,
        onSubmit,
        defaultCalldata,
        defaultEther,
      }}
    />
  );
}

type RawItemFormProps = Omit<AbiItemFormProps, "abiItem" | "debug"> & {
  debug: boolean;
};
export function RawItemForm({
  debug,
  onChange,
  onSubmit,
  defaultCalldata,
  defaultEther,
  submit,
}: RawItemFormProps) {
  const [calldata, setCalldata] = useState<`0x${string}`>("0x");
  const [ether, setEther] = useState<bigint>(0n);

  useEffect(() => {
    if (!onChange) return;
    onChange({ data: calldata, value: ether });
  }, [onChange, calldata, ether]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <AbiInput
        name="calldata"
        label="calldata"
        type="bytes"
        debug={debug}
        defaultValue={defaultCalldata}
        onChange={(e: any) => {
          setCalldata(e);
        }}
      />
      <div className="col-span-2">
        <AbiInput
          name="value"
          label="value"
          type="uint256"
          debug={debug}
          defaultValue={defaultEther}
          onChange={(e: any) => {
            setEther(e);
          }}
        />
      </div>
      {onSubmit && submit && (
        <div className="col-start-1">
          <Button type="submit" disabled={!calldata}>
            Submit
          </Button>
        </div>
      )}
    </form>
  );
}

type AbiFormInnerProps = Omit<AbiItemFormProps, "abiItem" | "debug"> & {
  item: AbiFunction;
  debug: boolean;
  onCalldataChange?: (calldata: `0x${string}`) => void;
  onValueChange?: (value: bigint) => void;
  onSubmit: () => void;
  submit: boolean;
};

export function AbiItemFormInner({
  item,
  debug,
  onChange: parentOnChange,
  onSubmit,
  defaultCalldata,
  defaultEther,
  submit,
}: AbiFormInnerProps) {
  const [calldata, setCalldata] = useState<`0x${string}` | undefined>(
    defaultCalldata,
  );
  const [values, setValues] = useState(
    decodeDefaultArgs(item, defaultCalldata),
  );
  const [ether, setEther] = useState<bigint | undefined>(defaultEther);

  const onChange = useCallback(
    (newValue: any, i: number) => {
      const newValues = [...values];
      newValues[i] = newValue;
      setValues(newValues);
    },
    [values],
  );

  useEffect(() => {
    try {
      const encoded = encodeFunctionData({
        abi: [item],
        functionName: item.name,
        args: values,
      });
      setCalldata(encoded);
    } catch (_e) {
      setCalldata(undefined);
    }
  }, [values, item]);

  useEffect(() => {
    if (!parentOnChange) return;
    parentOnChange({ item: item, data: calldata, value: ether, args: values });
  }, [item, parentOnChange, calldata, ether, values]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {item.inputs.map((input, i) => (
        <AbiInput
          key={i}
          name={input.name || i.toString()}
          label={input.name || i.toString()}
          type={input.type}
          debug={debug}
          defaultValue={values[i]}
          onChange={(e: any) => {
            onChange(e, i);
          }}
        />
      ))}
      {item.stateMutability === "payable" && (
        <AbiInput
          name="value"
          label="value"
          type="uint256"
          debug={debug}
          defaultValue={defaultEther}
          onChange={(e: any) => {
            try {
              setEther(BigInt(e));
            } catch (_e) {
              setEther(undefined);
            }
          }}
        />
      )}
      {submit && (
        <div>
          <Button type="submit" disabled={!calldata}>
            Submit
          </Button>
        </div>
      )}
    </form>
  );
}
