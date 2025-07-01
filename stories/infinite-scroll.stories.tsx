import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoaderCircle } from "lucide-react";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React, { useRef, useState } from "react";
import { InfiniteScroll } from "../components/infinite-scroll.js";

const meta: Meta = {
  title: "Components/InfiniteScroll",
  component: InfiniteScroll,
  parameters: {
    layout: "centered",
    controls: { disable: true },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface Item {
  id: number;
  title: string;
}

const Item = ({ item }: { item: Item }) => {
  return (
    <div className="mb-4 p-4">
      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  );
};

export const Default: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    const next = async () => {
      setLoading(true);

      const newItems = Array.from({ length: 10 }, (_, i) => ({
        id: items.length + i + 1,
        title: `Item ${items.length + i + 1}`,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Usually your response will tell you if there is no more data.
      if (items.length + newItems.length >= 100) {
        setHasMore(false);
      }
      setLoading(false);
    };

    return (
      <div className="max-h-[600px] w-full overflow-y-auto px-10" ref={listRef}>
        <div className="flex w-full flex-col items-center gap-3">
          {items.map((item) => (
            <Item key={item.id} item={item} />
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={0.5}
            root={listRef.current}
          >
            {hasMore && <LoaderCircle className="animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    );
  },
};
