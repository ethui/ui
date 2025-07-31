import { forwardRef, useCallback, useEffect, useState } from "react";
import { cn } from "../lib/utils.js";
import { Input, type InputProps } from "./shadcn/input.js";

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

export interface AutocompleteTextInputProps
  extends Omit<InputProps, "onChange" | "onSelect" | "onBlur"> {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onOptionSelect?: (option: AutocompleteOption) => void;
  fetchOptions: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  emptyMessage?: string;
  minQueryLength?: number;
}

export const AutocompleteTextInput = ({
  value = "",
  onChange,
  onBlur,
  onOptionSelect,
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

  // Debounced fetch function
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

  // Immediate search effect
  useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  // Update query when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    // Keep dropdown open while typing to show filtered results
    setOpen(true);
  };

  const handleInputFocus = () => {
    setOpen(true);
    // Always fetch options on focus to show all available options
    if (options.length === 0 && !loading) {
      fetchData(query || ""); // Fetch with empty query to get all options
    }
  };

  const handleInputClick = () => {
    setOpen(true);
    // Ensure the input gets focus when clicked
    if (options.length === 0 && !loading) {
      fetchData(query || "");
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    console.log("handleSelect called with:", option);
    setQuery(option.value);
    onChange?.(option.value);
    onOptionSelect?.(option);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
    if (e.key === "Enter") {
      // Always treat Enter as "submit current value" if no option is highlighted
      e.preventDefault();
      const customOption: AutocompleteOption = {
        value: query,
        label: query,
      };
      onOptionSelect?.(customOption);
      setOpen(false);
    }
  };

  return (
    <div className="w-full relative autocomplete-container">
      <Input
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onClick={handleInputClick}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
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
                    e.preventDefault(); // Prevent input blur
                    e.stopPropagation();
                    console.log("Option selected:", option);
                    handleSelect(option);
                  }}
                  className="px-4 py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 transition-colors"
                >
                  <div className="flex flex-col gap-1 justify-center min-h-[48px]">
                    <span className="font-medium text-sm leading-none">
                      {option.label}
                    </span>
                    <span className="text-muted-foreground text-sm font-mono leading-none truncate">
                      {option.description
                        ? `${option.description.slice(
                            0,
                            6,
                          )}...${option.description.slice(-4)}`
                        : ""}
                    </span>
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
