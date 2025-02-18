import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils.js";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

function Label
  
  React.ComponentProps<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
({ className, ...props }) {
returnabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
}


export { Label };
