import { ChainIcon, type IconChainProps } from "./icons/chain.js";

export interface ChainViewProps
  extends Pick<IconChainProps, "chainId" | "status"> {
  name: string;
  chainId: number;
}

export function ChainView({ name, chainId, status }: ChainViewProps) {
  return (
    <div className="flex items-center gap-x-2">
      <ChainIcon chainId={chainId} status={status} />
      <span>{name}</span>
    </div>
  );
}
