import { FadeIn } from "../hooks/FadeIn";

const THRESHOLD_ROWS = [
  {
    level: "None",
    range: "< 15.5%",
    color: "text-gray-400",
    badge: "border-gray-600 bg-gray-800/40 text-gray-400",
  },
  {
    level: "Low",
    range: "15.5% – 30%",
    color: "text-green-400",
    badge: "border-green-700 bg-green-900/40 text-green-400",
  },
  {
    level: "Medium",
    range: "30% – 50%",
    color: "text-amber-400",
    badge: "border-amber-700 bg-amber-900/40 text-amber-400",
  },
  {
    level: "High",
    range: "50%+",
    color: "text-red-400",
    badge: "border-red-700 bg-red-900/40 text-red-400",
  },
];

const STACK = [
  { label: "FastAPI", category: "Backend" },
  { label: "asyncpg", category: "Backend" },
  { label: "PostgreSQL", category: "Backend" },
  { label: "WebSockets", category: "Backend" },
  { label: "SlowAPI", category: "Backend" },
  { label: "React", category: "Frontend" },
  { label: "Vite", category: "Frontend" },
  { label: "Tailwind CSS", category: "Frontend" },
  { label: "TanStack Virtual", category: "Frontend" },
  { label: "Recharts", category: "Frontend" },
  { label: "Selenium", category: "Scraper" },
  { label: "httpx", category: "Scraper" },
];

const CATEGORY_COLORS = {
  Backend: "border-teal-700 bg-teal-900/30 text-teal-300",
  Frontend: "border-blue-700 bg-blue-900/30 text-blue-300",
  Scraper: "border-amber-700 bg-amber-900/30 text-amber-300",
};

export default function About() {
  return (
    <div
      className="min-h-screen text-[#c8d8e8]"
      style={{ background: "#0a1018", fontFamily: "'DM Mono', monospace" }}
    >
      <title>Event Tracker: About</title>

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <FadeIn delay={0}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-teal-400 font-mono">
              v1.0 · Black Desert Online
            </span>
          </div>
          <h1
            className="text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif", color: "#e8f4f8" }}
          >
            Event Analyzer
          </h1>
          <p className="text-[#6a8a9a] text-sm tracking-widest uppercase mb-10 font-mono">
            Market Intelligence · Event Impact Analysis
          </p>
        </FadeIn>

        {/* Divider */}
        <FadeIn delay={80}>
          <div className="h-px bg-gradient-to-r from-teal-500/40 via-teal-400/10 to-transparent mb-10" />
        </FadeIn>

        {/* Overview */}
        <FadeIn delay={150}>
          <section className="mb-14">
            <p className="text-[15px] leading-relaxed text-[#8aa8b8] mb-4">
              Event Analyzer is a full-stack market intelligence application for
              Black Desert Online. It tracks item prices across the in-game
              marketplace and analyzes the economic impact of game events —
              surfacing which items are meaningfully affected, by how much, and
              why.
            </p>
            <p className="text-[15px] leading-relaxed text-[#8aa8b8]">
              BDO runs limited-time events that reliably shift the in-game
              economy. Garmoth quantifies those shifts algorithmically:
              comparing current prices to a pre-event baseline, classifying the
              impact level, and delivering results in real time through a
              WebSocket-powered dashboard.
            </p>
          </section>
        </FadeIn>

        {/* Impact Analysis */}
        <FadeIn delay={220}>
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-teal-400 mb-6">
              Event Impact Analysis
            </h2>

            <div
              className="rounded-lg border border-[#1a2a3a] p-6 mb-6"
              style={{ background: "#0f1622" }}
            >
              <p className="text-[13px] text-[#6a8a9a] mb-1 uppercase tracking-widest">
                Baseline window
              </p>
              <p className="text-[15px] text-[#c8d8e8] mb-5">
                3–7 day pre-event average per item. Movements below the baseline
                window are treated as market noise.
              </p>

              <p className="text-[13px] text-[#6a8a9a] mb-3 uppercase tracking-widest">
                Impact thresholds
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {THRESHOLD_ROWS.map((row) => (
                  <div key={row.level} className="flex items-center gap-3">
                    <span
                      className={`text-[10px] tracking-widest uppercase font-mono border px-2 py-0.5 shrink-0 w-20 text-center ${row.badge}`}
                    >
                      {row.level}
                    </span>
                    <span className="text-[13px] text-[#6a8a9a] font-mono">
                      {row.range}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[13px] text-[#6a8a9a] leading-relaxed">
                The 15.5% floor is derived from BDO's in-game market tax — price
                movements below that threshold are economically
                indistinguishable from noise. Once an item reaches{" "}
                <span className="text-red-400">High</span>, that classification
                cannot be downgraded by subsequent recalculations.
              </p>
            </div>

            <div
              className="rounded-lg border border-[#1a2a3a] p-6"
              style={{ background: "#0f1622" }}
            >
              <p className="text-[13px] text-[#6a8a9a] mb-1 uppercase tracking-widest">
                Indirect market pressure
              </p>
              <p className="text-[15px] text-[#c8d8e8] mb-3">
                Beyond items explicitly tied to an event, Garmoth models
                second-order effects through a category side-effect mapping.
              </p>
              <p className="text-[13px] text-[#6a8a9a] leading-relaxed">
                For example: a costume event increases player enhancement
                activity, which drives demand for Sharp and Hard Black Crystal
                Shards — items not listed in the event at all. This indirect
                pressure is tracked separately and displayed alongside direct
                impact in the dashboard. Impact recalculation runs as an hourly
                background job; WebSocket endpoints only fetch and broadcast
                precomputed results.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={300}>
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-teal-400 mb-6">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span
                  key={item.label}
                  className={`text-[11px] tracking-wider uppercase font-mono border px-2.5 py-1 ${CATEGORY_COLORS[item.category]}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <div className="flex gap-5 mt-4">
              {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] border px-1.5 py-0.5 font-mono ${cls}`}
                  >
                    ■
                  </span>
                  <span className="text-[11px] text-[#6a8a9a] uppercase tracking-widest">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Divider */}
        <FadeIn delay={360}>
          <div className="h-px bg-gradient-to-r from-teal-500/40 via-teal-400/10 to-transparent mb-10" />
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={420}>
          <section className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://github.com/Dbaird2/Garmoth-Web-Scraper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-teal-700 bg-teal-900/20 text-teal-300 px-6 py-3 text-[12px] tracking-widest uppercase font-mono transition-all duration-150 hover:bg-teal-800/30 hover:border-teal-500 hover:-translate-y-px"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
            <a
              href="mailto:dasonbaird25@gmail.com"
              className="flex items-center justify-center gap-2 border border-[#1a2a3a] text-[#6a8a9a] px-6 py-3 text-[12px] tracking-widest uppercase font-mono transition-all duration-150 hover:border-[#2a3a4a] hover:text-[#8aa8b8] hover:-translate-y-px"
            >
              Contact
            </a>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
