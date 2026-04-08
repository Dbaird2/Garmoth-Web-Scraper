export default function PositionsTable({
  positions,
  formatSilver,
  handleDelete,
  setSelected,
  selected,
  IMPACT_STYLES,
}) {
  return (
    <>
      <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] uppercase tracking-[.2em] text-teal-400">
            Current investments
          </span>
        </div>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["Item", "Qty", "Buy price", "Impact", "P&L", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[9px] uppercase tracking-[.15em] text-[#4a6a7a] pb-2 px-1 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="cursor-pointer transition-colors"
                style={{
                  background: selected.id === p.id ? "#0a1a28" : "transparent",
                }}
              >
                <td className="py-2 px-1 text-[#e8f4f8] font-medium border-t border-[#1a2a3a]">
                  {p.item}
                </td>
                <td className="py-2 px-1 border-t border-[#1a2a3a]">{p.qty}</td>
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
                <td className="py-2 px-1  border-t border-[#1a2a3a]">
                  <button className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 border border-teal-400/30 text-teal-400/70 hover:text-teal-400 hover:border-teal-400 rounded transition-colors duration-150">
                    Sell
                  </button>
                </td>
                <td className="py-2 px-1  border-t border-[#1a2a3a]">
                  <button className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 border border-teal-400/30 text-teal-400/70 hover:text-teal-400 hover:border-teal-400 rounded transition-colors duration-150">
                    Edit
                  </button>
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
    </>
  );
}
