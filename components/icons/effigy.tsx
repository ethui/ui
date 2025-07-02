import clsx from "clsx";
import { useState } from "react";

export interface EffigyIconProps {
  address: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function EffigyIcon({ address, className, fallback }: EffigyIconProps) {
  const [hasError, setHasError] = useState(false);
  
  // Validate address format (basic hex check)
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  
  if (!isValidAddress || hasError) {
    return (
      fallback || (
        <div
          className={clsx(
            "h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500",
            className
          )}
        >
          ?
        </div>
      )
    );
  }

  return (
    <img
      alt={`Effigy for ${address}`}
      className={clsx("h-6 w-6", className)}
      src={`https://effigy.im/a/${address}.svg`}
      onError={() => setHasError(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
