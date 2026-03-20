import { useState } from "react";

const CATEGORIES = [
  { label: "All", icon: null },
  { label: "Enhancements", icon: "⬆" },
  { label: "Weapons", icon: "⚔" },
  { label: "Armors", icon: "🛡" },
  { label: "Accessories", icon: "💍" },
  { label: "Cooking", icon: "🍳" },
  { label: "Alchemy", icon: "⚗" },
  { label: "Consumables", icon: "🧪" },
  { label: "Mount Items", icon: "🐴" },
  { label: "Furniture", icon: "🪑" },
  { label: "Crystals", icon: "💎" },
  { label: "Dye", icon: "🎨" },
  { label: "Fish", icon: "🐟" },
  { label: "Trade Goods", icon: "📦" },
  { label: "Rare Drops", icon: "✨" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.label, c.icon]));

const EVENTS = [
  {
    id: 1,
    name: "Caphras Moon Festival",
    status: "active",
    impact: "High",
    timeLeft: "2d 14h",
    started: "3 days ago",
    description:
      "Caphras stone drop rates tripled. Enhancement chance buffs active across all tiers. Market flooded with cheap stones.",
    categories: ["Enhancements", "Weapons", "Armors"],
    boosts: { Enhancements: "High", Weapons: "Medium", Armors: "Medium" },
  },
  {
    id: 2,
    name: "Guild Boss Invasion",
    status: "active",
    impact: "High",
    timeLeft: "18h 02m",
    started: "6 hours ago",
    description:
      "World bosses drop rare accessories and weapon upgrade materials. High player activity driving accessory demand.",
    categories: ["Accessories", "Weapons", "Consumables"],
    boosts: { Accessories: "High", Weapons: "Medium", Consumables: "High" },
  },
  {
    id: 3,
    name: "Alchemist's Gathering",
    status: "active",
    impact: "Medium",
    timeLeft: "4d 07h",
    started: "1 day ago",
    description:
      "Rare reagent gather rates increased. Alchemy mastery XP doubled. Cooking byproducts mildly elevated.",
    categories: ["Alchemy", "Cooking"],
    boosts: { Alchemy: "Medium", Cooking: "Low" },
  },
  {
    id: 4,
    name: "Soldier's Rest Day",
    status: "active",
    impact: "Low",
    timeLeft: "9h 45m",
    started: "14 hours ago",
    description:
      "Minor HP potion drop buff active. Attendance rewards include basic consumable bundles.",
    categories: ["Consumables"],
    boosts: { Consumables: "Low" },
  },
  {
    id: 5,
    name: "Marni's Twisted Space",
    status: "active",
    impact: "Medium",
    timeLeft: "1d 22h",
    started: "2 days ago",
    description:
      "Grinding spots yield extra black stone drops. Weapon and armor upgrade stones seeing price pressure.",
    categories: ["Weapons", "Armors", "Enhancements"],
    boosts: { Weapons: "Medium", Armors: "Medium", Enhancements: "Medium" },
  },
  {
    id: 6,
    name: "Cook-off Championship",
    status: "ending",
    impact: "Medium",
    timeLeft: "2h 11m",
    started: "5 days ago",
    description:
      "Cooking ingredient demand peaked. Imperial cooking boxes at max output. Expect price correction on expiry.",
    categories: ["Cooking", "Consumables"],
    boosts: { Cooking: "High", Consumables: "Medium" },
  },
  {
    id: 7,
    name: "Ancient Relic Hunt",
    status: "ending",
    impact: "High",
    timeLeft: "0h 48m",
    started: "6 days ago",
    description:
      "Relic scroll market surged. Accessory demand near all-time high. Winding down fast.",
    categories: ["Accessories", "Consumables", "Enhancements"],
    boosts: { Accessories: "High", Consumables: "High", Enhancements: "High" },
  },
  {
    id: 8,
    name: "Crystal Convergence",
    status: "active",
    impact: "Medium",
    timeLeft: "3d 05h",
    started: "12 hours ago",
    description:
      "Crystal drop rates up across all zones. Socket crystal demand spiking with player re-gearing.",
    categories: ["Crystals", "Accessories"],
    boosts: { Crystals: "High", Accessories: "Low" },
  },
  {
    id: 9,
    name: "Trade Empire Week",
    status: "active",
    impact: "Low",
    timeLeft: "5d 18h",
    started: "1 day ago",
    description:
      "Trade good prices boosted across all routes. Fish market seeing secondary spillover.",
    categories: ["Trade Goods", "Fish"],
    boosts: { "Trade Goods": "Medium", Fish: "Low" },
  },
];

