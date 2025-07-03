import type { Meta, StoryObj } from "@storybook/react-vite";

// biome-ignore lint/correctness/noUnusedImports: ignore
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/shadcn/tabs.js";
import { Button } from "../components/shadcn/button.js";

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
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="Enter your name"
          />
        </div>
        <Button>Save changes</Button>
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Current password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="Enter current password"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border rounded-md" 
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
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground">
            View your account overview and recent activity.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track your performance metrics and analytics data.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-2">Reports</h3>
          <p className="text-sm text-muted-foreground">
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
        <TabsTrigger value="tab2" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="tab3">Also Active</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4 border rounded-md">
          <p>This tab is active and accessible.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4 border rounded-md">
          <p>This tab is disabled and cannot be accessed.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4 border rounded-md">
          <p>This tab is also active and accessible.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="flex w-96">
      <TabsList className="flex-col h-auto w-32">
        <TabsTrigger value="general" className="w-full">General</TabsTrigger>
        <TabsTrigger value="security" className="w-full">Security</TabsTrigger>
        <TabsTrigger value="advanced" className="w-full">Advanced</TabsTrigger>
      </TabsList>
      <div className="flex-1 ml-4">
        <TabsContent value="general">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">General Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your general preferences and settings.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Security Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage your security preferences and authentication methods.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Advanced Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure advanced options and developer settings.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};