import { useState } from "react";
import { useDashboard } from "../hooks/useDashboardWs";

const BUY_THRESHOLD = 5;
const SELL_THRESHOLD = -5;

function getSignal(pct) {
  if (pct >= BUY_THRESHOLD) return "BUY";
  if (pct <= SELL_THRESHOLD) return "SELL";
  return "HOLD";
}

function formatPrice(n) {
  return n.toLocaleString();
}

function formatPct(n) {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function formatListDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SignalBadge({ pct }) {
  const signal = getSignal(pct);
  const styles = {
    BUY: "bg-green-500/10 text-green-400 border border-green-500/20",
    SELL: "bg-red-500/10 text-red-400 border border-red-500/20",
    HOLD: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <span
      className={`font-mono text-[10px] px-2 py-0.5 rounded ${styles[signal]}`}
    >
      {signal}
    </span>
  );
}

function PctLabel({ value }) {
  const color =
    value > 0
      ? "text-green-400"
      : value < 0
        ? "text-red-400"
        : "text-amber-400";
  return (
    <span className={`font-mono text-sm font-medium ${color}`}>
      {formatPct(value)}
    </span>
  );
}

function MetricCard({ label, value, valueClass = "" }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1">
        {label}
      </div>
      <div className={`text-xl font-medium font-mono ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function ProjectionsPanel({ projections }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5 flex flex-col">
      <div className="text-[11px] uppercase tracking-widest text-white/40 font-mono mb-3">
        Projected Prices · 7d
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
        {projections.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <div>
              <div className="text-sm font-medium text-white">{item.name}</div>
              <div className="text-[11px] font-mono text-white/40">
                Current: {formatPrice(item.currentPrice)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <PctLabel value={item.projectedPct} />
              <SignalBadge pct={item.projectedPct} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const impactColors = {
    "Very High": "bg-red-500/10 text-red-400 border-red-500/25",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Low: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    None: "bg-white/5 text-white/40 border-white/10",
  };

  return (
    <div className="bg-teal-400/[0.06] border border-teal-400/20 rounded-xl p-5">
      <div className="text-[11px] uppercase tracking-widest text-teal-400/60 font-mono mb-2">
        Highest Impact Event
      </div>
      <div className="text-sm font-semibold text-white mb-3">{event.name}</div>
      <div className="flex gap-2 flex-wrap mb-4">
        <span
          className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${impactColors[event.impactLevel] ?? impactColors["None"]}`}
        >
          {event.impactLevel} Impact
        </span>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white/50">
          Lists {formatListDate(event.expectedListDate)}
        </span>
      </div>
      <div className="text-[11px] font-mono text-white/30 mb-2">
        Primary drops
      </div>
      <div className="flex flex-col gap-1.5">
        {event.drops.map((drop) => (
          <div key={drop.itemName} className="flex justify-between text-xs">
            <span className="text-white/50">{drop.itemName}</span>
            <span className="font-mono text-white/80">
              × {drop.quantity.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoversPanel({ biggestMovers, smallestMovers }) {
  const [tab, setTab] = useState("big");
  const movers = tab === "big" ? biggestMovers : smallestMovers;

  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-widest text-white/40 font-mono">
          Movers
        </div>
        <div className="flex gap-1.5">
          {["big", "small"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
                tab === t
                  ? "border-teal-400/40 text-teal-400 bg-teal-400/[0.08]"
                  : "border-white/10 text-white/40 hover:text-white/60"
              }`}
            >
              {t === "big" ? "Biggest" : "Smallest"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {movers.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2.5">
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{item.name}</div>
              <div className="text-[11px] font-mono text-white/40">
                {formatPrice(item.currentPrice)} silver
              </div>
            </div>
            <PctLabel value={item.changePct} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, connected, error } = useDashboard();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40 font-mono text-sm">
        Loading dashboard...
      </div>
    );
  }

  const {
    metrics,
    projections,
    biggestMovers,
    smallestMovers,
    highestImpactEvent,
  } = data;

  return (
    <div className="min-h-screen bg-[#0a1018] px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-400 mb-1">
            Garmoth Market
          </div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400" : "bg-white/20"}`}
          />
          <span className="text-[11px] font-mono text-white/30">
            {connected ? "Live" : "Stub data"}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5">
        <MetricCard label="Items Tracked" value={metrics.itemsTracked} />
        <MetricCard
          label="Active Events"
          value={metrics.activeEvents}
          valueClass="text-teal-400"
        />
        <MetricCard
          label="Avg 7d Change"
          value={formatPct(metrics.avgSevenDayChange)}
          valueClass={
            metrics.avgSevenDayChange >= 0 ? "text-green-400" : "text-red-400"
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProjectionsPanel projections={projections} />

        <div className="flex flex-col gap-4">
          <EventCard event={highestImpactEvent} />
          <MoversPanel
            biggestMovers={biggestMovers}
            smallestMovers={smallestMovers}
          />
        </div>
      </div>
    </div>
  );
}
