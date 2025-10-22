import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../tailwind.css";
import { ClipboardProvider } from "../components/providers/clipboard-provider";

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
      <div className="p-4 dark:bg-background">
        <ClipboardProvider>
          <Story />
        </ClipboardProvider>
      </div>
    ),
  ],
};

export default preview;
