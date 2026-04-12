import { useEffect } from "react";
import { FadeIn } from "../hooks/FadeIn";

const GOOGLE_SVG = (color = "#071210") => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill={color}
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      fill={color}
    />
    <path
      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z"
      fill={color}
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      fill={color}
    />
  </svg>
);

const AUTH_URL = "https://web-scraper-68z5.onrender.com/auth/google/login";

const FEATURES = [
  {
    title: "Real-time price tracking",
    desc: "Prices scraped and updated hourly. WebSocket connections push changes to your browser the moment they happen — no refresh needed.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Event impact analysis",
    desc: "Every in-game event is measured against a 21-day pre-event baseline. Items are classified across five impact tiers — from None to Very High.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Indirect market pressure",
    desc: "Models second-order effects. A costume event drives enhancement activity — Bartali flags the downstream items that move even when they're not in the event.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Investment tracker",
    desc: "Log purchase lots with date, quantity, and buy price. Track per-lot cost basis and monitor live PnL against current market prices — all in one view.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "ML price forecasting",
    desc: "An XGBoost model trained on historical price and stock data predicts 1–7 day price movements per item. Gets smarter as more data accumulates.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    title: "Discord alerts",
    desc: "Get pinged when an item drops 50%+ unexpectedly, or when event impact classifications update. Stay informed without watching the dashboard.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.5"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
];

const IMPACT_LEVELS = [
  { label: "None", range: "Below 15.5%", color: "#64748b", width: "5%" },
  { label: "Low", range: "15.5% – 49.9%", color: "#34d399", width: "30%" },
  { label: "Medium", range: "50% – 99.9%", color: "#fbbf24", width: "55%" },
  { label: "High", range: "100% – 199.9%", color: "#fb923c", width: "75%" },
  { label: "Very High", range: "200%+", color: "#f87171", width: "100%" },
];

const MOCK_ROWS = [
  {
    item: "Memory Fragment",
    price: "1.12M",
    change: "+38.4%",
    impact: "Very High",
    badge: "badge-vh",
    pos: true,
  },
  {
    item: "Sharp Black Crystal",
    price: "4.85B",
    change: "+22.1%",
    impact: "High",
    badge: "badge-hi",
    pos: true,
  },
  {
    item: "Caphra Stone",
    price: "890K",
    change: "+17.6%",
    impact: "High",
    badge: "badge-hi",
    pos: true,
  },
  {
    item: "Black Stone (Armor)",
    price: "218K",
    change: "+8.2%",
    impact: "Low",
    badge: "badge-lo",
    pos: true,
  },
  {
    item: "Essence of Dawn",
    price: "3.2B",
    change: "-2.1%",
    impact: "None",
    badge: "badge-no",
    pos: false,
  },
];
export default function Landing() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;700;800&display=swap');

        :root {
          --bg: #07090f;
          --surface: #0d1220;
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(45,212,191,0.25);
          --teal: #2dd4bf;
          --teal-dim: rgba(45,212,191,0.12);
          --text: #e2eaf2;
          --muted: #4a6070;
          --muted2: #6a8898;
          --green: #34d399;
          --red: #f87171;
          --amber: #fbbf24;
        }

        .landing * { box-sizing: border-box; margin: 0; padding: 0; }
        .landing {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Mono', monospace;
          overflow-x: hidden;
          line-height: 1.6;
          scroll-behavior: smooth;
        }

        /* NAV */
        .l-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid var(--border);
          background: rgba(7,9,15,0.85);
          backdrop-filter: blur(16px);
        }
        .l-nav-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          color: var(--text); letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 10px;
        }
        .l-nav-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--teal); box-shadow: 0 0 12px var(--teal);
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; box-shadow: 0 0 12px var(--teal); }
          50% { opacity: 0.5; box-shadow: 0 0 4px var(--teal); }
        }
        .l-nav-links { display: flex; align-items: center; gap: 32px; }
        .l-nav-links a {
          font-size: 11px; text-decoration: none; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;
        }
        .l-nav-links a:hover { color: var(--teal); }
        .l-nav-cta {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 20px; background: var(--teal); color: #071210;
          font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em;
          text-decoration: none; border-radius: 6px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .l-nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

        /* HERO */
        .l-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 120px 24px 80px; position: relative; overflow: hidden;
        }
        .l-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(45,212,191,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent);
        }
        .l-hero-glow {
          position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .l-badge {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--border-hover); background: var(--teal-dim);
          padding: 6px 14px; border-radius: 100px;
          font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--teal); margin-bottom: 32px;
          animation: fadein 0.6s ease both;
        }
        .l-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--teal); }
        .l-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 7vw, 88px); font-weight: 800;
          line-height: 1.0; letter-spacing: -0.03em; color: #f0f8ff;
          margin-bottom: 12px; animation: fadein 0.7s 0.1s ease both;
        }
        .l-title em { font-style: normal; color: var(--teal); }
        .l-subtitle {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: clamp(20px, 3vw, 32px); color: var(--muted2);
          margin-bottom: 24px; animation: fadein 0.7s 0.2s ease both;
        }
        .l-desc {
          max-width: 520px; font-size: 13px; color: var(--muted2);
          line-height: 1.8; margin: 0 auto 48px;
          animation: fadein 0.7s 0.3s ease both;
        }
        .l-actions {
          display: flex; align-items: center; gap: 16px; justify-content: center;
          animation: fadein 0.7s 0.4s ease both;
        }
        .btn-primary {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: var(--teal); color: #071210;
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em;
          text-decoration: none; border-radius: 8px; transition: all 0.2s;
          box-shadow: 0 0 32px rgba(45,212,191,0.2);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(45,212,191,0.3); }
        .btn-secondary {
          padding: 14px 28px; border: 1px solid var(--border); color: var(--muted2);
          font-family: 'DM Mono', monospace; font-size: 12px;
          text-transform: uppercase; letter-spacing: 0.1em;
          text-decoration: none; border-radius: 8px; transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--border-hover); color: var(--teal); }

        /* STATS */
        .l-stats {
          display: flex; justify-content: center;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .l-stat {
          flex: 1; max-width: 220px; padding: 28px 32px;
          border-right: 1px solid var(--border); text-align: center;
        }
        .l-stat:last-child { border-right: none; }
        .l-stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--teal); margin-bottom: 4px; }
        .l-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); }

        /* PREVIEW */
        .l-preview { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
        .l-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--teal); margin-bottom: 16px; }
        .l-section-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -0.02em; color: #f0f8ff; margin-bottom: 16px; line-height: 1.15; }
        .l-section-desc { font-size: 13px; color: var(--muted2); max-width: 480px; line-height: 1.8; margin-bottom: 56px; }

        .l-mock { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 40px 120px rgba(0,0,0,0.6); }
        .l-mock-bar { padding: 12px 20px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
        .l-mock-dot { width: 10px; height: 10px; border-radius: 50%; }
        .l-mock-metrics { display: grid; grid-template-columns: repeat(4,1fr); }
        .l-mock-metric { padding: 20px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .l-mock-metric:last-child { border-right: none; }
        .l-mock-metric-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 8px; }
        .l-mock-metric-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
        .l-mock-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 12px 20px; border-bottom: 1px solid var(--border); font-size: 11px; align-items: center; }
        .l-mock-row:last-child { border-bottom: none; }
        .l-mock-row.header { color: var(--muted); font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; }
        .l-badge-pill { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid; }
        .badge-vh { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: #f87171; }
        .badge-hi { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); color: #fbbf24; }
        .badge-lo { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }
        .badge-no { background: rgba(100,116,139,0.1); border-color: rgba(100,116,139,0.3); color: #64748b; }

        /* FEATURES */
        .l-features { padding: 100px 48px; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .l-features-inner { max-width: 1200px; margin: 0 auto; }
        .l-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-top: 56px; }
        .l-feature { background: var(--surface); padding: 36px 32px; transition: background 0.2s; }
        .l-feature:hover { background: rgba(45,212,191,0.03); }
        .l-feature-icon { width: 36px; height: 36px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-hover); border-radius: 8px; background: var(--teal-dim); }
        .l-feature-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600; color: #f0f8ff; margin-bottom: 10px; }
        .l-feature-desc { font-size: 12px; color: var(--muted2); line-height: 1.8; }

        /* HOW */
        .l-how { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
        .l-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 48px; margin-top: 56px; }
        .l-step-num { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: rgba(45,212,191,0.15); margin-bottom: 16px; line-height: 1; }
        .l-step-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; color: #f0f8ff; margin-bottom: 10px; }
        .l-step-desc { font-size: 12px; color: var(--muted2); line-height: 1.8; }

        /* IMPACT */
        .l-impact { padding: 100px 48px; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .l-impact-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .l-impact-levels { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
        .l-impact-row { display: flex; align-items: center; gap: 16px; padding: 14px 18px; border: 1px solid var(--border); border-radius: 8px; background: rgba(255,255,255,0.01); transition: border-color 0.2s; }
        .l-impact-row:hover { border-color: var(--border-hover); }
        .l-impact-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500; width: 72px; }
        .l-impact-range { font-size: 11px; color: var(--muted); flex: 1; }
        .l-impact-bar-wrap { width: 100px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; }
        .l-impact-bar { height: 4px; border-radius: 2px; }

        /* CTA */
        .l-cta { padding: 120px 48px; text-align: center; position: relative; overflow: hidden; }
        .l-cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 60%); pointer-events: none; }
        .l-cta-title { font-family: 'Syne', sans-serif; font-size: clamp(36px,5vw,64px); font-weight: 800; letter-spacing: -0.03em; color: #f0f8ff; margin-bottom: 20px; line-height: 1.1; }
        .l-cta-sub { font-size: 13px; color: var(--muted2); margin-bottom: 48px; line-height: 1.8; }

        /* FOOTER */
        .l-footer { padding: 32px 48px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .l-footer-logo { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--muted); }
        .l-footer-note { font-size: 11px; color: var(--muted); }

        @keyframes fadein {
          from { opacity: 0; transform: translate(12px);  }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; transform: translate(24px); transition: opacity 1s ease, transform 1s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 768px) {
          .l-nav { padding: 16px 24px; }
          .l-nav-links { display: none; }
          .l-features-grid { grid-template-columns: 1fr; }
          .l-steps { grid-template-columns: 1fr; gap: 32px; }
          .l-impact-inner { grid-template-columns: 1fr; gap: 40px; }
          .l-mock-metrics { grid-template-columns: 1fr 1fr; }
          .l-stat { padding: 20px 16px; }
        }
      `}</style>
      <div className="landing">
        {/* NAV */}

        {/* HERO */}
        <FadeIn>
          <section className="l-hero">
            <div className="l-hero-grid" />
            <div className="l-hero-glow" />
            <div className="l-badge">
              <div className="l-badge-dot" />
              Live market data · Updated hourly
            </div>
            <h1 className="l-title">
              Stop guessing.
              <br />
              Start <em>knowing</em>.
            </h1>
            <div className="l-subtitle">
              BDO market intelligence, finally done right.
            </div>
            <p className="l-desc">
              Bartali tracks every item on the Black Desert Online marketplace,
              measures the economic impact of in-game events, and tells you
              exactly when prices are moving — and why.
            </p>
            <div className="l-actions">
              <a className="btn-primary" href={AUTH_URL}>
                {GOOGLE_SVG()}
                Get started free
              </a>
            </div>
          </section>
        </FadeIn>

        {/* STATS */}
        <FadeIn>
          <div className="l-stats reveal">
            {[
              { val: "600+", label: "Items tracked" },
              { val: "Hourly", label: "Price updates" },
              { val: "5", label: "Impact tiers" },
              { val: "Real‑time", label: "WebSocket feed" },
            ].map((s) => (
              <div key={s.label} className="l-stat">
                <div className="l-stat-val">{s.val}</div>
                <div className="l-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* DASHBOARD PREVIEW */}
        <FadeIn>
          <section className="l-preview reveal">
            <div className="l-section-label">Live Dashboard</div>
            <h2 className="l-section-title">
              Your market edge,
              <br />
              at a glance.
            </h2>
            <p className="l-section-desc">
              Every active event, every affected item, ranked by impact. No
              spreadsheets. No guessing.
            </p>

            <div className="l-mock">
              <div className="l-mock-bar">
                <div className="l-mock-dot" style={{ background: "#f87171" }} />
                <div className="l-mock-dot" style={{ background: "#fbbf24" }} />
                <div className="l-mock-dot" style={{ background: "#34d399" }} />
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 10,
                    color: "var(--muted)",
                  }}
                >
                  bartali.market — Event Dashboard
                </span>
              </div>
              <div className="l-mock-metrics">
                {[
                  { label: "Active events", val: "8", color: "var(--teal)" },
                  { label: "Items affected", val: "247", color: "inherit" },
                  { label: "Very High impact", val: "14", color: "#f87171" },
                  {
                    label: "Last updated",
                    val: "2 min ago",
                    color: "var(--muted2)",
                    small: true,
                  },
                ].map((m) => (
                  <div key={m.label} className="l-mock-metric">
                    <div className="l-mock-metric-label">{m.label}</div>
                    <div
                      className="l-mock-metric-val"
                      style={{
                        color: m.color,
                        fontSize: m.small ? 14 : undefined,
                      }}
                    >
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="l-mock-row header">
                <span>Item</span>
                <span>Price</span>
                <span>Change</span>
                <span>Impact</span>
                <span>Category</span>
              </div>
              {MOCK_ROWS.map((r) => (
                <div key={r.item} className="l-mock-row">
                  <span style={{ color: "#e2eaf2", fontWeight: 500 }}>
                    {r.item}
                  </span>
                  <span>{r.price}</span>
                  <span
                    style={{ color: r.pos ? "var(--green)" : "var(--red)" }}
                  >
                    {r.change}
                  </span>
                  <span>
                    <div className={`l-badge-pill ${r.badge}`}>{r.impact}</div>
                  </span>
                  <span style={{ color: "var(--muted)" }}>Enhancement</span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* FEATURES */}
        <section className="l-features" id="features">
          <div className="l-features-inner">
            <div className="reveal">
              <div className="l-section-label">Features</div>
              <h2 className="l-section-title">
                Everything you need
                <br />
                to trade smarter.
              </h2>
              <p className="l-section-desc">
                Built by a BDO player, for BDO players. Every feature exists
                because it solves a real problem.
              </p>
            </div>
            <div className="l-features-grid reveal">
              {FEATURES.map((f) => (
                <div key={f.title} className="l-feature">
                  <div className="l-feature-icon">{f.icon}</div>
                  <div className="l-feature-title">{f.title}</div>
                  <div className="l-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="l-how" id="how">
          <div className="reveal">
            <div className="l-section-label">How it works</div>
            <h2 className="l-section-title">
              Simple. Automated.
              <br />
              Always on.
            </h2>
          </div>
          <div className="l-steps reveal">
            {[
              {
                n: "01",
                title: "Sign in with Google",
                desc: "One click. No password. Your account is created automatically and your data is private to you.",
              },
              {
                n: "02",
                title: "Watch the market move",
                desc: "The dashboard updates in real time via WebSocket. Every active event is scored, every affected item is ranked. No refresh needed.",
              },
              {
                n: "03",
                title: "Trade with confidence",
                desc: "Log investments, track PnL, see price forecasts, and get alerted to sudden moves. Make decisions based on data, not gut feeling.",
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="l-step-num">{s.n}</div>
                <div className="l-step-title">{s.title}</div>
                <div className="l-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPACT LEVELS */}
        <section className="l-impact" id="impact">
          <div className="l-impact-inner">
            <div className="reveal">
              <div className="l-section-label">Impact Classification</div>
              <h2 className="l-section-title">
                Not all price
                <br />
                moves are equal.
              </h2>
              <p className="l-section-desc" style={{ marginBottom: 0 }}>
                Bartali's 15.5% impact floor is derived from BDO's in-game
                market tax — movements below that threshold are economically
                indistinguishable from noise. Classifications only escalate,
                never downgrade.
              </p>
            </div>
            <div className="reveal">
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--muted)",
                  marginBottom: 16,
                }}
              >
                Impact thresholds
              </div>
              <div className="l-impact-levels">
                {IMPACT_LEVELS.map((l) => (
                  <div key={l.label} className="l-impact-row">
                    <div className="l-impact-label" style={{ color: l.color }}>
                      {l.label}
                    </div>
                    <div className="l-impact-range">{l.range}</div>
                    <div className="l-impact-bar-wrap">
                      <div
                        className="l-impact-bar"
                        style={{ width: l.width, background: l.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="l-cta reveal">
          <div className="l-cta-glow" />
          <div className="l-section-label">Get started</div>
          <h2 className="l-cta-title">
            Ready to trade
            <br />
            with an edge?
          </h2>
          <p className="l-cta-sub">
            Free to use. Sign in with Google and you're in.
          </p>
          <a
            className="btn-primary"
            style={{ display: "inline-flex", margin: "0 auto" }}
            href={AUTH_URL}
          >
            {GOOGLE_SVG()}
            Sign in with Google — it's free
          </a>
        </section>

        {/* FOOTER */}
        <footer className="l-footer">
          <div className="l-footer-logo">Bartali</div>
          <div className="l-footer-note">
            Not affiliated with Pearl Abyss or Kakao Games.
          </div>
        </footer>
      </div>
    </>
  );
}
