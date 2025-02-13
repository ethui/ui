import { type ReactNode, useState } from "react";
import { Button, type ButtonProps } from "./shadcn/button";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";

interface Props extends ButtonProps {
  options: ReactNode[];
}

export function ButtonWithDropdown({ options, className, ...other }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx("relative inline-block w-full", className)}>
      <div className="flex">
        <Button {...other} />
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="relative before:absolute before:top-[10%] before:left-0 before:h-[80%] before:w-px before:bg-primary-foreground/30"
            >
              <ChevronDown
                className={clsx("h-5 w-5", isOpen && "rotate-180 transform")}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute right-0 origin-top-left">
            <DropdownMenuGroup className="py-1">
              {options.map((option, index: number) => (
                <DropdownMenuItem key={index}>
                  <Button variant="ghost">{option}</Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
