import { useCallback, useState } from "react";
import { cn } from "../../../lib/utils.js";
import { Label } from "../../shadcn/label.js";
import { Switch as ShadSwitch } from "../../shadcn/switch.js";

interface AutoSubmitSwitchProps
  extends Omit<React.ComponentProps<typeof ShadSwitch>, "value"> {
  callback: (value: boolean) => void | Promise<void>;
  name: string;
  debounce?: number;
  label?: string;
  value?: boolean;
}

export function AutoSubmitSwitch({
  label,
  name,
  callback,
  value: controlledValue,
  className,
  ...inputProps
}: AutoSubmitSwitchProps) {
  const [error, setError] = useState<any>(null);
  const [value, setValue] = useState<boolean>(controlledValue || false);

  const submit = useCallback(
    async (v: boolean) => {
      try {
        await callback(v);
        setError(null);
      } catch (error) {
        setError(error);
      }
    },
    [callback],
  );

  const onChange = (value: boolean) => {
    setValue(value);
    submit(value);
  };

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="flex w-full flex-row items-center justify-between space-y-0">
        <Label
          htmlFor={inputProps.id || name}
          className={cn("w-full grow cursor-pointer leading-none")}
        >
          {label}
        </Label>
        <ShadSwitch
          checked={value}
          {...inputProps}
          name={name}
          id={inputProps.id || name}
          onCheckedChange={onChange}
        />
      </div>
      <p className={cn("font-medium text-[0.8rem] text-destructive")}>
        {error?.toString ? `${error}` : "\u00A0"}
      </p>
    </div>
  );
}
