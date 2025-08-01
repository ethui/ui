import clsx from "clsx";
import { Check, LoaderCircle, type LucideIcon, Save } from "lucide-react";
import { createElement } from "react";
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type Path,
  type SubmitHandler,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../lib/utils.js";
import { Button, type ButtonProps } from "../shadcn/button.js";
import { Checkbox as ShadCheckbox } from "../shadcn/checkbox.js";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "../shadcn/form.js";
import { Input, type InputProps } from "../shadcn/input.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select.js";
import { Switch as ShadSwitch } from "../shadcn/switch.js";
import { Textarea as ShadTextarea } from "../shadcn/textarea.js";

interface Props<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
}

import { AutoSubmitSwitch } from "./auto-submit/switch";
import { AutoSubmitTextInput } from "./auto-submit/text-input";
import {
  AddressAutoCompleteTextInput as AddressAutoCompleteInput,
  type AddressData,
} from "../address-input.js";
import {
  AutocompleteTextInput as AutoCompleteInput,
  type AutocompleteOption,
} from "../autocomplete-text-input.js";

export const AutoSubmit = { AutoSubmitTextInput, AutoSubmitSwitch };

export function Form<S extends FieldValues>({
  form,
  children,
  onSubmit,
  className,
  ...props
}: Props<S>) {
  return (
    <ShadForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={clsx(
          "flex flex-col items-start gap-2 align-start",
          className,
        )}
        {...props}
      >
        {children}
      </form>
    </ShadForm>
  );
}

// TODO: this is inheriting from InputProps, but is also being used for textarea, checkbox, etc
// need better typings
interface BaseInputProps<T extends FieldValues> extends InputProps {
  label?: string | React.ReactNode;
  name: Path<T>;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}

function Text<T extends FieldValues>({
  name,
  label,
  type = "text",
  className = "",
  icon,
  ...rest
}: BaseInputProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...rest} {...field} type={type} icon={icon} />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.Text = Text;