const IMPACT = {
  High: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dot: "bg-red-400",
    bar: "from-red-400/50 to-red-400",
  },
  Medium: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    dot: "bg-amber-400",
    bar: "from-amber-400/50 to-amber-400",
  },
  Low: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/25",
    dot: "bg-green-400",
    bar: "from-green-400/50 to-green-400",
  },
};

const STATUS = {
  active: { label: "Active", color: "text-teal-400", pulse: "bg-teal-400" },
  ending: { label: "Ending", color: "text-orange-400", pulse: "bg-orange-400" },
};

function DetailPanel({ event, onClose }) {
  const imp = IMPACT[event.impact];
  const sta = STATUS[event.status];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-teal-400/25 bg-[#0a1018] shadow-[0_0_0_1px_rgba(45,212,191,0.08),0_24px_64px_rgba(0,0,0,0.6)]">
      <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

      <div className="border-b border-white/[0.07] bg-[#0f1622] px-4 py-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full animate-pulse ${sta.pulse}`}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-widest ${sta.color}`}
            >
              {sta.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded border border-white/[0.07] text-[11px] text-slate-500 transition hover:border-white/20 hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <h2 className="text-[13px] font-extrabold tracking-tight text-slate-100">
          {event.name}
        </h2>
        <p className="mt-0.5 font-mono text-[10px] text-slate-600">
          Started {event.started} · {event.timeLeft} left
        </p>
      </div>

      <div className="overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Market Impact
          </span>
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${imp.color} ${imp.bg} ${imp.border}`}
          >
            {event.impact}
          </span>
        </div>

        <p className="mb-4 text-[12px] leading-relaxed text-slate-400">
          {event.description}
        </p>

        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
          Category Breakdown
        </p>
        <div className="flex flex-col gap-2">
          {event.categories.map((cat) => {
            const boost = event.boosts[cat];
            const boostCfg = {
              Low: {
                color: "text-green-400",
                bg: "bg-green-400/10",
                border: "border-green-400/25",
                bar: "from-green-400/50 to-green-400",
                width: "33%",
              },
              Medium: {
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "border-amber-400/25",
                bar: "from-amber-400/50 to-amber-400",
                width: "66%",
              },
              High: {
                color: "text-red-400",
                bg: "bg-red-400/10",
                border: "border-red-400/25",
                bar: "from-red-400/50 to-red-400",
                width: "100%",
              },
            }[boost] ?? {
              color: "text-slate-400",
              bg: "",
              border: "border-white/[0.05]",
              bar: "from-slate-400/50 to-slate-400",
              width: "0%",
            };
            return (
              <div
                key={cat}
                className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">{CAT_MAP[cat] ?? "◈"}</span>
                    <span className="text-[11px] font-bold text-slate-300">
                      {cat}
                    </span>
                  </div>
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${boostCfg.color} ${boostCfg.bg} ${boostCfg.border}`}
                  >
                    {boost}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${boostCfg.bar}`}
                    style={{ width: boostCfg.width }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {event.status === "ending" && (
          <div className="mt-3 rounded-lg border border-orange-400/20 bg-orange-400/[0.06] px-3 py-2">
            <p className="font-mono text-[10px] text-orange-400">
              ⚠ Ending in {event.timeLeft} — expect market correction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsDashboard() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedImpact, setSelectedImpact] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = EVENTS.filter((e) => {
    const catMatch =
      selectedCat === "All" || e.categories.includes(selectedCat);
    const impactMatch = selectedImpact === "All" || e.impact === selectedImpact;
    return catMatch && impactMatch;
  });

  const highCount = EVENTS.filter((e) => e.impact === "High").length;
  const endingCount = EVENTS.filter((e) => e.status === "ending").length;

  return (
    <div
      className="min-h-screen w-full bg-[#060a10]"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(45,212,191,0.2); border-radius: 2px; }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600">
              Market Intelligence
            </p>
            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-100">
              Active Events
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#0a1018] px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
              <span className="font-mono text-[10px] text-slate-400">
                <span className="text-slate-200">{EVENTS.length}</span> live
              </span>
            </div>
            <div className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-2.5 py-1.5">
              <span className="font-mono text-[10px] text-red-400">
                <span className="font-medium">{highCount}</span> high
              </span>
            </div>
            <div className="rounded-lg border border-orange-400/20 bg-orange-400/[0.06] px-2.5 py-1.5">
              <span className="font-mono text-[10px] text-orange-400 animate-pulse">
                <span className="font-medium">{endingCount}</span> ending
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable category bar */}
        <div className="cat-scroll mb-2 flex items-center gap-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#0a0e14]/80 px-1.5 py-1.5">
          {CATEGORIES.map(({ label, icon }) => {
            const isActive = selectedCat === label;
            return (
              <button
                key={label}
                onClick={() => setSelectedCat(label)}
                className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-all duration-150 whitespace-nowrap
                  ${
                    isActive
                      ? "border border-teal-400/30 bg-teal-400/10 text-teal-400"
                      : "border border-transparent text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                  }`}
              >
                {icon && <span>{icon}</span>}
                {label}
              </button>
            );
          })}
        </div>

        {/* Impact filter row */}
        <div className="mb-5 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
            Impact
          </span>
          <div className="flex items-center gap-1">
            {["All", "High", "Medium", "Low"].map((lvl) => {
              const cfg = lvl !== "All" ? IMPACT[lvl] : null;
              const isActive = selectedImpact === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedImpact(lvl)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-all duration-150
                    ${isActive && cfg ? `border ${cfg.border} ${cfg.bg} ${cfg.color}` : ""}
                    ${isActive && !cfg ? "border border-teal-400/30 bg-teal-400/10 text-teal-400" : ""}
                    ${!isActive ? "border border-white/[0.07] bg-white/[0.02] text-slate-500 hover:text-slate-300" : ""}
                  `}
                >
                  {cfg && (
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`}
                    />
                  )}
                  {lvl}
                </button>
              );
            })}
          </div>
          <span className="ml-auto font-mono text-[10px] text-slate-600">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Event list */}
          <div className="flex flex-1 flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-[#0a1018] py-14">
                <p className="font-mono text-[11px] text-slate-600">
                  No events match your filters
                </p>
              </div>
            ) : (
              filtered.map((event) => {
                const imp = IMPACT[event.impact];
                const sta = STATUS[event.status];
                const isSelected = selectedEvent?.id === event.id;
                const isEnding = event.status === "ending";

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(isSelected ? null : event)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-[#0a1018] transition-all duration-150
                      ${
                        isSelected
                          ? "border-teal-400/35 shadow-[0_0_0_1px_rgba(45,212,191,0.08),0_4px_20px_rgba(0,0,0,0.4)]"
                          : "border-white/[0.07] hover:border-white/[0.12]"
                      }`}
                  >
                    {/* Top accent line */}
                    <div
                      className={`h-px w-full bg-gradient-to-r from-transparent to-transparent ${isEnding ? "via-orange-400 animate-pulse" : isSelected ? "via-teal-400" : "via-white/[0.06]"}`}
                    />

                    <div className="flex items-center gap-3 px-4 py-3">
                      {/* Pulse dot */}
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full animate-pulse ${sta.pulse}`}
                      />

                      {/* Name + categories */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="truncate text-[13px] font-bold text-slate-200">
                            {event.name}
                          </p>
                          {isEnding && (
                            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-orange-400">
                              ⚠ ending
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {event.categories.map((cat) => (
                            <span
                              key={cat}
                              className="flex items-center gap-1 rounded border border-white/[0.05] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-slate-500"
                            >
                              {CAT_MAP[cat] ?? "◈"} {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Impact + time */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${imp.color} ${imp.bg} ${imp.border}`}
                        >
                          {event.impact}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600">
                          {event.timeLeft}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail panel */}
          {selectedEvent && (
            <div className="w-64 shrink-0">
              <div className="sticky top-4">
                <DetailPanel
                  event={selectedEvent}
                  onClose={() => setSelectedEvent(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
