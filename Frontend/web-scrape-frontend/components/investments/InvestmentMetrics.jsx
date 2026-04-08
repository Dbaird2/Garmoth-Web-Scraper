export default function InvestmentMetrics({
  total_invested,
  total_val,
  total_pnl,
  positions,
  formatSilver,
}) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total invested",
            value: formatSilver(total_invested),
            colored: false,
          },
          {
            label: "Current value",
            value: formatSilver(total_val),
            colored: total_val < total_invested ? false : true,
            pos: total_val > total_invested
          },
          {
            label: "Total P&L",
            value: `${total_pnl >= 0 ? "+" : "-"}${formatSilver(total_pnl)}`,
            colored: true,
            pos: total_pnl >= 0,
          },
          { label: "Investments", value: positions.length, colored: false },
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
    </>
  );
}
