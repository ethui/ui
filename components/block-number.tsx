import { Box as BoxIcon } from "lucide-react";

export interface BlockNumberProps {
  number?: number;
}

export function BlockNumber({ number }: BlockNumberProps) {
  return (
    <div className="flex flex-ro items-center gap-x-1">
      <BoxIcon size={14} />
      {number}
    </div>
  );
}
