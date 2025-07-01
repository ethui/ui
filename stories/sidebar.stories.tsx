import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: ignore
import React from "react";
import { EthuiLogo } from "../components/ethui-logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/shadcn/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../components/shadcn/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "ethui/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Contracts",
      items: ["ERC20 (Token)", "ERC721 (NFT)"],
    },
    {
      title: "Signatures",
      items: ["Basic", "EIP-712"],
    },
    {
      title: "wallet_*",
      items: ["switchChain", "addEthereumChain", "updateEthereumChain"],
    },
  ],
};

export const Regular: Story = {
  args: {},
  render: () => {
    return (
      <SidebarProvider>
        <Sidebar className="max-h-[600px]">
          <SidebarHeader className="flex flex-row items-center justify-center">
            <EthuiLogo fg="fill-dev" bg="bg-transparent" />
            <span>ethui demo</span>
          </SidebarHeader>
          <SidebarContent className="gap-0">
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                title={item.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger>
                      {item.title}{" "}
                      <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {item.items.map((title, i) => (
                          <SidebarMenuItem key={i}>
                            <SidebarMenuButton asChild>
                              <span>{title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
  },
};
