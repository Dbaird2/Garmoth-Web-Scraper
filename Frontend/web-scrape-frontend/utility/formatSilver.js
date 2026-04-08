export function formatSilver(val) {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(2) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(0) + "K";
  return val?.toLocaleString() ?? 0;
}
