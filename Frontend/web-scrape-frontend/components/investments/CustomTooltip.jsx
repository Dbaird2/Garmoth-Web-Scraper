export default function CustomTooltip({ active, payload, label, formatSilver }) {
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
