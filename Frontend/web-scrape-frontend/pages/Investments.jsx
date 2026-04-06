import { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useWebsocket from "../hooks/useInvestmentWs";

const MOCK_POSITIONS = [
  // {
  //   id: 1,
  //   item: "Loading",
  //   qty: 1,
  //   buyPrice: 1,
  //   impact: "None",
  //   pnl: 1,
  //   currentPrice: 1,
  // },
  // {
  //   id: 2,
  //   item: "Hard Crystal Shard",
  //   qty: 80000,
  //   buyPrice: 1800000,
  //   impact: "High",
  //   pnl: 28.7,
  //   currentPrice: 2316600,
  // },
  // {
  //   id: 4,
  //   item: "Black Stone (Weapon)",
  //   qty: 500000,
  //   buyPrice: 320000,
  //   impact: "None",
  //   pnl: -3.1,
  //   currentPrice: 310080,
  // },
];

let MOCK_CHART_DATA = {
  // "Sharp Crystal Shard": [
  //   { date: "Mar 22", actual: 3200000, projected: null },
  //   { date: "Mar 23", actual: 3250000, projected: null },
  //   { date: "Mar 24", actual: 3400000, projected: null },
  //   { date: "Mar 25", actual: 3800000, projected: null },
  //   { date: "Mar 26", actual: 4100000, projected: null },
  //   { date: "Mar 27", actual: 4520000, projected: null },
  //   { date: "Mar 28", actual: 4380000, projected: null },
  //   { date: "Mar 29", actual: 4600000, projected: 4600000 },
  //   { date: "Mar 30", actual: null, projected: 4820000 },
  //   { date: "Apr 1", actual: null, projected: 5100000 },
  //   { date: "Apr 2", actual: null, projected: 5380000 },
  //   { date: "Apr 3", actual: null, projected: 5600000 },
  //   { date: "Apr 4", actual: null, projected: 5800000 },
  //   { date: "Apr 5", actual: null, projected: 6000000 },
  // ],
  // "Hard Crystal Shard": [
  //   { date: "Mar 22", actual: 1800000, projected: null },
  //   { date: "Mar 23", actual: 1850000, projected: null },
  //   { date: "Mar 24", actual: 1920000, projected: null },
  //   { date: "Mar 25", actual: 2050000, projected: null },
  //   { date: "Mar 26", actual: 2180000, projected: null },
  //   { date: "Mar 27", actual: 2250000, projected: null },
  //   { date: "Mar 28", actual: 2300000, projected: 2300000 },
  //   { date: "Mar 29", actual: null, projected: 2420000 },
  //   { date: "Mar 30", actual: null, projected: 2550000 },
  //   { date: "Apr 1", actual: null, projected: 2700000 },
  //   { date: "Apr 2", actual: null, projected: 2850000 },
  //   { date: "Apr 3", actual: null, projected: 3000000 },
  //   { date: "Apr 4", actual: null, projected: 3100000 },
  //   { date: "Apr 5", actual: null, projected: 3200000 },
  // ],
  // "Black Stone (Weapon)": [
  //   { date: "Mar 22", actual: 320000, projected: null },
  //   { date: "Mar 23", actual: 318000, projected: null },
  //   { date: "Mar 24", actual: 315000, projected: null },
  //   { date: "Mar 25", actual: 312000, projected: null },
  //   { date: "Mar 26", actual: 310000, projected: null },
  //   { date: "Mar 27", actual: 311000, projected: 311000 },
  //   { date: "Mar 28", actual: null, projected: 309000 },
  //   { date: "Mar 29", actual: null, projected: 308000 },
  //   { date: "Mar 30", actual: null, projected: 306000 },
  //   { date: "Apr 1", actual: null, projected: 305000 },
  //   { date: "Apr 2", actual: null, projected: 304000 },
  //   { date: "Apr 3", actual: null, projected: 303000 },
  //   { date: "Apr 4", actual: null, projected: 302000 },
  //   { date: "Apr 5", actual: null, projected: 301000 },
  // ],
};

const IMPACT_STYLES = {
  "Very High": "border-red-900 bg-red-950 text-red-400",
  High: "border-red-900 bg-red-950 text-red-400",
  Medium: "border-amber-900 bg-amber-950 text-amber-400",
  Low: "border-green-900 bg-green-950 text-green-400",
  None: "border-gray-700 bg-gray-900 text-gray-500",
};

function formatSilver(val) {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(2) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(0) + "K";
  return val.toLocaleString();
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded p-2 text-[11px] font-mono">
      <p className="text-[#4a6a7a] mb-1">{label}</p>
      {payload.map((p) =>
        p.value !== null ? (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatSilver(p.value)}
          </p>
        ) : null,
      )}
    </div>
  );
}

