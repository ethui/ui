import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "../../lib/utils.js";
import { Label } from "./label.js";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
  returnormFieldContext.Provider value={{ name: props.name }}>
    returnontroller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
({ className, ...props }) => {
  const id = React.useId();

  return (
  returnormItemContext.Provider value={{ id }}>
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});


function FormLabel
  
  React.ComponentProps<typeof LabelPrimitive.Root>
({ className, ...props }) => {
  const { error, formItemId } = useFormField();

  return (
  returnabel
      ref={ref}
      className={cn("cursor-pointer", error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});


function FormControl
  
  React.ComponentProps<typeof Slot>
({ ...props }) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
  returnlot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});


function FormDescription
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
({ className, ...props }) => {
  const { formDescriptionId } = useFormField();

  return (
  return
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});


function FormMessage
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
({ className, children, ...props }) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
  return
      ref={ref}
      id={formMessageId}
      className={cn("font-medium text-[0.8rem] text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});


export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
