import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Input } from "../shadcn/input";

interface AutoSubmitTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  asyncSubmit: (value: string) => void | Promise<void>;
  debounceMs?: number;
  label?: string;
  successLabel?: string;
}

type ValidationState = "idle" | "pending" | "success" | "error";

export function AutoSubmitTextInput({
  asyncSubmit,
  debounceMs = 250,
  label,
  successLabel,
  value: controlledValue,
  onChange: controlledOnChange,
  onFocus: controlledOnFocus,
  onBlur: controlledOnBlur,
  className,
  ...inputProps
}: AutoSubmitTextInputProps) {
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue?.toString() || "",
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedValueRef = useRef<string | undefined>(undefined);
  const hasInteractedRef = useRef<boolean>(false);

  const fieldValue = controlledValue?.toString() || internalValue;

  const validateAndSubmit = useCallback(
    async (value: string) => {
      setValidationState("pending");

      try {
        await asyncSubmit(value);
        setValidationState("success");
        lastValidatedValueRef.current = value;
      } catch (_error) {
        setValidationState("error");
        lastValidatedValueRef.current = value;
      }
    },
    [asyncSubmit],
  );

  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Only validate if user has interacted and value has changed
    if (
      hasInteractedRef.current &&
      lastValidatedValueRef.current !== fieldValue
    ) {
      debounceTimerRef.current = setTimeout(() => {
        validateAndSubmit(fieldValue || "");
      }, debounceMs);
    } else if (!hasInteractedRef.current) {
      // Only set to idle if user hasn't interacted yet
      setValidationState("idle");
    }
    // If user has interacted but value hasn't changed, preserve current validation state
  }, [fieldValue, debounceMs, validateAndSubmit]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      controlledOnBlur?.(e);

      // Check if this value has already been validated
      if (lastValidatedValueRef.current === fieldValue) {
        return;
      }

      // Clear any pending debounce timer since we're submitting immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      if (hasInteractedRef.current) {
        validateAndSubmit(fieldValue || "");
      }
    },
    [fieldValue, validateAndSubmit, controlledOnBlur],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      controlledOnFocus?.(e);
    },
    [controlledOnFocus],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      hasInteractedRef.current = true;
      const newValue = e.target.value;

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      controlledOnChange?.(e);
    },
    [controlledValue, controlledOnChange],
  );

  const renderValidationIcon = () => {
    switch (validationState) {
      case "pending":
        return (
          <div className="flex h-full w-10 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        );
      case "success":
        return (
          <div
            className={cn(
              "flex h-full items-center justify-center bg-success",
              successLabel ? "w-16" : "w-10",
            )}
          >
            {successLabel ? (
              <span className="font-medium text-white text-xs">
                {successLabel}
              </span>
            ) : (
              <Check className="h-5 w-5 text-white" />
            )}
          </div>
        );
      case "error":
        return (
          <div className="flex h-full w-10 items-center justify-center bg-destructive">
            <X className="h-5 w-5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={inputProps.id}
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Input
        {...inputProps}
        id={inputProps.id}
        type="text"
        value={fieldValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        icon={renderValidationIcon()}
        className={cn(
          validationState === "success" &&
            "!border-success focus-visible:ring-success",
          validationState === "error" &&
            "!border-destructive focus-visible:ring-destructive",
        )}
      />
    </div>
  );
}
