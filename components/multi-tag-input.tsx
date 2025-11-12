import { XIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Badge } from "./shadcn/badge.js";
import { Button } from "./shadcn/button.js";
import { Input, type InputProps } from "./shadcn/input.js";

interface MultiTagInputProps extends Omit<InputProps, "onChange"> {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
}

export function MultiTagInput({
  value,
  onChange,
  ...props
}: MultiTagInputProps) {
  const [pendingDataPoint, setPendingDataPoint] = useState("");

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...(value || []), pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint("");
    }
  };

  return (
    <>
      <div className="flex">
        <Input
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
              e.preventDefault();
              addPendingDataPoint();
            }
          }}
          className="rounded-r-none"
          {...props}
        />
        <Button
          type="button"
          className="border border-l-0"
          onClick={addPendingDataPoint}
        >
          Add
        </Button>
      </div>
      <div className="flex min-h-[calc(35px)] flex-wrap items-center gap-1 overflow-y-auto pt-1">
        {(value || []).map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <button
              type="button"
              className="ml-2 w-3 cursor-pointer"
              onClick={() => {
                setPendingDataPoint(item);
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="w-3" />
            </button>
          </Badge>
        ))}
        &nbsp;
      </div>
    </>
  );
}
