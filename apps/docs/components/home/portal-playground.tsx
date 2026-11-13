"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowRightLine,
  RiCheckLine,
  RiDownloadLine,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiLayoutGridLine,
  RiLineChartLine,
  RiNpmjsLine,
  RiPaletteLine,
  RiPuzzleLine,
  RiRobot2Line,
  RiSearchLine,
  RiSettings3Line,
  RiSparklingLine,
  RiTerminalBoxLine,
  RiWindowLine,
} from "@remixicon/react";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { ActivityRingsCard } from "@/components/application/dashboard/activity-rings-card";
import { AreaChartCard } from "@/components/application/dashboard/area-chart-card";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { SleepScoreCard } from "@/components/application/dashboard/sleep-score-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { StepsCard } from "@/components/application/dashboard/steps-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { Announcement } from "@/components/base/announcement/announcement";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarGroup } from "@/components/base/avatar-group/avatar-group";
import { Chip } from "@/components/base/badges/chip";
import { Barcode } from "@/components/base/barcode/barcode";
import { BorderBeam } from "@/components/base/border-beam/border-beam";
import { Button } from "@/components/base/buttons/button";
import { Carousel, CarouselItem } from "@/components/base/carousel/carousel";
import { CarouselCoverflow } from "@/components/base/carousel-coverflow/carousel-coverflow";
import { CarouselStacked } from "@/components/base/carousel-stacked/carousel-stacked";
import { Marquee } from "@/components/base/marquee/marquee";
import { MediaCard } from "@/components/base/media-card/media-card";
import { NumberTicker } from "@/components/base/number-ticker/number-ticker";
import { QrCode } from "@/components/base/qr-code/qr-code";
import { Rating } from "@/components/base/rating/rating";
import { SpotlightCard } from "@/components/base/spotlight-card/spotlight-card";
import { TextShimmer } from "@/components/base/text-shimmer/text-shimmer";
import { Timeline, TimelineItem } from "@/components/base/timeline/timeline";
import { cx } from "@/utils/cx";

const CAROUSEL_SHOTS = [
  { src: "/carousel/sunrise.webp", alt: "Sunrise" },
  { src: "/carousel/kitchen.webp", alt: "Kitchen" },
  { src: "/carousel/seafood.webp", alt: "Seafood" },
  { src: "/carousel/floral.webp", alt: "Floral" },
] as const;

const COVERFLOW_SLIDES = [
  { id: "1", src: "/carousel/shark-collage.webp" },
  { id: "2", src: "/carousel/space-squid.webp" },
  { id: "3", src: "/carousel/vending-machine.webp" },
  { id: "4", src: "/carousel/sunrise.webp" },
  { id: "5", src: "/carousel/floral.webp" },
] as const;

const STACKED_SLIDES = [
  { id: "1", src: "/carousel/space-squid.webp" },
  { id: "2", src: "/carousel/shark-collage.webp" },
  { id: "3", src: "/carousel/floral.webp" },
  { id: "4", src: "/carousel/kitchen.webp" },
] as const;

const TECH = [
  { name: "React", version: "v19" },
  { name: "Tailwind CSS", version: "v4" },
  { name: "React Aria", version: "v1.22" },
  { name: "TanStack Table", version: "v8" },
  { name: "Recharts", version: "v3" },
] as const;

const PATHS = [
  {
    href: "/docs",
    title: "快速入门",
    body: "npm / MCP / Agent Skill，几分钟装上 token 与工具。",
    icon: RiNpmjsLine,
  },
  {
    href: "/docs/color",
    title: "基础规范",
    body: "语义色与字阶，浅色深色自动翻转。",
    icon: RiPaletteLine,
  },
  {
    href: "/docs/base",
    title: "基础组件",
    body: "Button、Input、Select、Modal 等高保真原语。",
    icon: RiLayoutGridLine,
  },
  {
    href: "/docs/compounds",
    title: "组合组件",
    body: "Composer、Auth、Data Grid 等可落地模块。",
    icon: RiPuzzleLine,
  },
  {
    href: "/docs/charts",
    title: "图表",
    body: "StatCards、面积图、漏斗、热力等仪表盘卡片。",
    icon: RiLineChartLine,
  },
  {
    href: "/docs/templates",
    title: "模板",
    body: "后台与聊天等完整页面模板。",
    icon: RiWindowLine,
  },
] as const;

function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("w-full px-4 sm:px-6 lg:px-10 xl:px-14", className)}>{children}</div>
  );
}

function MarqueeTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "shrink-0 overflow-hidden rounded-2xl border border-separator-border bg-background-full shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ShowcaseLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-caption-1-semibold tracking-[0.06em] text-text-tertiary uppercase">
      {children}
    </p>
  );
}

