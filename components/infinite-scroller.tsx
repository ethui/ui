// Initial draft from v0:
// https://v0.dev/chat/load-more-on-scroll-K3f4RYuezLB

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "./use-in-view";

interface Item {
  id: number;
  title: string;
}

export function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const inView = useInView(loaderRef);

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: items.length + i + 1,
      title: `Item ${items.length + i + 1}`,
    }));
    setItems((prevItems) => [...prevItems, ...newItems]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  }, [items.length, loading]);

  useEffect(() => {
    if (inView) {
      loadMoreItems();
    }
  }, [inView, loadMoreItems]);

  return (
    <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Infinite Scroll Demo</h2>
      {items.map((item) => (
        <div key={item.id} className="bg-white shadow rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      ))}
      <div ref={loaderRef} className="flex justify-center py-4">
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : (
          <p className="text-gray-500">Load more</p>
        )}
      </div>
    </div>
  );
}
