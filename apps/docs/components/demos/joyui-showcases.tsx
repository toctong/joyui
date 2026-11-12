"use client";

import * as React from "react";
import { RiAddLine, RiArrowRightLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Switch } from "@/components/base/switch/switch";
import { Badge } from "@/components/base/badges/badge";
import { Chip } from "@/components/base/badges/chip";
import { Avatar } from "@/components/base/avatar/avatar";
import { Tabs, TabList, Tab, TabPanel } from "@/components/base/tabs/tabs";
import { Spinner } from "@/components/base/spinner/spinner";
import { ProgressBar } from "@/components/base/progress/progress";
import { Skeleton } from "@/components/base/skeleton/skeleton";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { AuthCard } from "@/components/application/auth/auth-card";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";

function Frame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`joy-docs-demo not-prose ${className}`}>{children}</div>
  );
}

export function BaseComponentsShowcase() {
  return (
    <Frame className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-label-1-medium text-text-secondary">Button</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Get started</Button>
          <Button variant="secondary" trailingIcon={RiArrowRightLine}>
            Continue
          </Button>
          <Button variant="ghost" leadingIcon={RiAddLine}>
            New
          </Button>
          <Button variant="danger">Delete</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-label-1-medium text-text-secondary">Input</h3>
          <Input label="Email" placeholder="you@company.com" />
          <Input label="Workspace" hint="Used in invites" defaultValue="JoyUI" />
        </div>
        <div className="space-y-4">
          <h3 className="text-label-1-medium text-text-secondary">Selection</h3>
          <Checkbox defaultSelected>Notify me about agent runs</Checkbox>
          <div className="flex items-center gap-3">
            <Switch defaultSelected aria-label="Quiet mode" />
            <span className="text-body-1-medium text-text-primary">Quiet focus</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>12</Badge>
            <Chip color="lime">+14.8%</Chip>
            <Chip color="rose">-2.1%</Chip>
            <Avatar initials="JY" size="sm" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-label-1-medium text-text-secondary">
          Tabs · Segmented · Accordion
        </h3>
        <Tabs defaultSelectedKey="overview">
          <TabList aria-label="Sections">
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
            <Tab id="settings">Settings</Tab>
          </TabList>
          <TabPanel id="overview">
            <p className="text-body-1-regular text-text-secondary">
              Dashboard overview panel.
            </p>
          </TabPanel>
          <TabPanel id="activity">
            <p className="text-body-1-regular text-text-secondary">Activity feed.</p>
          </TabPanel>
          <TabPanel id="settings">
            <p className="text-body-1-regular text-text-secondary">Settings.</p>
          </TabPanel>
        </Tabs>
        <SegmentedControl defaultSelectedKeys={["month"]}>
          <SegmentedControlItem id="week">Week</SegmentedControlItem>
          <SegmentedControlItem id="month">Month</SegmentedControlItem>
          <SegmentedControlItem id="year">Year</SegmentedControlItem>
        </SegmentedControl>
        <Accordion>
          <AccordionItem id="install" title="How do I install components?">
            Use JoyUI CLI or MCP: npx joyui add button — source lands in your
            repo.
          </AccordionItem>
          <AccordionItem id="tokens" title="How do tokens work?">
            Semantic tokens flip under .dark. Prefer text-text-primary and
            bg-background-primary-default.
          </AccordionItem>
        </Accordion>
      </section>

      <section className="flex flex-wrap items-center gap-6">
        <div className="space-y-2">
          <h3 className="text-label-1-medium text-text-secondary">Spinner</h3>
          <Spinner />
        </div>
        <div className="min-w-[200px] flex-1 space-y-2">
          <h3 className="text-label-1-medium text-text-secondary">Progress</h3>
          <ProgressBar value={72} />
        </div>
        <div className="min-w-[160px] space-y-2">
          <h3 className="text-label-1-medium text-text-secondary">Skeleton</h3>
          <Skeleton className="h-10 w-40" />
        </div>
        <ThemeToggle />
      </section>
    </Frame>
  );
}

export function CompoundShowcase() {
  return (
    <Frame className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2lg border border-separator-border bg-background-secondary-default p-4">
          <h3 className="text-label-1-medium text-text-secondary">Agent thinking</h3>
          <AgentThinking variant="wave" label="Thinking" showTimer />
          <AgentThinking variant="spin" label="Searching" />
          <AgentThinking variant="stars" label="Writing" />
        </div>
        <div className="space-y-3">
          <h3 className="text-label-1-medium text-text-secondary">Composer loader</h3>
          <ComposerLoader active className="rounded-[1.25rem]">
            <div className="rounded-[1.25rem] border border-separator-border bg-background-primary-default px-4 py-3">
              <p className="text-body-1-regular text-text-secondary">
                Ask the agent to compose a dashboard…
              </p>
            </div>
          </ComposerLoader>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <PatientInfoCard />
        <ImportantAlertsCard />
      </div>
      <div className="max-w-md">
        <AuthCard mode="signin" headingLevel={2} />
      </div>
    </Frame>
  );
}

export function ChartsShowcase() {
  return (
    <Frame className="space-y-6">
      <StatCards variant="footer" />
      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueChartCard />
        <OrdersChartCard />
      </div>
    </Frame>
  );
}

export function TemplatesShowcase() {
  return (
    <Frame className="space-y-4">
      <div className="overflow-hidden rounded-2lg border border-separator-border bg-background-secondary-default">
        <div className="border-b border-separator-border px-4 py-3">
          <p className="text-title-2-medium text-text-primary">后台管理模板</p>
          <p className="mt-1 text-body-1-regular text-text-secondary">
            浮动侧栏、KPI、收入/订单图表与可筛选数据表，用 JoyUI 组件组装。
          </p>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {["概览", "用户", "订单", "内容", "报表", "设置"].map((name) => (
            <div
              key={name}
              className="rounded-lg border border-separator-border bg-background-primary-default p-4"
            >
              <div className="text-body-1-medium text-text-primary">{name}</div>
              <div className="mt-1 text-caption-1-regular text-text-tertiary">
                控制台模块
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button trailingIcon={RiArrowRightLine} href="/docs/admin-dashboard">
          查看后台管理
        </Button>
        <Button variant="secondary" href="/docs/templates">
          模板总览
        </Button>
      </div>
    </Frame>
  );
}

export function FoundationColorDemo() {
  const swatches = [
    { name: "bg-primary", className: "bg-background-primary-default" },
    { name: "bg-secondary", className: "bg-background-secondary-default" },
    { name: "bg-tertiary", className: "bg-background-tertiary-default" },
    { name: "separator", className: "bg-separator-border" },
    { name: "text-primary", className: "bg-text-primary" },
    { name: "accent", className: "bg-blue-300" },
  ];
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {swatches.map((s) => (
          <div key={s.name} className="space-y-2">
            <div
              className={`h-16 rounded-lg border border-separator-border ${s.className}`}
            />
            <div className="text-caption-1-medium text-text-secondary">{s.name}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function FoundationTypeDemo() {
  return (
    <Frame className="space-y-3">
      <p className="text-title-1-medium text-text-primary">Title 1 Medium</p>
      <p className="text-title-2-medium text-text-primary">Title 2 Medium</p>
      <p className="text-headline-medium text-text-primary">Headline Medium</p>
      <p className="text-body-1-regular text-text-secondary">
        Body 1 Regular — size/weight/line-height stay together. Do not rebuild with
        text-sm font-medium.
      </p>
      <p className="text-caption-1-medium text-text-tertiary">Caption 1 Medium</p>
    </Frame>
  );
}
