import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "../tailwind.css";
import { ClipboardProvider } from "../components/providers/clipboard-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="p-4 dark:bg-background">
          <ClipboardProvider>
            <Story />
          </ClipboardProvider>
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