function Textarea<T extends FieldValues>({
  name,
  label,
  icon,
  className = "",
}: BaseInputProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ShadTextarea {...field} icon={icon} />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.Textarea = Textarea;

function NumberField<T extends FieldValues>({
  name,
  label,
  className = "",
  icon,
  ...rest
}: BaseInputProps<T>) {
  const { register, control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* TODO: maybe we should use zod's coerce instead? https://github.com/shadcn-ui/ui/issues/421 */}
            <Input
              type="number"
              {...rest}
              {...register(name, {
                setValueAs: (value) =>
                  value === "" ? undefined : Number.parseInt(value),
              })}
              icon={icon}
            />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.NumberField = NumberField;

interface BigIntProps<T extends FieldValues> extends BaseInputProps<T> {
  decimals: number;
}

function BigIntField<T extends FieldValues>({
  name,
  label,
  decimals = 18,
  className = "",
  icon,
  ...rest
}: BigIntProps<T>) {
  const multiplier = 10n ** BigInt(decimals);
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* TODO: maybe we should use zod's coerce instead? https://github.com/shadcn-ui/ui/issues/421 */}
            <Input
              type="number"
              {...rest}
              {...field}
              onChange={(e) =>
                field.onChange(BigInt(e.target.value) * multiplier)
              }
              value={(BigInt(field.value) / multiplier).toString()}
              icon={icon}
            />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.BigInt = BigIntField;

function Checkbox<T extends FieldValues>({
  name,
  label,
  className = "",
}: BaseInputProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col", className)}>
          <div className="flex w-full flex-row items-center justify-between space-y-0">
            <FormLabel className="w-full grow cursor-pointer leading-none">
              {label}
            </FormLabel>
            <FormControl>
              {/* TODO: maybe we should use zod's coerce instead? https://github.com/shadcn-ui/ui/issues/421 */}
              <ShadCheckbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </div>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.Checkbox = Checkbox;

function Switch<T extends FieldValues>({
  name,
  label,
  className = "",
}: BaseInputProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col", className)}>
          <div className="flex w-full flex-row items-center justify-between space-y-0">
            <FormLabel className="w-full grow cursor-pointer leading-none">
              {label}
            </FormLabel>
            <FormControl>
              {/* TODO: maybe we should use zod's coerce instead? https://github.com/shadcn-ui/ui/issues/421 */}
              <ShadSwitch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </div>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.Switch = Switch;

interface SubmitLabelMapping {
  save: string;
  saving: string;
  saved: string;
}

const submitLabelKnownMappings: Record<string, SubmitLabelMapping> = {
  save: { save: "Save", saving: "Saving", saved: "Saved" },
  unlock: { save: "Unlock", saving: "Unlocking", saved: "Unlocked" },
};

interface SubmitProps extends ButtonProps {
  label: string | SubmitLabelMapping;
  skipDirtyCheck?: boolean;
  forceLoading?: boolean;
  submittingLabel?: string;
  successLabel?: string;
}

function Submit({
  skipDirtyCheck = false,
  label = submitLabelKnownMappings.save,
  forceLoading,
  ...rest
}: SubmitProps) {
  const {
    formState: { isValid, isDirty, isSubmitSuccessful, isSubmitting },
  } = useFormContext();

  const isLoading = isSubmitting || forceLoading;

  const disabled = skipDirtyCheck
    ? !isValid || isLoading
    : !isDirty || !isValid || isLoading;

  const labelMapping =
    typeof label === "string"
      ? submitLabelKnownMappings[label.toLowerCase()] || label
      : label;

  let computedLabel: string;
  if (!labelMapping) {
    // at this point it can only be a string
    computedLabel = label as string;
  } else if (isLoading) {
    computedLabel = labelMapping.saving;
  } else if (isSubmitSuccessful) {
    computedLabel = labelMapping.saved;
  } else {
    computedLabel = labelMapping.save;
  }

  let icon: LucideIcon;
  if (isLoading) {
    icon = LoaderCircle;
  } else if (isDirty) {
    icon = Save;
  } else if (isSubmitSuccessful) {
    icon = Check;
  } else {
    icon = Save;
  }
  const iconProps = isLoading ? { className: "animate-spin" } : {};

  return (
    <Button type="submit" disabled={disabled} {...rest}>
      {createElement(icon, iconProps)}
      {computedLabel}
    </Button>
  );
}
Form.Submit = Submit;

interface SelectProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
  Item extends { toString: () => string } = string,
> {
  name: TName;
  label: string;
  defaultValue?: FieldPathValue<T, TName>;
  items: Item[];
  toValue?: (v: Item) => string;
  render?: (v: Item) => React.ReactNode;
  className?: string;
}

function SelectInput<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
  Item extends { toString: () => string } = string,
>({
  name,
  label,
  defaultValue,
  items,
  toValue = (v) => v.toString(),
  render = (v) => v.toString(),
  className = "",
}: SelectProps<T, TName, Item>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn("flex w-full items-baseline gap-2", className)}
          >
            <FormLabel className="shrink-0">{label}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || defaultValue}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((v: Item) => (
                  <SelectItem key={toValue(v)} value={toValue(v)}>
                    {render(v)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage>&nbsp;</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
Form.Select = SelectInput;

interface AddressInputFormProps<T extends FieldValues>
  extends BaseInputProps<T> {
  onAddressSelect?: (addressData: AddressData) => void;
  fetchAddresses: (query: string) => Promise<AddressData[]>;
}

interface AutoCompleteTextInputFormProps<T extends FieldValues>
  extends BaseInputProps<T> {
  fetchOptions: (query: string) => Promise<AutocompleteOption[]>;
  onOptionSelect?: (option: AutocompleteOption) => void;
}

function AddressAutoCompleteTextInput<T extends FieldValues>({
  name,
  label,
  className = "",
  onAddressSelect,
  fetchAddresses,
  ...rest
}: AddressInputFormProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AddressAutoCompleteInput
              {...rest}
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              fetchAddresses={fetchAddresses}
            />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.AddressAutoCompleteTextInput = AddressAutoCompleteTextInput;

// Backward compatibility alias
Form.AddressInput = AddressAutoCompleteTextInput;

function AutoCompleteTextInput<T extends FieldValues>({
  name,
  label,
  className = "",
  onOptionSelect,
  fetchOptions,
  ...rest
}: AutoCompleteTextInputFormProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AutoCompleteInput
              {...rest}
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              fetchOptions={fetchOptions}
            />
          </FormControl>
          <FormMessage>&nbsp;</FormMessage>
        </FormItem>
      )}
    />
  );
}
Form.AutoCompleteTextInput = AutoCompleteTextInput;
