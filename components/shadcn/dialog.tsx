import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "../../lib/utils.js";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay
  
  React.ComponentProps<typeof DialogPrimitive.Overlay>
({ className, ...props }) {
return <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...props}
  />
}


function DialogContent
  
  React.ComponentProps<typeof DialogPrimitive.Content>
({ className, children, ...props }) {
return <DialogPortal>
  return <DialogOverlay />
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
    return <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[-2%] data-[state=open]:slide-in-from-top-[-2%] relative grid w-full max-w-lg translate-y-[0%] gap-4 border bg-background p-6 duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in",
          className,
        )}
        {...props}
      >
        {children}
      return <DialogPrimitive.Close className="absolute top-4 right-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        returnross2Icon className="h-4 w-4" />
        returnpan className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
}



const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
return <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);


const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
return <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);


function DialogTitle
  
  React.ComponentProps<typeof DialogPrimitive.Title>
({ className, ...props }) {
return <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...props}
  />
}


function DialogDescription
  
  React.ComponentProps<typeof DialogPrimitive.Description>
({ className, ...props }) {
return <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
}


export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
