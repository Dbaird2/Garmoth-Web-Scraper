"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Gem,
  Swords,
  Package,
  Sparkles,
  Calendar,
  Timer,
  Coins,
  BarChart3,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// ===== UTILITY =====
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ===== DATA =====
const stats = [
  {
    label: "Portfolio Value",
    value: "48.7B",
    change: "+2.3B",
    positive: true,
    icon: Gem,
  },
  {
    label: "Items in Stock",
    value: "127",
    change: "+12",
    positive: true,
    icon: Package,
  },
  {
    label: "Unrealized Gains",
    value: "+8.4B",
    change: "+1.2B",
    positive: true,
    icon: Coins,
  },
  {
    label: "Weekly ROI",
    value: "+14.2%",
    change: "+3.1%",
    positive: true,
    icon: BarChart3,
  },
];

const myInvestments = [
  {
    item: "Tungrad Earring",
    qty: 24,
    avgBuy: "1.8B",
    currentPrice: "2.1B",
    profit: "+7.2B",
    profitPct: "+16.7%",
    predicted: "+22.4%",
  },
  {
    item: "Caphras Stone",
    qty: 8420,
    avgBuy: "2.9M",
    currentPrice: "3.2M",
    profit: "+2.5B",
    profitPct: "+10.3%",
    predicted: "+15.8%",
  },
  {
    item: "Memory Fragment",
    qty: 12840,
    avgBuy: "2.4M",
    currentPrice: "2.8M",
    profit: "+5.1B",
    profitPct: "+16.7%",
    predicted: "+12.1%",
  },
  {
    item: "Distortion Earring",
    qty: 6,
    avgBuy: "3.2B",
    currentPrice: "3.8B",
    profit: "+3.6B",
    profitPct: "+18.8%",
    predicted: "+24.5%",
  },
  {
    item: "Black Magic Crystal",
    qty: 84,
    avgBuy: "42M",
    currentPrice: "48M",
    profit: "+504M",
    profitPct: "+14.3%",
    predicted: "+18.9%",
  },
];

const topGainers = [
  {
    item: "Tungrad Earring",
    category: "Accessory",
    current: "+24.8%",
    predicted: "+18.2%",
    price: "2.1B",
  },
  {
    item: "Distortion Earring",
    category: "Accessory",
    current: "+19.3%",
    predicted: "+12.5%",
    price: "3.8B",
  },
  {
    item: "Caphras Stone",
    category: "Enhancement",
    current: "+15.7%",
    predicted: "+9.8%",
    price: "3.2M",
  },
  {
    item: "Memory Fragment",
    category: "Enhancement",
    current: "+12.4%",
    predicted: "+7.1%",
    price: "2.8M",
  },
  {
    item: "Black Magic Crystal",
    category: "Crystal",
    current: "+9.6%",
    predicted: "+5.4%",
    price: "48M",
  },
];

const topLosers = [
  {
    item: "Supreme Cooking Utensil",
    category: "Lifeskill",
    current: "-18.2%",
    predicted: "-12.4%",
    price: "2.4M",
  },
  {
    item: "Mass of Pure Magic",
    category: "Material",
    current: "-14.7%",
    predicted: "-9.8%",
    price: "890K",
  },
  {
    item: "Manos Butcher Knife",
    category: "Lifeskill",
    current: "-11.3%",
    predicted: "-7.2%",
    price: "1.2B",
  },
  {
    item: "Ancient Spirit Dust",
    category: "Material",
    current: "-8.9%",
    predicted: "-5.6%",
    price: "15M",
  },
  {
    item: "TRI: Blackstar Mainhand",
    category: "Weapon",
    current: "-6.4%",
    predicted: "-3.8%",
    price: "8.7B",
  },
];

const portfolioHistory = [
  { day: "Mon", value: 42100 },
  { day: "Tue", value: 43800 },
  { day: "Wed", value: 44200 },
  { day: "Thu", value: 45900 },
  { day: "Fri", value: 46500 },
  { day: "Sat", value: 47200 },
  { day: "Sun", value: 48700 },
];

const impactEvent = {
  headline: "Fallen God Armor Materials Buffed in Upcoming Patch",
  summary:
    "Pearl Abyss confirmed increased Flame of Despair drop rates from world bosses starting next maintenance. Enhancement material demand expected to spike as players rush to upgrade before the changes.",
  impact: "High Impact",
  affected: [
    "Caphras Stone +15%",
    "Memory Fragment +12%",
    "Flame of Despair -8%",
  ],
  time: "3 hours ago",
};

const upcomingEvents = [
  {
    name: "Weekly Boss Reset",
    time: "2d 14h 32m",
    type: "reset",
    description: "World boss loot tables refresh",
  },
  {
    name: "Imperial Cooking Reset",
    time: "18h 45m",
    type: "reset",
    description: "Daily imperial delivery resets",
  },
  {
    name: "Patch Maintenance",
    time: "5d 8h",
    type: "maintenance",
    description: "v2847 balance changes",
  },
  {
    name: "Blackstar Event Ends",
    time: "12d 6h",
    type: "event",
    description: "Enhanced Blackstar rates expire",
  },
];

