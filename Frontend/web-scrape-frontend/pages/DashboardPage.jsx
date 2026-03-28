import { useState } from "react";
import useWebsocket from "../hooks/useDashboardWs";
import DashbaordItemModal from "../components/DashboardModal";

const IMPACT_STYLES = {
  High: { border: "border-t-red-500", badge: "border-red-500 text-red-500" },
  Medium: {
    border: "border-t-amber-400",
    badge: "border-amber-400 text-amber-400",
  },
  Low: { border: "border-t-blue-400", badge: "border-blue-400 text-blue-400" },
  None: {
    border: "border-t-slate-600",
    badge: "border-slate-600 text-slate-600",
  },
  Unknown: {
    border: "border-t-teal-400",
    badge: "border-teal-400 text-teal-400",
  },
};

function EventCard({ event, impact, start_date, end_date, items }) {
  const style = IMPACT_STYLES[impact] ?? IMPACT_STYLES.Unknown;

  return (
    <div
      className={`bg-[#0d1520] border border-[#1a2a3a] border-t-2 ${style.border} p-5 flex flex-col gap-4 max-h-[40rem]`}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="font-bold text-[#e8f0f8] text-sm leading-snug tracking-wide">
          {event}
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${style.badge}`}
        >
          {impact}
        </span>
      </div>

      <span className="font-mono text-[11px] text-[#4a6070]">
        {start_date} <span className="text-[#2a3a4a]">→</span> {end_date}
      </span>

      <div className="h-px bg-gradient-to-r from-[#1a2a3a] to-transparent" />

      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-[#2a4a5a] mb-2">
          Affected Items
        </p>
        <ul className="flex flex-col h-[30rem] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#0d1520] [&::-webkit-scrollbar-thumb]:bg-teal-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-teal-400 overflow-auto gap-1.5">
          {Object.entries(items).map(([key, item]) => (
            <li
              key={key}
              className="flex flex-row justify-between text-[13px] text-[#8aa8b8] px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a] hover:border-teal-400 hover:text-[#c8d8e8] transition-colors"
            >
              <div>
                <DashbaordItemModal item={item.name} />
              </div>
              <div className="flex gap-4 text-gray-400 text-[10px]">
                <span>Impact</span>
                <div
                  className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${IMPACT_STYLES[item.impact].badge}`}
                >
                  {item.impact}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function EventsDashboard() {
  const [event_info, setEventInfo] = useState({});
  const { loading } = useWebsocket((events) => setEventInfo(events));
  const numbers = Array.from({ length: 4 }, (e, i) => i);
  console.log(loading);
  return (
    <div
      className="p-6 min-h-screen bg-[#090e14]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {loading ? (
        <div className="animate-pulse bg-[#0d1520] border border-[#1a2a3a] border-t-2 border-t-slate-600 p-5 flex flex-col gap-4">
          {/* Title area */}
          <div className="flex justify-between items-start gap-3">
            <div className="h-4 w-1/2 bg-[#1a2a3a] rounded" />
            <div className="h-3 w-16 bg-[#1a2a3a] rounded" />
          </div>

          <div className="h-px bg-[#1a2a3a]" />

          {/* List items */}
          <div>
            <div className="h-3 w-24 bg-[#1a2a3a] rounded mb-3" />
            <ul className="flex flex-col gap-1.5">
              {numbers.map((num) => (
                <li
                  key={num}
                  className="px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a]"
                >
                  <div
                    className="h-3 bg-[#1a2a3a] rounded"
                    style={{ width: `${60 + (num % 3) * 15}%` }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-teal-400 opacity-70 mb-6">
            // Active Events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.values(event_info).map((value, index) => (
              <EventCard key={index} {...value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