export default function Investments() {
  const [positions, setPositions] = useState( []);
  const [selected, setSelected] = useState({});
  const [chart_data, setChartData] = useState({});
  const [form, setForm] = useState({
    item: "",
    buyPrice: "",
    qty: "",
    date: "",
    event: "",
    notes: "",
  });
  const setData = useCallback((data) => {
    console.log('data', data)
    if (!data?.positions || !data?.chart_data) return;
    setPositions(data.positions);
    setChartData(data.chart_data);
    setSelected(data.positions[0]);
  }, []);
  const token = localStorage.getItem("jwt");
  const { loading, sendMessage } = useWebsocket(setData, token);

  const [range, setRange] = useState("60d");

  const totalInvested = positions.reduce((s, p) => s + p.buyPrice * p.qty, 0);
  const totalValue = positions.reduce((s, p) => s + p.currentPrice * p.qty, 0);
  const totalPnl = (totalValue - totalInvested) * 0.855;
  const totalPnlPct = ((totalPnl / totalInvested) * 100).toFixed(1);

  const chartData = chart_data[selected?.item] || [];
  const buyLine = chartData.map((d) => ({ ...d, buy: selected.buyPrice }));

  const rangeSlice = { "7d": 7, "14d": 14, "30d": 30, "60d": 60 }[range];
  const slicedData = buyLine.slice(-rangeSlice);

  function handleDelete(id) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
    if (selected.id === id && positions.length > 1) {
      setSelected(positions.find((p) => p.id !== id));
    }
    sendMessage('delete', id)
  }

  function handleSubmit() {
    if (!form.item || !form.buyPrice || !form.qty) return;
    const new_pos = {
      id: Date.now(),
      item: form.item,
      qty: parseInt(form.qty),
      buyPrice: parseInt(form.buyPrice),
      date: form.date,
      pnl: 0,
    };
    setPositions((prev) => [...prev, new_pos]);
    sendMessage('create', new_pos);
    setForm({
      item: "",
      buyPrice: "",
      qty: "",
      date: "",
      event: "",
      notes: "",
    });
  }

  return (
    <div
      className="min-h-screen text-[#c8d8e8]"
      style={{ background: "#0d1520", fontFamily: "'DM Mono', monospace" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#1a2a3a]">
          <p className="text-[10px] tracking-[.2em] uppercase text-teal-400 mb-1">
            Portfolio
          </p>
          <h1
            className="text-4xl font-medium text-[#e8f4f8]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            My Investments
          </h1>
          <p className="text-[12px] text-[#4a6a7a] tracking-widest uppercase mt-1">
            Black Desert Online · Investment Tracker
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total invested",
              value: formatSilver(totalInvested),
              colored: false,
            },
            {
              label: "Current value",
              value: formatSilver(totalValue),
              colored: false,
            },
            {
              label: "Total P&L",
              value: `${totalPnl >= 0 ? "+" : "-"}${formatSilver(totalPnl)}`,
              colored: true,
              pos: totalPnl >= 0,
            },
            { label: "Positions", value: positions.length, colored: false },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[#0f1a26] border border-[#1a2a3a] rounded-lg p-4"
            >
              <p className="text-[10px] uppercase tracking-[.15em] text-[#4a6a7a] mb-1">
                {m.label}
              </p>
              <p
                className={`text-xl font-medium ${m.colored ? (m.pos ? "text-teal-400" : "text-red-400") : "text-[#e8f4f8]"}`}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
        {/* Add position form */}
        <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5 mb-5">
          <p className="text-[11px] uppercase tracking-[.2em] text-teal-400 mb-4">
            Add position
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
                Item name
              </span>
              <input
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
                placeholder="Search item..."
                className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
              />
            </div>
            {[
              {
                label: "Buy price (silver)",
                key: "buyPrice",
                type: "number",
                placeholder: "0",
              },
              {
                label: "Quantity",
                key: "qty",
                type: "number",
                placeholder: "0",
              },
              {
                label: "Date purchased",
                key: "date",
                type: "date",
                placeholder: "",
              },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
                  {label}
                </span>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
                Wanted Sell Price
              </span>
              <input
                value={form.event}
                type="number"
                onChange={(e) => setForm({ ...form, event: e.target.value })}
                className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
              ></input>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
                Notes
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. bought before costume sale, expecting enhancement spike..."
                className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none resize-none h-16"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-[#0f6e56] border border-[#1d9e75] text-teal-400 text-[10px] uppercase tracking-[.2em] py-2.5 rounded font-mono hover:bg-[#0d5c47] transition-colors"
          >
            Add to portfolio
          </button>
        </div>

        {/* Table + Chart */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Positions table */}
          <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] uppercase tracking-[.2em] text-teal-400">
                Current positions
              </span>
            </div>
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  {["Item", "Qty", "Buy price", "Impact", "P&L", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[9px] uppercase tracking-[.15em] text-[#4a6a7a] pb-2 px-1 font-normal"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer transition-colors"
                    style={{
                      background:
                        selected.id === p.id ? "#0a1a28" : "transparent",
                    }}
                  >
                    <td className="py-2 px-1 text-[#e8f4f8] font-medium border-t border-[#1a2a3a]">
                      {p.item}
                    </td>
                    <td className="py-2 px-1 border-t border-[#1a2a3a]">
                      {p.qty}
                    </td>
                    <td className="py-2 px-1 border-t border-[#1a2a3a]">
                      {formatSilver(p.buyPrice)}
                    </td>
                    <td className="py-2 px-1 border-t border-[#1a2a3a]">
                      <span
                        className={`text-[9px] uppercase tracking-[.1em] px-1.5 py-0.5 border rounded-sm ${IMPACT_STYLES[p.impact]}`}
                      >
                        {p.impact}
                      </span>
                    </td>
                    <td
                      className={`py-2 px-1 border-t border-[#1a2a3a] ${p.pnl >= 0 ? "text-teal-400" : "text-red-400"}`}
                    >
                      {p.pnl >= 0 ? "+" : ""}
                      {p.pnl?.toFixed(1) ?? 0}%
                    </td>
                    <td className="py-2 px-1 border-t border-[#1a2a3a]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="text-[#4a6a7a] hover:text-red-400 text-[10px]"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                data={slicedData}
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
                <Tooltip content={<CustomTooltip />} />
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
        </div>
      </div>
    </div>
  );
}