const watchlist = [
  {
    item: "PEN: Blackstar Mainhand",
    price: "78.4B",
    change: "+2.4%",
    predicted: "+5.8%",
    alert: true,
  },
  {
    item: "Vell's Heart",
    price: "3.2B",
    change: "-1.2%",
    predicted: "+8.4%",
    alert: false,
  },
  {
    item: "Flame of Despair",
    price: "890M",
    change: "-4.8%",
    predicted: "-12.4%",
    alert: true,
  },
  {
    item: "Dawn Earring",
    price: "4.1B",
    change: "+0.8%",
    predicted: "+3.2%",
    alert: false,
  },
];

// ===== PAGE =====
export default function DashboardPage() {
  return (
    <main
      className="min-h-screen p-6 md:p-10 bg-[#090e10]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Swords className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Market Investments
              </h1>
              <p className="text-sm text-muted-foreground">
                Black Desert Online — Portfolio Tracker
              </p>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const IconComponent = stat?.icon;
            return (
              <div
                key={stat?.label}
                className="rounded-2xl border border-border/50 bg-card p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat?.label}</p>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {stat?.value}
                </p>
                <div className="flex items-center gap-1.5">
                  {stat?.positive ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat?.positive ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {stat?.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Impact Event Banner */}
        <section className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wide">
                  {impactEvent?.impact}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {impactEvent?.time}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {impactEvent?.headline}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {impactEvent?.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {impactEvent?.affected.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Chart & Upcoming Events */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Value Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">
                  Portfolio Value
                </h3>
                <p className="text-sm text-muted-foreground">
                  7-day performance (in billions)
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">+6.6B this week</span>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="oklch(0.72 0.12 192)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.72 0.12 192)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.18 0 0)",
                      border: "1px solid oklch(0.28 0 0)",
                      borderRadius: "12px",
                      color: "oklch(0.95 0 0)",
                      padding: "12px",
                    }}
                    labelStyle={{
                      color: "oklch(0.6 0 0)",
                      marginBottom: "4px",
                    }}
                    formatter={(value) => [
                      `${(value / 1000).toFixed(1)}B Silver`,
                      "Value",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.72 0.12 192)"
                    strokeWidth={2.5}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Upcoming Events
                </h3>
                <p className="text-xs text-muted-foreground">
                  Resets and maintenance
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event?.name} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      event?.type === "reset"
                        ? "bg-primary/20"
                        : event?.type === "maintenance"
                          ? "bg-amber-500/20"
                          : "bg-emerald-500/20",
                    )}
                  >
                    <Timer
                      className={cn(
                        "h-4 w-4",
                        event?.type === "reset"
                          ? "text-primary"
                          : event?.type === "maintenance"
                            ? "text-amber-400"
                            : "text-emerald-400",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {event?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event?.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-primary flex-shrink-0">
                    {event?.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* My Investments Table */}
        <section className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">My Investments</h3>
              <p className="text-xs text-muted-foreground">
                Current holdings and predictions
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Item
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Qty
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Avg Buy
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Current
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Profit
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Predicted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {myInvestments.map((inv) => (
                  <tr
                    key={inv?.item}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-foreground">
                      {inv?.item}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground text-right">
                      {inv?.qty.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground text-right">
                      {inv?.avgBuy}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground text-right font-medium">
                      {inv?.currentPrice}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-bold text-emerald-400">
                        {inv?.profit}
                      </span>
                      <span className="text-xs text-emerald-400/70 ml-1">
                        ({inv?.profitPct})
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-primary text-right font-medium">
                      {inv?.predicted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Watchlist */}
        <section className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Watchlist</h3>
              <p className="text-xs text-muted-foreground">
                Items to buy when price is right
              </p>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {watchlist.map((item) => (
              <div
                key={item?.item}
                className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
              >
                {item?.alert && (
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                )}
                {!item?.alert && <div className="h-2 w-2 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {item?.item}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current: {item?.price}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      item?.change.startsWith("+")
                        ? "text-emerald-400"
                        : "text-red-400",
                    )}
                  >
                    {item?.change}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      item?.predicted.startsWith("+")
                        ? "text-primary"
                        : "text-red-400/70",
                    )}
                  >
                    Pred: {item?.predicted}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gainers & Losers Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Price Surging</h3>
                <p className="text-xs text-muted-foreground">
                  Highest gains today
                </p>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {topGainers.map((item, i) => (
                <div
                  key={item?.item}
                  className="p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item?.item}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item?.category} — {item?.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">
                      {item?.current}
                    </p>
                    <p className="text-xs text-primary">
                      Pred: {item?.predicted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Price Dropping
                </h3>
                <p className="text-xs text-muted-foreground">
                  Biggest drops today
                </p>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {topLosers.map((item, i) => (
                <div
                  key={item.item}
                  className="p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item.item}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category} — {item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">
                      {item.current}
                    </p>
                    <p className="text-xs text-red-400/70">
                      Pred: {item.predicted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-powered price predictions</span>
          </div>
          <span>Data refreshes every 60 minutes</span>
        </footer>
      </div>
    </main>
  );
}
