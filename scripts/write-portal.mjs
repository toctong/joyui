import fs from "node:fs";

const content = `"use client";

import * as React from "react";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";

const SECTIONS = [
  {
    title: "快速入门",
    body: "Init / CLI / MCP — install tokens and utils in minutes.",
    href: "/docs",
  },
  {
    title: "基础规范",
    body: "Color and type scale from Figma semantic tokens.",
    href: "/docs/color",
  },
  {
    title: "基础组件",
    body: "Button, Input, Select, Modal — high-fidelity primitives.",
    href: "/docs/base",
  },
  {
    title: "组合组件",
    body: "Agent thinking, composer aurora, medical cards, auth.",
    href: "/docs/compounds",
  },
  {
    title: "图表",
    body: "StatCards, revenue area chart, orders bars.",
    href: "/docs/charts",
  },
  {
    title: "模板",
    body: "AI chat starter; Pro covers kanban / medical / marketing.",
    href: "/docs/templates",
  },
] as const;

export function PortalPlayground() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background-primary-default">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(90% 55% at 50% -8%, color-mix(in oklch, var(--color-blue-400) 18%, transparent), transparent 55%)",
        }}
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-separator-border bg-background-secondary-default px-3 py-1 text-caption-1-medium text-text-secondary">
            JoyUI Docs
          </span>
          <h1 className="text-title-1-medium tracking-tight text-text-primary sm:text-[3.5rem] sm:leading-tight">
            React 设计系统
            <span className="mt-2 block text-text-secondary">为智能体界面而打造</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-body-1-regular text-text-secondary sm:text-headline-regular">
            Foundations, base, compounds, charts, templates — React 19 + Tailwind CSS v4.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/base">
              <Button trailingIcon={RiArrowRightLine}>浏览组件</Button>
            </Link>
            <Link href="/docs/installation">
              <Button variant="secondary">开始安装</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {SECTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2lg border border-separator-border bg-background-secondary-default p-5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xs"
          >
            <div className="text-title-2-medium text-text-primary">{item.title}</div>
            <p className="mt-2 text-body-1-regular text-text-secondary">{item.body}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-20 sm:px-6 lg:px-8">
        <StatCards variant="footer" />
        <div className="grid gap-4 lg:grid-cols-2">
          <RevenueChartCard />
          <div className="space-y-4">
            <ComposerLoader active className="rounded-[1.25rem]">
              <div className="rounded-[1.25rem] border border-separator-border bg-background-primary-default px-4 py-3">
                <p className="text-body-1-regular text-text-secondary">
                  Ask the agent to build a revenue dashboard…
                </p>
                <div className="mt-3">
                  <AgentThinking variant="wave" label="Composing" showTimer />
                </div>
              </div>
            </ComposerLoader>
            <div className="grid gap-4 sm:grid-cols-2">
              <PatientInfoCard />
              <ImportantAlertsCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(
  "apps/docs/components/home/portal-playground.tsx",
  content,
  "utf8",
);
new TextDecoder("utf-8", { fatal: true }).decode(
  fs.readFileSync("apps/docs/components/home/portal-playground.tsx"),
);
console.log("portal written ok");
