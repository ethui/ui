import { useCallback, useEffect, useState } from "react";
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
  extends Omit<InputProps, "onChange" | "onSelect" | "onBlur"> {
  value?: string;
  onChange?: (value: string) => void;
  fetchOptions: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  emptyMessage?: string;
  minQueryLength?: number;
}

export const AutocompleteTextInput = ({
  value = "",
  onChange,
  fetchOptions,
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  minQueryLength = 0,
  className,
  ...inputProps
}: AutocompleteTextInputProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(value);

  const fetchData = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchOptions(searchQuery);
        setOptions(results);
      } catch (error) {
        console.error("Error fetching autocomplete options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions, minQueryLength],
  );

  useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setOpen(true);
  };

  const handleInputClick = () => {
    setOpen(true);

    if (options.length === 0 && !loading) {
      fetchData(query);
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    setQuery(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="autocomplete-container relative w-full">
      <Input
        value={query}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onBlur={() => {
          setOpen(false);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("w-full", className)}
        autoComplete="off"
        {...inputProps}
      />
      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-hidden overflow-y-auto rounded-md border bg-popover shadow-md">
          {loading ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              {emptyMessage}
            </div>
          ) : (
            <div>
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  asChild
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Option selected:", option);
                    handleSelect(option);
                  }}
                  className="flex h-16 w-full justify-start rounded-none border-border border-b px-4 py-3 last:border-b-0"
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function displayValue(value: string) {
  return isAddress(value) ? truncateHex(value) : value;
}
