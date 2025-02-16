// Initial draft from v0:
// https://v0.dev/chat/load-more-on-scroll-K3f4RYuezLB

import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/use-in-view";
import { LoaderCircle } from "lucide-react";

interface Item {
  id: number;
  title: string;
}

interface Page<T> {
  items: T[];
  finished: boolean;
}

interface Props {
  children: (item: Item) => React.ReactNode;
  onLoadMoreEnd: (items: Item[]) => Promise<Page<Item>>;
}

export function InfiniteScroll({ children, onLoadMoreEnd }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const containerRef = useRef(null);
  const endInView = useInView({ ref: endRef, parent: containerRef });

  // biome-ignore lint/correctness/useExhaustiveDependencies(items): would cause a race-condition and multiple loads
  useEffect(() => {
    if (endInView && !loading) {
      console.log(endInView);
      setLoading(true);
      onLoadMoreEnd(items).then(({ items, finished }) => {
        setItems((prevItems) => [...prevItems, ...items]);
        // workaround to ensure we don't load two pages accidentally due to race conditions
        // enforces a delay of at least 300ms after the last content has been loaded
        setTimeout(() => {
          setLoading(false);
        }, 200);
      });
    }
  }, [endInView, loading, onLoadMoreEnd]);

  return (
    <div
      className="h-[800px] w-full overflow-y-scroll rounded-lg border border-gray-200 p-4"
      ref={containerRef}
    >
      <h2 className="mb-4 font-bold text-2xl">Infinite Scroll Demo</h2>
      {items.map(children)}
      <div ref={endRef} className="flex justify-center py-4">
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <p className="text-gray-500">Load more</p>
        )}
      </div>
    </div>
  );
}
