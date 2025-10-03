import { useMemo, useState } from "react";
import { isAddress } from "viem";
import { cn, truncateHex } from "../lib/utils.js";
import { Badge } from "./shadcn/badge.js";
import { Button } from "./shadcn/button.js";
import { Input, type InputProps } from "./shadcn/input.js";

export interface AutocompleteOption {
  value: string;
  label?: string;
  badge?: string | React.ReactNode;
}

export interface AutocompleteTextInputProps
  extends Omit<InputProps, "onSelect" | "onBlur" | "defaultValue" | "value"> {
  onSelect?: (value: string) => void;
  options?: AutocompleteOption[];
  loading?: boolean;
  defaultValue?: string;
  placeholder?: string;
  emptyMessage?: string;
}

export const AutocompleteTextInput = ({
  defaultValue = "",
  onChange,
  onSelect,
  options = [],
  loading = false,
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  className,
}: AutocompleteTextInputProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(defaultValue);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const search = query.toLowerCase();
    return options.filter(
      (o) =>
        o.value.toLowerCase().includes(search) ||
        o.label?.toLowerCase().includes(search),
    );
  }, [query, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange?.(e);
    setOpen(true);
  };

  const handleSelect = (option: AutocompleteOption) => {
    setQuery(option.value);
    onSelect?.(option.value);
    setOpen(false);
  };

  return (
    <div className="autocomplete-container relative w-full">
      <Input
        value={query}
        onChange={handleInputChange}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder={placeholder}
        className={cn("w-full", className)}
        autoComplete="off"
      />

      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
          {loading ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              {emptyMessage}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                asChild
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(option);
                }}
                className="flex h-16 w-full cursor-pointer items-center justify-start rounded-none border-border border-b px-4 py-3 last:border-b-0 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-medium text-sm leading-none">
                      {option.label ?? displayValue(option.value)}
                    </span>
                    {option.label && (
                      <span className="truncate font-mono text-muted-foreground text-sm leading-none">
                        {displayValue(option.value)}
                      </span>
                    )}
                  </div>
                  {option.badge && (
                    <Badge variant="secondary" className="shrink-0">
                      {option.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function displayValue(value: string) {
  return isAddress(value) ? truncateHex(value) : value;
}
