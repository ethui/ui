import type { Meta, StoryObj } from "@storybook/react-vite";

import React from "react";
import { Button } from "../components/shadcn/button.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/shadcn/tabs.js";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Account Settings</h3>
          <p className="text-muted-foreground text-sm">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="name">
            Name
          </label>
          <input
            name="name"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter your name"
          />
        </div>
        <Button>Save changes</Button>
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Change Password</h3>
          <p className="text-muted-foreground text-sm">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="current_password">
            Current password
          </label>
          <input
            type="password"
            name="current_password"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter current password"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="new_password">
            New password
          </label>
          <input
            type="password"
            name="new_password"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter new password"
          />
        </div>
        <Button>Change password</Button>
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-md border p-4">
          <h3 className="mb-2 font-medium">Overview</h3>
          <p className="text-muted-foreground text-sm">
            View your account overview and recent activity.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-md border p-4">
          <h3 className="mb-2 font-medium">Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Track your performance metrics and analytics data.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="rounded-md border p-4">
          <h3 className="mb-2 font-medium">Reports</h3>
          <p className="text-muted-foreground text-sm">
            Generate and download detailed reports.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-96">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="tab3">Also Active</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="rounded-md border p-4">
          <p>This tab is active and accessible.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="rounded-md border p-4">
          <p>This tab is disabled and cannot be accessed.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="rounded-md border p-4">
          <p>This tab is also active and accessible.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="flex w-96">
      <TabsList className="h-auto w-32 flex-col">
        <TabsTrigger value="general" className="w-full">
          General
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full">
          Security
        </TabsTrigger>
        <TabsTrigger value="advanced" className="w-full">
          Advanced
        </TabsTrigger>
      </TabsList>
      <div className="ml-4 flex-1">
        <TabsContent value="general">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">General Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure your general preferences and settings.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Security Settings</h3>
            <p className="text-muted-foreground text-sm">
              Manage your security preferences and authentication methods.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Advanced Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure advanced options and developer settings.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};
