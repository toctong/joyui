"use client";

import { StatCards } from "@/components/application/dashboard/stat-cards";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";

export function HeroShowcase() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-16 sm:px-6 lg:px-8">
      <StatCards variant="footer" />
      <RevenueChartCard />
    </div>
  );
}
