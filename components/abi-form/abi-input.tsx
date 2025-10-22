import type { AddressData } from "components/address-autocomplete-input.js";
import { useCallback } from "react";
import { cn, matchArrayType } from "../../lib/utils.js";
import { ArrayInput } from "./array-input.js";
import { Basic } from "./basic.js";

export interface BaseProps {
  name: string;
  type: string;
  label: string;
  debug: boolean;
  defaultValue?: any;
  onChange: (v: any) => void;
  headerActions?: React.ReactNode;
}

export type InnerProps = BaseProps & { depth?: number };

export type AbiInputProps = InnerProps & {
  red?: boolean;
  deleteHover?: boolean;
  className?: string;
  addresses?: AddressData[];
};

export function AbiInput({
  label,
  type,
  onChange: parentOnChange,
  headerActions,
  red = false,
  deleteHover = false,
  className,
  addresses,
  ...rest
}: AbiInputProps) {
  const arrayMatch = matchArrayType(type);

  const onChange = useCallback(
    (v: any) => {
      parentOnChange(v);
    },
    [parentOnChange],
  );

  return (
    <div className={cn("w-full transition-colors", className)}>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="font-bold">{label}</span>
            <span className="font-mono">{type}</span>
          </div>
          <span className="justify-self-end">{headerActions}</span>
        </div>
        {arrayMatch ? (
          <ArrayInput
            {...{
              label,
              baseType: arrayMatch.base,
              subArrays: arrayMatch.subarrays,
              type,
              onChange,
              length: arrayMatch.length,
              addresses,
              ...rest,
            }}
          />
        ) : (
          <Basic {...{ type, onChange, addresses, ...rest }} />
        )}
      </div>
    </div>
  );
}
