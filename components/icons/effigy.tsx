import { cn } from "../../lib/utils.js";

export interface EffigyIconProps {
  address: string;
  className?: string;
}

export function EffigyIcon({ address, className }: EffigyIconProps) {
  // TODO: seems effigi.im no longer supports ENS
  return (
    <img
      alt={`Effigy for ${address}`}
      className={cn("h-6 w-6", className)}
      src={`https://effigy.im/a/${address}.svg`}
    />
  );
}
