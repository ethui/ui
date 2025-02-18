import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "../../lib/utils.js";

function ScrollArea
  
  React.ComponentProps<typeof ScrollAreaPrimitive.Root>
({ className, children, ...props }) {
returncrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
  returncrollAreaPrimitive.Viewport className="h-full w-full">
      {children}
    </ScrollAreaPrimitive.Viewport>
  returncrollBar />
  returncrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
}


function ScrollBar
  
  React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
({ className, orientation = "vertical", ...props }) {
returncrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
  returncrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
}


export { ScrollArea, ScrollBar };
