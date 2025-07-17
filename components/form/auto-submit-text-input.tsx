import { Form } from "./index.js";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/form.js";
import { Input } from "../shadcn/input";
import { cn } from "../../lib/utils.js";
import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface AutoSubmitTextInputProps {
  asyncSubmit: (value: string) => void | Promise<void>;
  name: string;
  label: string;
  debounceMs?: number;
  className?: string;
}

type ValidationState = "idle" | "pending" | "success" | "error";

export function AutoSubmitTextInput({
  asyncSubmit,
  name,
  label,
  debounceMs = 250,
  className,
}: AutoSubmitTextInputProps) {
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedValueRef = useRef<string | undefined>(undefined);
  const hasInteractedRef = useRef<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm({
    mode: "all", // Enable both onChange and onBlur
  });

  const fieldValue = form.watch(name);

  const validateAndSubmit = useCallback(
    async (value: string) => {
      setValidationState("pending");

      try {
        await asyncSubmit(value);
        setValidationState("success");
        lastValidatedValueRef.current = value;

        // If not focused, flash the border color temporarily
        if (!isFocused) {
          if (flashTimerRef.current) {
            clearTimeout(flashTimerRef.current);
          }
          flashTimerRef.current = setTimeout(() => {
            setValidationState("idle");
          }, 1500);
        }
      } catch (error) {
        setValidationState("error");
        lastValidatedValueRef.current = value;

        // If not focused, flash the border color temporarily
        if (!isFocused) {
          if (flashTimerRef.current) {
            clearTimeout(flashTimerRef.current);
          }
          flashTimerRef.current = setTimeout(() => {
            setValidationState("idle");
          }, 1500);
        }
      }
    },
    [asyncSubmit, isFocused],
  );

  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Only validate if user has interacted and no form errors
    if (hasInteractedRef.current && !form.formState.errors[name]) {
      debounceTimerRef.current = setTimeout(() => {
        validateAndSubmit(fieldValue || "");
      }, debounceMs);
    } else {
      setValidationState("idle");
    }
  }, [
    fieldValue,
    form.formState.errors[name],
    debounceMs,
    validateAndSubmit,
    name,
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    // Check if this value has already been validated
    if (lastValidatedValueRef.current === fieldValue) {
      return;
    }

    // Clear any pending debounce timer since we're submitting immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (hasInteractedRef.current && !form.formState.errors[name]) {
      validateAndSubmit(fieldValue || "");
    }
  }, [fieldValue, form.formState.errors[name], validateAndSubmit, name]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Clear any pending flash timer when focusing
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
  }, []);

  const renderValidationIcon = () => {
    switch (validationState) {
      case "pending":
        return (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        );
      case "success":
        return <Check className="h-4 w-4 text-success" />;
      case "error":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Form form={form} onSubmit={() => {}}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("w-full", className)}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                icon={renderValidationIcon()}
                className={cn(
                  validationState === "success" &&
                    "border-success focus-visible:ring-success",
                  validationState === "error" &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                onChange={(e) => {
                  hasInteractedRef.current = true;
                  field.onChange(e);
                }}
                onFocus={handleFocus}
                onBlur={() => {
                  field.onBlur();
                  handleBlur();
                }}
              />
            </FormControl>
            <FormMessage>&nbsp;</FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
}
