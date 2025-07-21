import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils.js";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";

interface AutoSubmitTextInputProps extends React.ComponentProps<"input"> {
  callback: (value: string) => void | Promise<void>;
  name: string;
  debounce?: number;
  label?: string;
  successLabel?: string;
}

type State = "idle" | "pending" | "success" | "error";

export function AutoSubmitTextInput({
  label,
  name,
  callback,
  debounce = 250,
  successLabel,
  value: controlledValue,
  className,
  ...inputProps
}: AutoSubmitTextInputProps) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<any>(null);
  const [value, setValue] = useState<string>(controlledValue?.toString() || "");
  const debouncerRef = useRef<NodeJS.Timeout>(null);
  const lastValueRef = useRef<string>(null);
  const interactedRef = useRef(false);

  const submit = useCallback(
    async (v: string) => {
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
      submit(value || "");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    interactedRef.current = true;
    setValue(e.target.value);
  };

  console.log(error);
  return (
    <div className={cn("w-full", className)}>
      <Label
        htmlFor={inputProps.id || name}
        className={cn(
          "cursor-pointer",
          state === "error" && "text-destructive",
        )}
      >
        {label}
      </Label>
      <Input
        {...inputProps}
        name={name}
        id={inputProps.id || name}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        icon={<StateIcon {...{ state, successLabel }} />}
        className={cn(
          state === "success" && "!border-success focus-visible:ring-success",
          state === "error" &&
          "!border-destructive focus-visible:ring-destructive",
        )}
      />
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
      <div
        className={cn(
          baseClasses,
          "bg-success px-2 font-medium text-white text-xs",
        )}
      >
        {successLabel || <Check className="h-5 w-5" />}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={cn(baseClasses, "bg-destructive")}>
        <X className="h-5 w-5 text-white" />
      </div>
    );
  }
}
