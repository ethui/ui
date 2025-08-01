import { useCallback, useEffect, useState } from "react";
import { cn, truncateHex } from "../lib/utils.js";
import { Input, type InputProps } from "./shadcn/input.js";
import { isAddress } from "viem";

export interface AutocompleteOption {
  value: string;
  label?: string;
  description?: string;
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
    <div className="w-full relative autocomplete-container">
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
        <div className="absolute top-full left-0 right-0 z-50 mt-1 border bg-popover shadow-md rounded-md overflow-hidden max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div>
              {options.map((option) => (
                <div
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Option selected:", option);
                    handleSelect(option);
                  }}
                  className="px-4 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 transition-colors"
                >
                  <div className="flex flex-col gap-1 justify-center min-h-[48px]">
                    <span className="font-medium text-sm leading-none">
                      {option.label ?? displayValue(option.value)}
                    </span>
                    {option.label && (
                      <span className="text-muted-foreground text-sm font-mono leading-none truncate">
                        {displayValue(option.value)}
                      </span>
                    )}
                  </div>
                </div>
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
