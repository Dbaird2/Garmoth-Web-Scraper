import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomToolTip";

export default function PriceChart({ selected, range, setRange, sliced_data, formatSilver }) {
  return (
    <>
      {/* Chart */}
      <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] uppercase tracking-[.2em] text-teal-400 truncate">
            {selected.item} · Price
          </span>
          <div className="flex gap-1.5 shrink-0 ml-2">
            {["7d", "14d", "30d", "60d"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-[9px] uppercase tracking-[.1em] px-2 py-1 rounded-sm border transition-colors ${
                  range === r
                    ? "border-teal-700 text-teal-400 bg-[#0a1f18]"
                    : "border-[#1a2a3a] text-[#4a6a7a]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={sliced_data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fill: "#4a6a7a", fontSize: 9, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4a6a7a", fontSize: 9, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatSilver(v)}
              width={42}
            />
            <Tooltip content={<CustomTooltip active={selected} payload={sliced_data} label='date' formatSilver={formatSilver} />} />
            <Line
              dataKey="actual"
              name="Actual"
              stroke="#2dd4bf"
              strokeWidth={1.5}
              dot={{ r: 2, fill: "#2dd4bf" }}
              connectNulls={false}
            />
            <Line
              dataKey="projected"
              name="Projected"
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={{ r: 2, fill: "#fbbf24" }}
              connectNulls={false}
            />
            <Line
              dataKey="buy"
              name="Buy price"
              stroke="#f87171"
              strokeWidth={1}
              strokeDasharray="2 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex gap-4 mt-2">
          {[
            ["#2dd4bf", "Actual"],
            ["#fbbf24", "Projected"],
            ["#f87171", "Buy price"],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <span className="text-[10px] text-[#4a6a7a]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
