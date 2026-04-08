const IMPACT_ORDER = { High: 4, Medium: 3, Low: 2, None: 1 };

const IMPACT_STYLES = {
  High: {
    border: "border-l-red-500",
    badge: "border-red-500 text-red-500 bg-red-500/10",
    valueColor: "text-red-400",
  },
  Medium: {
    border: "border-l-amber-400",
    badge: "border-amber-400 text-amber-400 bg-amber-400/10",
    valueColor: "text-amber-400",
  },
  Low: {
    border: "border-l-blue-400",
    badge: "border-blue-400 text-blue-400 bg-blue-400/10",
    valueColor: "text-blue-400",
  },
  None: {
    border: "border-l-slate-600",
    badge: "border-slate-600 text-slate-500 bg-slate-600/10",
    valueColor: "text-slate-400",
  },
};

function getDaysRemaining(end_date) {
  const now = new Date();
  const end = new Date(end_date.replace(/-/g, "/"));
  const diffMs = end - now;
  if (diffMs <= 0) return "Ended";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

function getWorstDrop(items = []) {
  if (!items.length) return null;
  return items.reduce(
    (worst, item) =>
      (item.pct_diff ?? 0) < (worst.pct_diff ?? 0) ? item : worst,
    items[0],
  );
}

export default function DashboardHero({ event_info = {} }) {
  const events = Object.values(event_info);
  if (!events.length) return null;

  const sorted = [...events].sort(
    (a, b) => (IMPACT_ORDER[b.impact] ?? 0) - (IMPACT_ORDER[a.impact] ?? 0),
  );

  const hero = sorted[0];
  const rest = sorted.slice(1);
  const heroStyle = IMPACT_STYLES[hero.impact] ?? IMPACT_STYLES.None;
  const heroItems = hero.direct_items?.items ?? [];
  const worstDrop = getWorstDrop(heroItems);

  return (
    <div className="px-6 pt-4 pb-2 ">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 opacity-70 mb-3">
        // market pulse
      </p>

      {/* Hero card */}
      <div
        className={`bg-[#0d1520] border border-[#1a2a3a] border-l-2 ${heroStyle.border} rounded-sm p-5 mb-3`}
      >
        <div className="flex justify-between items-start gap-3 mb-1">
          <span className="font-bold text-[#e8f0f8] text-base leading-snug tracking-wide">
            {hero.event}
          </span>
          <span
            className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${heroStyle.badge}`}
          >
            {hero.impact} Impact
          </span>
        </div>

        <p className="font-mono text-[11px] text-[#4a6070] mb-4">
          {hero.start_date} <span className="text-[#2a3a4a]">→</span>{" "}
          {hero.end_date}
        </p>

        <div className="grid grid-cols-3 gap-3 w-fit">
          <div className="bg-blue-400/2 border border-[#1a2a3a] rounded-sm p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700 mb-1">
              Days Remaining
            </p>
            <p
              className={`font-mono text-xl font-medium ${heroStyle.valueColor}`}
            >
              {getDaysRemaining(hero.end_date)}
            </p>
            <p className="font-mono text-[10px] text-[#2d6b54] mt-1">
              ends {hero.end_date}
            </p>
          </div>

          <div className="bg-blue-400/2 border border-[#1a2a3a] rounded-sm p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700 mb-1">
              Direct Items
            </p>
            <p className="font-mono text-xl font-medium text-[#e2f5ef]">
              {heroItems.length}
            </p>
            <p className="font-mono text-[10px] text-[#2d6b54] mt-1">
              tracked items
            </p>
          </div>

          <div className="bg-blue-400/2 border border-[#1a2a3a] rounded-sm p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-teal-700 mb-1">
              Worst Drop
            </p>
            <p className="font-mono text-xl font-medium text-red-400">
              {worstDrop ? `${worstDrop.pct_diff?.toFixed(2)}%` : "—"}
            </p>
            <p className="font-mono text-[10px] text-[#2d6b54] mt-1 truncate">
              {worstDrop?.name ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary events */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {rest.map((ev) => {
            const s = IMPACT_STYLES[ev.impact] ?? IMPACT_STYLES.None;
            return (
              <div
                key={ev.event}
                className={`bg-[#0d1520] border border-[#1a2a3a] border-l-2 ${s.border} rounded-sm px-4 py-3 flex justify-between items-center`}
              >
                <div>
                  <p className="font-bold text-[#9fb8c8] text-sm leading-snug tracking-wide mb-1 truncate max-w-[200px]">
                    {ev.event}
                  </p>
                  <p className="font-mono text-[10px] text-[#2d6b54]">
                    {ev.start_date} → {ev.end_date}
                  </p>
                </div>
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${s.badge}`}
                >
                  {ev.impact}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
