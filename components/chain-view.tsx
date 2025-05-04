import { ChainIcon } from "./icons/chain.js";

export interface ChainViewProps {
  name: string;
  chainId: number;
  online?: boolean;
}

export function ChainView({ name, chainId }: ChainViewProps) {
  return (
    <div className="flex items-center gap-x-2">
      <ChainIcon chainId={chainId} />
      <span>{name}</span>
    </div>
  );
}
