import type { Meta, StoryObj } from "@storybook/react";

import { InfiniteScroll } from "../components/infinite-scroll.js";
import React from "react";

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

export const Default: Story = {
  render: () => {
    return (
      <InfiniteScroll
        onLoadMoreEnd={async (items) => {
          return {
            items: Array.from({ length: 10 }, (_, i) => ({
              id: items.length + i + 1,
              title: `Item ${items.length + i + 1}`,
            })),
            finished: items.length >= 100,
          };
        }}
      >
        {(item) => (
          <div key={item.id} className="mb-4 rounded-lg bg-white p-4 shadow">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        )}
      </InfiniteScroll>
    );
  },
};