export function PortalPlayground() {
  return (
    <div className="relative flex w-full flex-1 flex-col overflow-x-hidden bg-background-full">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(960px,110%)] overflow-hidden">
        <div className="absolute start-1/2 top-[-18%] h-[560px] w-[min(1100px,140%)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-accent-400)_30%,transparent),transparent_68%)] blur-2xl" />
        <div className="absolute start-[8%] top-[6%] h-[320px] w-[260px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-orange-400)_18%,transparent),transparent_70%)] blur-3xl" />
        <div className="absolute end-[6%] top-[2%] h-[340px] w-[280px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-violet-400)_16%,transparent),transparent_70%)] blur-3xl" />
        {/* Left decorative character — transparent art, anchored to page edge */}
        <img
          src="/brand/hero-character.png"
          alt=""
          width={472}
          height={1024}
          decoding="async"
          className="absolute start-[-6%] top-2 h-[min(780px,88vh)] w-auto max-w-[min(48vw,500px)] object-contain object-left-top opacity-70 sm:start-[-3%] sm:opacity-80 lg:start-0 lg:top-0 lg:max-w-[min(36vw,500px)]"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, #000 55%, transparent 100%), linear-gradient(180deg, #000 58%, transparent 92%)",
            maskImage:
              "linear-gradient(90deg, #000 55%, transparent 100%), linear-gradient(180deg, #000 58%, transparent 92%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />
      </div>

      {/* Hero — full bleed */}
      <section className="relative z-10 w-full pb-10 pt-16 sm:pb-12 sm:pt-20 lg:pt-24">
        <Shell className="text-center">
          <Link
            href="/docs"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-separator-border bg-background-full/80 px-3 py-1.5 text-caption-1-medium text-text-secondary shadow-xs backdrop-blur-sm transition-colors hover:text-text-primary"
          >
            <span className="size-1.5 rounded-full bg-accent-500" aria-hidden />
            JoyUI 文档已开放
            <RiArrowRightLine className="size-3.5 opacity-60" aria-hidden />
          </Link>

          <h1 className="mx-auto max-w-5xl text-balance text-[2.5rem] font-medium leading-[1.12] tracking-tight text-text-primary sm:text-[3.75rem] sm:leading-[1.08]">
            React 设计系统
            <span className="mt-1 block text-accent-600 sm:mt-2">为智能体界面而打造</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-pretty text-body-regular text-text-secondary sm:text-[1.05rem] sm:leading-7">
            <NumberTicker value={100} suffix="+" startOnView={false} className="text-text-primary" />{" "}
            组件 ·{" "}
            <NumberTicker value={19} startOnView={false} className="text-text-primary" /> 张图表 ·{" "}
            <NumberTicker value={400} suffix="+" startOnView={false} className="text-text-primary" />{" "}
            设计变量。语义 token、React Aria，npm / MCP / Skill 都能装进项目。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/base">
              <Button trailingIcon={RiArrowRightLine}>浏览组件</Button>
            </Link>
            <Link href="/docs/installation">
              <Button variant="secondary" leadingIcon={RiDownloadLine}>
                开始安装
              </Button>
            </Link>
          </div>

          <ul className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-2">
            {TECH.map((item) => (
              <li
                key={item.name}
                className="inline-flex items-center gap-1.5 rounded-xl border border-separator-border bg-background-full/70 px-2.5 py-1.5 text-caption-1-medium text-text-secondary backdrop-blur-sm"
              >
                <span className="text-text-primary">{item.name}</span>
                <span className="tabular-nums text-text-tertiary">{item.version}</span>
              </li>
            ))}
          </ul>
        </Shell>
      </section>

      {/* Control marquee — real buttons / chips */}
      <section className="relative z-10 w-full pb-6">
        <Marquee duration={32} pauseOnHover fade className="py-1">
          <Button leadingIcon={RiAddLine}>New project</Button>
          <Button variant="secondary" leadingIcon={RiSearchLine}>
            Search
          </Button>
          <Button variant="ghost" leadingIcon={RiSettings3Line}>
            Settings
          </Button>
          <Button variant="danger">Delete</Button>
          <Chip variant="bold" color="lime">
            +16.2%
          </Chip>
          <Chip variant="bold" color="rose">
            -2.4%
          </Chip>
          <Chip variant="bold" color="blue">
            Live
          </Chip>
          <Button size="small" trailingIcon={RiArrowRightLine}>
            Continue
          </Button>
          <Button size="small" variant="secondary" leadingIcon={RiFlashlightLine}>
            Pro
          </Button>
          <Chip variant="bold" color="purple">
            Agent
          </Chip>
          <Button iconOnly leadingIcon={RiHeartPulseLine} aria-label="Health" />
          <Button iconOnly variant="secondary" leadingIcon={RiCheckLine} aria-label="Done" />
          <span className="shrink-0 px-1">
            <TextShimmer className="text-title-3-medium">Generating reply…</TextShimmer>
          </span>
        </Marquee>
      </section>

      {/* Floating showcase — BoardUI-style, cards on the page (not a stuffed box) */}
      <section className="relative w-full overflow-hidden pb-12 pt-2 sm:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-transparent to-background-full"
        />

        {/* Row 1: health / profile cards float full-bleed */}
        <div className="flex w-full gap-3 overflow-x-auto px-4 pb-3 sm:px-6 lg:gap-4 lg:overflow-visible lg:px-10 xl:px-14">
          <div className="w-[min(280px,78vw)] shrink-0 lg:w-auto lg:min-w-0 lg:flex-[0.9]">
            <PatientInfoCard />
          </div>
          <div className="w-[min(340px,82vw)] shrink-0 lg:w-auto lg:min-w-0 lg:flex-[1.15]">
            <StepsCard />
          </div>
          <div className="w-[min(420px,88vw)] shrink-0 lg:w-auto lg:min-w-0 lg:flex-[1.35]">
            <SleepScoreCard />
          </div>
        </div>

        {/* Row 2: KPI strip */}
        <div className="mt-3 px-4 sm:px-6 lg:px-10 xl:px-14">
          <StatCards variant="footer" />
        </div>

        {/* Row 3: revenue + agent — matched height, lifted surfaces */}
        <div className="mt-3 grid items-stretch gap-3 px-4 sm:px-6 lg:grid-cols-12 lg:px-10 xl:px-14">
          <div className="min-w-0 lg:col-span-7">
            <RevenueChartCard className="min-h-[344px]" />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <BorderBeam className="h-full rounded-[1.25rem]" duration={9} delay={0.4}>
              <div className="relative z-10 flex h-full min-h-[344px] flex-col overflow-hidden rounded-[1.25rem] border border-separator-border bg-background-full shadow-xs">
                <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
                      <RiRobot2Line className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-body-medium text-text-primary">Agent</p>
                      <TextShimmer className="text-caption-1-regular">正在生成界面…</TextShimmer>
                    </div>
                  </div>
                  <Chip variant="bold" color="blue">
                    Live
                  </Chip>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="rounded-xl bg-background-secondary-default px-3.5 py-3">
                    <p className="text-caption-1-semibold text-text-tertiary">You</p>
                    <p className="mt-1 text-body-regular text-text-primary">
                      帮我搭一个带 StatCards 与面积图的收入仪表盘
                    </p>
                  </div>

                  <ComposerLoader active className="mt-auto rounded-xl" radius={16}>
                    <div className="space-y-3 rounded-xl bg-background-secondary-default px-3.5 py-3">
                      <p className="text-caption-1-semibold text-text-tertiary">JoyUI</p>
                      <AgentThinking variant="wave" label="Composing" showTimer />
                      <div className="flex flex-wrap gap-1.5">
                        <Chip variant="caption" color="soft">
                          StatCards
                        </Chip>
                        <Chip variant="caption" color="soft">
                          AreaChart
                        </Chip>
                        <Chip variant="caption" color="soft">
                          Revenue
                        </Chip>
                      </div>
                    </div>
                  </ComposerLoader>
                </div>
              </div>
            </BorderBeam>
          </div>
        </div>
      </section>

      {/* Component marquees — real cards looping */}
      <section className="w-full space-y-5 pb-12 sm:pb-16">
        <Shell className="pb-1">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-caption-1-semibold tracking-[0.08em] text-text-tertiary uppercase">
                Component marquee
              </p>
              <h2 className="mt-1 text-title-2-medium text-text-primary">真组件跑马灯</h2>
              <p className="mt-1 text-body-regular text-text-secondary">
                仪表盘、轮播、二维码、条码、评分… 悬停暂停，全是可安装真组件。
              </p>
            </div>
            <Link
              href="/docs/base"
              className="inline-flex items-center gap-1 text-body-medium text-accent-600 hover:text-accent-500"
            >
              浏览全部组件
              <RiArrowRightLine className="size-4" aria-hidden />
            </Link>
          </div>
        </Shell>

        {/* Dashboard / charts */}
        <Marquee duration={48} pauseOnHover fade>
          <MarqueeTile className="w-[min(360px,78vw)] p-2">
            <StepsCard />
          </MarqueeTile>
          <MarqueeTile className="w-[min(420px,82vw)] p-2">
            <SleepScoreCard />
          </MarqueeTile>
          <MarqueeTile className="w-[min(360px,78vw)] p-2">
            <ActivityRingsCard />
          </MarqueeTile>
          <MarqueeTile className="w-[min(480px,88vw)] p-2">
            <AreaChartCard />
          </MarqueeTile>
          <MarqueeTile className="w-[min(320px,76vw)] p-3">
            <ComposerLoader active className="rounded-[1.25rem]">
              <div className="rounded-[1.25rem] border border-separator-border bg-background-primary-default px-3.5 py-3">
                <p className="text-body-regular text-text-secondary">Ask JoyUI to scaffold…</p>
                <div className="mt-2.5">
                  <AgentThinking variant="wave" label="Thinking" showTimer />
                </div>
              </div>
            </ComposerLoader>
          </MarqueeTile>
          <MarqueeTile className="w-[min(480px,88vw)] p-2">
            <RevenueChartCard />
          </MarqueeTile>
          <MarqueeTile className="w-[min(420px,84vw)] p-2">
            <OrdersChartCard />
          </MarqueeTile>
        </Marquee>

        {/* Carousel / media family */}
        <Marquee duration={54} reverse pauseOnHover fade>
          <MarqueeTile className="w-[min(420px,86vw)] p-3">
            <ShowcaseLabel>Carousel</ShowcaseLabel>
            <Carousel aria-label="图库" autoplay loop showArrows showDots>
              {CAROUSEL_SHOTS.map((shot) => (
                <CarouselItem key={shot.src}>
                  <div className="overflow-hidden rounded-xl border border-separator-border">
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </MarqueeTile>

          <MarqueeTile className="w-[min(560px,92vw)] p-3">
            <ShowcaseLabel>Coverflow</ShowcaseLabel>
            <CarouselCoverflow
              aria-label="作品集"
              slideWidth={168}
              slideHeight={210}
              peek={2}
              autoplay
              slides={COVERFLOW_SLIDES.map((slide) => ({
                id: slide.id,
                content: (
                  <img
                    src={slide.src}
                    alt=""
                    className="size-full rounded-xl object-cover"
                  />
                ),
              }))}
            />
          </MarqueeTile>

          <MarqueeTile className="w-[min(340px,80vw)] p-3">
            <ShowcaseLabel>Stacked</ShowcaseLabel>
            <div className="flex justify-center py-2">
              <CarouselStacked
                aria-label="特性卡片"
                width={220}
                height={280}
                autoplay
                slides={STACKED_SLIDES.map((slide) => ({
                  id: slide.id,
                  content: (
                    <img
                      src={slide.src}
                      alt=""
                      className="size-full rounded-xl object-cover"
                    />
                  ),
                }))}
              />
            </div>
          </MarqueeTile>

          <MarqueeTile className="w-[min(280px,72vw)] p-3">
            <ShowcaseLabel>Media card</ShowcaseLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <MediaCard
                title="Severance"
                subtitle="2022 · TV"
                src="https://image.tmdb.org/t/p/w342/pPHpeI2X1qXQQb1vtlnDJLvxYBi.jpg"
              />
              <MediaCard title="Untitled" subtitle="No artwork" />
            </div>
          </MarqueeTile>

          <MarqueeTile className="w-[min(640px,92vw)] p-2">
            <StatCards variant="footer" columns={2} count={2} />
          </MarqueeTile>
        </Marquee>

        {/* Base utilities — QR / barcode / rating / timeline… */}
        <Marquee duration={42} pauseOnHover fade>
          <MarqueeTile className="w-[min(240px,70vw)] p-4">
            <ShowcaseLabel>QR code</ShowcaseLabel>
            <div className="flex flex-col items-center gap-2.5">
              <QrCode value="https://www.joyui.top" size={148} level="M" />
              <p className="text-caption-1-medium text-text-secondary">joyui.top</p>
            </div>
          </MarqueeTile>

          <MarqueeTile className="w-[min(300px,78vw)] p-4">
            <ShowcaseLabel>Barcode</ShowcaseLabel>
            <div className="flex flex-col gap-3">
              <Barcode value="MH-2026-0312" format="CODE128" />
              <Barcode value="5901234123457" format="EAN13" height={44} />
            </div>
          </MarqueeTile>

          <MarqueeTile className="w-[min(260px,72vw)] p-4">
            <ShowcaseLabel>Rating</ShowcaseLabel>
            <div className="space-y-3">
              <div>
                <p className="text-body-medium text-text-primary">JoyUI Pro</p>
                <p className="mt-0.5 text-caption-1-regular text-text-tertiary">设计系统评分</p>
              </div>
              <Rating value={4.5} aria-label="只读评分" />
              <Rating value={3} interactive aria-label="可点选评分" />
              <AvatarGroup max={3} size="md">
                <Avatar initials="A" color="blue" />
                <Avatar initials="B" color="lime" />
                <Avatar initials="C" color="pink" />
                <Avatar initials="D" />
                <Avatar initials="E" color="blue" />
              </AvatarGroup>
            </div>
          </MarqueeTile>

          <MarqueeTile className="w-[min(300px,78vw)] p-4">
            <ShowcaseLabel>Timeline</ShowcaseLabel>
            <Timeline>
              <TimelineItem title="任务已创建" description="Severance S01" time="刚刚" tone="info" />
              <TimelineItem title="转存完成" description="E01.mkv" time="2 分钟前" tone="success" />
              <TimelineItem title="Cookie 失效" description="请重新登录" time="1 小时前" tone="error" />
            </Timeline>
          </MarqueeTile>

          <MarqueeTile className="w-[min(260px,72vw)] p-3">
            <ShowcaseLabel>Announcement</ShowcaseLabel>
            <Announcement
              title="新功能"
              description="轮播、二维码与条码组件已上线。"
              actionLabel="查看文档"
            />
          </MarqueeTile>

          <MarqueeTile className="w-[min(300px,74vw)] p-2">
            <PatientInfoCard />
          </MarqueeTile>
        </Marquee>
      </section>

      {/* Explore paths */}
      <section className="w-full pb-12 sm:pb-16">
        <Shell>
          <div className="mb-5">
            <p className="text-caption-1-semibold tracking-[0.08em] text-text-tertiary uppercase">
              Explore
            </p>
            <h2 className="mt-1 text-title-2-medium text-text-primary">按信息架构进入文档</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {PATHS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group block min-w-0">
                  <SpotlightCard padding="md" className="h-full transition-transform group-hover:-translate-y-0.5">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className="mt-3 flex items-center gap-1 text-title-3-medium text-text-primary">
                      {item.title}
                      <RiArrowRightLine className="size-4 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600" />
                    </p>
                    <p className="mt-1.5 text-body-regular text-text-secondary">{item.body}</p>
                  </SpotlightCard>
                </Link>
              );
            })}
          </div>
        </Shell>
      </section>

      {/* MCP strip */}
      <section className="w-full pb-16 sm:pb-20">
        <Shell>
          <BorderBeam className="rounded-3xl" duration={12} delay={1}>
            <div className="relative z-10 overflow-hidden rounded-3xl border border-separator-border bg-background-secondary-default">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_oklab,var(--color-accent-400)_18%,transparent),transparent_55%)]"
              />
              <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:gap-10 lg:p-10">
                <div className="flex flex-col justify-center">
                  <div className="mb-3 inline-flex items-center gap-2 text-caption-1-semibold text-accent-600">
                    <RiRobot2Line className="size-4" aria-hidden />
                    MCP · Agent Skill
                  </div>
                  <h2 className="text-balance text-title-1-medium text-text-primary">
                    用智能体安装 JoyUI
                  </h2>
                  <p className="mt-3 max-w-xl text-pretty text-body-regular text-text-secondary">
                    连接 JoyUI MCP，智能体可浏览组件、写入源码并遵守设计规范。也可安装 Agent
                    Skill，让编码助手始终加载 token 与用法规则。
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link href="/docs/mcp">
                      <Button trailingIcon={RiArrowRightLine}>配置 MCP</Button>
                    </Link>
                    <Link href="/docs/skill">
                      <Button variant="secondary" leadingIcon={RiSparklingLine}>
                        Agent Skill
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-separator-border bg-background-full p-5 shadow-xs">
                  <p className="text-caption-1-semibold tracking-[0.06em] text-text-tertiary uppercase">
                    Prompt
                  </p>
                  <p className="mt-3 text-body-regular text-text-primary">
                    「安装 JoyUI，并搭一个带 StatCards 与面积图的收入仪表盘。」
                  </p>
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-background-secondary-default px-3 py-2.5 font-mono text-[12px] leading-5 text-text-secondary">
                    <RiTerminalBoxLine className="mt-0.5 size-3.5 shrink-0 text-accent-600" aria-hidden />
                    <span className="min-w-0 break-all">
                      npx @joyui/cli add stat-cards revenue-chart-card --yes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BorderBeam>
        </Shell>
      </section>
    </div>
  );
}
