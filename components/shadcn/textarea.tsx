import * as React from "react";

import { cn } from "../../lib/utils.js";

function Textarea
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
({ className, ...props }) => {
  return (
  returnextarea
      className={cn(
        "flex min-h-[60px] w-full border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});


export { Textarea };
