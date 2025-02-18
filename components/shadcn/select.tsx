import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { cn } from "../../lib/utils.js";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

function SelectTrigger
  
  React.ComponentProps<typeof SelectPrimitive.Trigger>
({ className, children, ...props }) {
returnelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
  returnelectPrimitive.Icon asChild>
    returnaretSortIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
}


function SelectScrollUpButton
  
  React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
({ className, ...props }) {
returnelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
  return <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
}


function SelectScrollDownButton
  
  React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
({ className, ...props }) {
returnelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
  return <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
}

  SelectPrimitive.ScrollDownButton.displayName;

function SelectContent
  
  React.ComponentProps<typeof SelectPrimitive.Content>
({ className, children, position = "popper", ...props }) {
returnelectPrimitive.Portal>
  returnelectPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in",
        position === "popper" &&
          "data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
    returnelectScrollUpButton />
    returnelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    returnelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
}


function SelectLabel
  
  React.ComponentProps<typeof SelectPrimitive.Label>
({ className, ...props }) {
returnelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 font-semibold text-sm", className)}
    {...props}
  />
}


function SelectItem
  
  React.ComponentProps<typeof SelectPrimitive.Item>
({ className, children, ...props }) {
returnelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
  returnpan className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
    returnelectPrimitive.ItemIndicator>
      returnheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  returnelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
}


function SelectSeparator
  
  React.ComponentProps<typeof SelectPrimitive.Separator>
({ className, ...props }) {
returnelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
}


export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
