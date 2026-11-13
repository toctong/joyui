# -*- coding: utf-8 -*-
from pathlib import Path

docs = Path(r"G:/project/joyui/apps/docs/content/docs")

charts = [
    dict(
        slug="area-chart-card",
        title="面积图",
        desc="堆叠/重叠/100% 面积系列与统计图块。",
        preview="pro",
        embeds=["AreaChartEmbed", "AreaChartWithStats"],
        sections=[
            (
                "仪表盘嵌入",
                "卡片放入看板壳层；周/月/年切换内置在卡片上。",
                "area-chart-card-embed.tsx",
                'import { AreaChartCard } from "@/components/application/dashboard/area-chart-card";\n\n<AreaChartCard />',
                "AreaChartEmbed",
                "primary",
            ),
            (
                "与指标卡组合",
                "上方 KPI，下方面积趋势。",
                "area-chart-with-stats.tsx",
                'import { AreaChartCard } from "@/components/application/dashboard/area-chart-card";\nimport { StatCards } from "@/components/application/dashboard/stat-cards";\n\n<>\n  <StatCards columns={2} count={2} />\n  <AreaChartCard />\n</>',
                "AreaChartWithStats",
                "secondary",
            ),
        ],
    ),
    dict(
        slug="revenue-chart-card",
        title="收入图表",
        desc="今年面积对去年虚线对照。",
        preview="component",
        embeds=["RevenueChartEmbed", "RevenueOrdersPair"],
        sections=[
            (
                "仪表盘嵌入",
                "可用 title / data 替换演示。",
                "revenue-chart-card-embed.tsx",
                'import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";\n\n<RevenueChartCard title="全年收入" />',
                "RevenueChartEmbed",
                "primary",
            ),
            (
                "与订单并排",
                "收入 + 订单同屏对比。",
                "revenue-orders-pair.tsx",
                'import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";\nimport { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";\n\n<>\n  <RevenueChartCard title="收入" />\n  <OrdersChartCard />\n</>',
                "RevenueOrdersPair",
                "secondary",
            ),
        ],
    ),
    dict(
        slug="line-chart-card",
        title="折线图",
        desc="曲线或折线区域图，带动画激活点。",
        preview="pro",
        embeds=["LineChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "折线卡嵌入 KPI 区。",
                "line-chart-card-embed.tsx",
                'import { LineChartCard } from "@/components/application/dashboard/line-chart-card";\n\n<LineChartCard />',
                "LineChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="orders-chart-card",
        title="订单图表",
        desc="订单量趋势卡片。",
        preview="component",
        embeds=["OrdersChartEmbed", "RevenueOrdersPair"],
        sections=[
            (
                "仪表盘嵌入",
                "与收入卡同构，便于并排。",
                "orders-chart-card-embed.tsx",
                'import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";\n\n<OrdersChartCard />',
                "OrdersChartEmbed",
                "primary",
            ),
            (
                "与收入并排",
                "同构卡片便于对比。",
                "orders-revenue-pair.tsx",
                'import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";\nimport { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";\n\n<>\n  <RevenueChartCard />\n  <OrdersChartCard />\n</>',
                "RevenueOrdersPair",
                "secondary",
            ),
        ],
    ),
    dict(
        slug="earnings-chart-card",
        title="收益图表",
        desc="收益趋势卡片。",
        preview="pro",
        embeds=["EarningsChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "财务看板模块。",
                "earnings-chart-card-embed.tsx",
                'import { EarningsChartCard } from "@/components/application/dashboard/earnings-chart-card";\n\n<EarningsChartCard />',
                "EarningsChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="funnel-chart-card",
        title="漏斗图",
        desc="转化漏斗卡片。",
        preview="pro",
        embeds=["FunnelChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "替换各阶段业务数据。",
                "funnel-chart-card-embed.tsx",
                'import { FunnelChartCard } from "@/components/application/dashboard/funnel-chart-card";\n\n<FunnelChartCard />',
                "FunnelChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="heatmap-chart-card",
        title="热力图",
        desc="活跃热力卡片。",
        preview="pro",
        embeds=["HeatmapChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "适合运营周报。",
                "heatmap-chart-card-embed.tsx",
                'import { HeatmapChartCard } from "@/components/application/dashboard/heatmap-chart-card";\n\n<HeatmapChartCard />',
                "HeatmapChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="radar-chart-card",
        title="雷达图",
        desc="多维雷达卡片。",
        preview="pro",
        embeds=["RadarChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "雷达图卡片。",
                "radar-chart-card-embed.tsx",
                'import { RadarChartCard } from "@/components/application/dashboard/radar-chart-card";\n\n<RadarChartCard />',
                "RadarChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="radial-chart-card",
        title="径向图",
        desc="径向进度卡片。",
        preview="pro",
        embeds=["RadialChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "径向进度。",
                "radial-chart-card-embed.tsx",
                'import { RadialChartCard } from "@/components/application/dashboard/radial-chart-card";\n\n<RadialChartCard />',
                "RadialChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="scatter-chart-card",
        title="散点图",
        desc="散点分布卡片。",
        preview="pro",
        embeds=["ScatterChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "散点关系。",
                "scatter-chart-card-embed.tsx",
                'import { ScatterChartCard } from "@/components/application/dashboard/scatter-chart-card";\n\n<ScatterChartCard />',
                "ScatterChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="sankey-chart-card",
        title="桑基图",
        desc="流向桑基卡片。",
        preview="pro",
        embeds=["SankeyChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "桑基流量。",
                "sankey-chart-card-embed.tsx",
                'import { SankeyChartCard } from "@/components/application/dashboard/sankey-chart-card";\n\n<SankeyChartCard />',
                "SankeyChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="combo-chart-card",
        title="组合图",
        desc="柱线组合卡片。",
        preview="pro",
        embeds=["ComboChartEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "柱线叠加。",
                "combo-chart-card-embed.tsx",
                'import { ComboChartCard } from "@/components/application/dashboard/combo-chart-card";\n\n<ComboChartCard />',
                "ComboChartEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="activity-rings-card",
        title="活动圆环",
        desc="活动圆环卡片。",
        preview="pro",
        embeds=["ActivityRingsEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "健康看板。",
                "activity-rings-card-embed.tsx",
                'import { ActivityRingsCard } from "@/components/application/dashboard/activity-rings-card";\n\n<ActivityRingsCard />',
                "ActivityRingsEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="bar-list-card",
        title="条形列表",
        desc="排行条形列表。",
        preview="pro",
        embeds=["BarListEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "条形列表。",
                "bar-list-card-embed.tsx",
                'import { BarListCard } from "@/components/application/dashboard/bar-list-card";\n\n<BarListCard />',
                "BarListEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="contributions-card",
        title="贡献日历",
        desc="贡献热力日历。",
        preview="pro",
        embeds=["ContributionsEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "GitHub 风格贡献热力。",
                "contributions-card-embed.tsx",
                'import { ContributionsCard } from "@/components/application/dashboard/contributions-card";\n\n<ContributionsCard />',
                "ContributionsEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="most-active-days-card",
        title="最活跃日",
        desc="周内活跃分布。",
        preview="pro",
        embeds=["MostActiveDaysEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "周内活跃分布。",
                "most-active-days-card-embed.tsx",
                'import { MostActiveDaysCard } from "@/components/application/dashboard/most-active-days-card";\n\n<MostActiveDaysCard />',
                "MostActiveDaysEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="sleep-score-card",
        title="睡眠评分",
        desc="睡眠评分卡片。",
        preview="pro",
        embeds=["SleepScoreEmbed", "HealthPair"],
        sections=[
            (
                "仪表盘嵌入",
                "健康 KPI。",
                "sleep-score-card-embed.tsx",
                'import { SleepScoreCard } from "@/components/application/dashboard/sleep-score-card";\n\n<SleepScoreCard />',
                "SleepScoreEmbed",
                "primary",
            ),
            (
                "与步数并排",
                "健康看板常见组合。",
                "health-pair.tsx",
                'import { StepsCard } from "@/components/application/dashboard/steps-card";\nimport { SleepScoreCard } from "@/components/application/dashboard/sleep-score-card";\n\n<>\n  <StepsCard />\n  <SleepScoreCard />\n</>',
                "HealthPair",
                "secondary",
            ),
        ],
    ),
    dict(
        slug="stage-bars-card",
        title="阶段条",
        desc="阶段占比条。",
        preview="pro",
        embeds=["StageBarsEmbed"],
        sections=[
            (
                "仪表盘嵌入",
                "漏斗阶段占比。",
                "stage-bars-card-embed.tsx",
                'import { StageBarsCard } from "@/components/application/dashboard/stage-bars-card";\n\n<StageBarsCard />',
                "StageBarsEmbed",
                "primary",
            )
        ],
    ),
    dict(
        slug="steps-card",
        title="步数",
        desc="步数统计卡片。",
        preview="pro",
        embeds=["StepsCardEmbed", "HealthPair"],
        sections=[
            (
                "仪表盘嵌入",
                "可与睡眠卡并排。",
                "steps-card-embed.tsx",
                'import { StepsCard } from "@/components/application/dashboard/steps-card";\n\n<StepsCard />',
                "StepsCardEmbed",
                "primary",
            ),
            (
                "与睡眠并排",
                "健康看板常见组合。",
                "steps-sleep-pair.tsx",
                'import { StepsCard } from "@/components/application/dashboard/steps-card";\nimport { SleepScoreCard } from "@/components/application/dashboard/sleep-score-card";\n\n<>\n  <StepsCard />\n  <SleepScoreCard />\n</>',
                "HealthPair",
                "secondary",
            ),
        ],
    ),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


for c in charts:
    imports = ",\n".join(f"  {e}" for e in c["embeds"])
    if c["preview"] == "pro":
        preview = f'<ProComponentDoc slug="{c["slug"]}" name="{c["title"]}" />'
    else:
        preview = f'<ComponentDocPreview slug="{c["slug"]}" />'
    sections = []
    for title, hint, file, code, comp, bg in c["sections"]:
        bgcls = (
            "bg-background-primary-default"
            if bg == "primary"
            else "bg-background-secondary-default"
        )
        sections.append(
            f"""## {title}

{hint}

<DemoFrame
  fileName="{file}"
  code={{`{esc(code)}`}}
  canvasClassName="min-h-40 items-center justify-center {bgcls} p-6"
>
  <{comp} />
</DemoFrame>"""
        )
    body = "\n\n".join(sections)
    text = f"""---
title: "{c['title']}"
description: "{c['desc']}"
---
import {{ ComponentDocPreview, ProComponentDoc }} from "@/components/demos/component-doc-preview";
import {{
{imports}
}} from "@/components/demos/chart-card-docs";
import {{ DocApiSection }} from "@/components/docs-api-section";
import {{ DemoFrame }} from "@/components/demos/sandpack-preview";

{c['desc']}

{preview}

## 安装

```bash
npx @joyui/cli add {c['slug']} --yes
```

或通过 JoyUI MCP / CLI 安装。

{body}

## API

<DocApiSection slug="{c['slug']}" />
"""
    (docs / f"{c['slug']}.mdx").write_text(text, encoding="utf-8")
    print("ok", c["slug"])

stat = r'''---
title: "指标卡片"
description: "带增减芯片的 KPI 统计卡行。"
---
import { ComponentDocPreview } from "@/components/demos/component-doc-preview";
import {
  StatCardsDashboardScenario,
  StatCardsFooterPreview,
  StatCardsPlainPreview,
} from "@/components/demos/stat-cards-docs";
import { DocApiSection } from "@/components/docs-api-section";
import { DemoFrame } from "@/components/demos/sandpack-preview";

带增减芯片的 KPI 统计卡行。`Stat` 仅需 `label` + `value`；`icon` / `delta` / `deltaColor` 均可选。

<ComponentDocPreview slug="stat-cards" />

## 安装

```bash
npx @joyui/cli add stat-cards --yes
```

或通过 JoyUI MCP / CLI 安装。

## 朴素变体

`variant="plain"`，可传自定义 `stats`。

<DemoFrame
  fileName="stat-cards-plain.tsx"
  code={`import { StatCards } from "@/components/application/dashboard/stat-cards";

<StatCards
  variant="plain"
  columns={2}
  stats={[
    { label: "任务", value: "128", delta: "+8.2%", deltaColor: "lime" },
    { label: "已保存", value: "42", delta: "+12%", deltaColor: "lime" },
  ]}
/>`}
  canvasClassName="min-h-40 items-center justify-center bg-background-primary-default p-6"
>
  <StatCardsPlainPreview />
</DemoFrame>

## 页脚变体

`variant="footer"`：大数字 + 底部对比带。

<DemoFrame
  fileName="stat-cards-footer.tsx"
  code={`import { StatCards } from "@/components/application/dashboard/stat-cards";

<StatCards variant="footer" columns={2} count={2} />`}
  canvasClassName="min-h-40 items-center justify-center bg-background-primary-default p-6"
>
  <StatCardsFooterPreview />
</DemoFrame>

## 应用场景

仪表盘 KPI 区。

<DemoFrame
  fileName="stat-cards-dashboard.tsx"
  code={`<StatCards variant="plain" columns={2} stats={stats} />`}
  canvasClassName="min-h-40 items-center justify-center bg-background-secondary-default p-6"
>
  <StatCardsDashboardScenario />
</DemoFrame>

## API

<DocApiSection slug="stat-cards" />
'''
(docs / "stat-cards.mdx").write_text(stat, encoding="utf-8")
print("ok stat-cards")
