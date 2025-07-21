import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils.js";
import { Label } from "../../shadcn/label";
import { Switch as ShadSwitch } from "../../shadcn/switch";

interface AutoSubmitSwitchProps
  extends Omit<React.ComponentProps<typeof ShadSwitch>, "value"> {
  callback: (value: boolean) => void | Promise<void>;
  name: string;
  debounce?: number;
  label?: string;
  successLabel?: string;
  value: boolean;
}

type State = "idle" | "pending" | "success" | "error";

export function AutoSubmitSwitch({
  label,
  name,
  callback,
  debounce = 250,
  successLabel,
  value: controlledValue,
  className,
  ...inputProps
}: AutoSubmitSwitchProps) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<any>(null);
  const [value, setValue] = useState<boolean>(controlledValue || false);
  const debouncerRef = useRef<NodeJS.Timeout>(null);
  const lastValueRef = useRef<boolean>(null);
  const interactedRef = useRef(false);

  const submit = useCallback(
    async (v: boolean) => {
      setState("pending");
      try {
        await callback(v);
        setError(null);
        setState("success");
      } catch (error) {
        setError(error);
        setState("error");
      }
      lastValueRef.current = v;
    },
    [callback],
  );

  useEffect(() => {
    // Clear any existing timer
    if (debouncerRef.current) {
      clearTimeout(debouncerRef.current);
      debouncerRef.current = null;
    }

    // Only validate if user has interacted and value has changed
    if (interactedRef.current && lastValueRef.current !== value) {
      debouncerRef.current = setTimeout(() => {
        submit(value);
      }, debounce);
    } else if (!interactedRef.current) {
      // Only set to idle if user hasn't interacted yet
      setState("idle");
    }
    // If user has interacted but value hasn't changed, preserve current validation state

    return () => {
      if (debouncerRef.current) {
        clearTimeout(debouncerRef.current);
      }
    };
  }, [value, debounce, submit]);

  const onBlur = () => {
    // Check if this value has already been validated
    if (lastValueRef.current === value) {
      return;
    }

    // Clear any pending debounce timer since we're submitting immediately
    if (debouncerRef.current) {
      clearTimeout(debouncerRef.current);
      debouncerRef.current = null;
    }

    if (interactedRef.current) {
      submit(value || false);
    }
  };

  const onChange = (v: boolean) => {
    interactedRef.current = true;
    setValue(v);
  };

  console.log(error);
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="relative flex w-full flex-row items-center justify-between space-y-0">
        <Label
          htmlFor={inputProps.id || name}
          className={cn(
            "w-full grow cursor-pointer leading-none",
            state === "error" && "text-destructive",
          )}
        >
          {label}
        </Label>
        <ShadSwitch
          checked={value}
          {...inputProps}
          name={name}
          id={inputProps.id || name}
          onCheckedChange={onChange}
          onBlur={onBlur}
        />
        <div className="absolute right-0 bottom-0 translate-x-[100%] pl-0">
          <StateIcon {...{ state, successLabel }} />
        </div>
      </div>
      <p
        className={cn(
          "font-medium text-[0.8rem] text-destructive",
          state === "error" && "text-destructive",
        )}
      >
        {error?.toString ? `${error}` : "\u00A0"}
      </p>
    </div>
  );
}

interface StateIconProps {
  state: State;
  successLabel?: string;
}

function StateIcon({ state, successLabel }: StateIconProps) {
  if (state === "idle") return null;

  const baseClasses = "flex h-full min-w-10 items-center justify-center";

  if (state === "pending") {
    return (
      <div className={baseClasses}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className={cn(baseClasses, "px-2 font-medium text-success text-xs")}>
        {successLabel || <Check className="h-5 w-5" />}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={cn(baseClasses, "text-destructive")}>
        <X className="h-5 w-5" />
      </div>
    );
  }
}
