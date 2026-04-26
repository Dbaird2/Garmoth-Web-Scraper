export default function ItemStatBar({ items = [] }) {
  if (!items?.length) return null;

  const total_tracked = items.length;

  const top_mover = items.reduce(
    (best, item) => (item?.percentage < best?.percentage ? item : best),
    items[0],
  );

  const most_volatile = items.reduce(
    (best, item) => (item?.price_diff >= best?.price_diff ? item : best),
    items[0],
  );

  const above_threshold = items.filter((item) => item.percentage < -30).length;

  const fmt = (n) =>
    Math.abs(n) >= 1_000_000_000
      ? (n / 1_000_000_000).toFixed(1) + "B"
      : Math.abs(n) >= 1_000_000
        ? (n / 1_000_000).toFixed(1) + "M"
        : Math.abs(n) >= 1_000
          ? (n / 1_000).toFixed(1) + "K"
          : n?.toLocaleString();

  const cards = [
    {
      label: "Total Tracked",
      value: total_tracked.toLocaleString(),
      accent: "border-t-teal-500",
      bg: top_mover.percentage >= 0 ? "bg-teal-900/20" : "bg-teal-900/20",
      border:
        top_mover.percentage >= 0 ? "border-teal-400/50" : "border-teal-400/50",
    },
    {
      label: "Bottom Mover",
      value: `${top_mover.percentage > 0 ? "+" : ""}${top_mover.percentage}%`,
      sub: top_mover.name,
      accent: "border-t-red-500",
      valueColor: top_mover.percentage >= 0 ? "text-teal-400" : "text-red-400",
      bg: top_mover.percentage <= 0 ? "bg-red-900/20" : "bg-teal-900/20",
      border:
        top_mover.percentage <= 0 ? "border-red-400/50" : "border-teal-400/50",
    },
    {
      label: "Most Volatile",
      value: `${most_volatile.price_diff > 0 ? "+" : ""}${fmt(most_volatile.price_diff)}`,
      sub: most_volatile.name,
      accent: "border-t-amber-400",
      valueColor:
        most_volatile.price_diff >= 0 ? "text-teal-400" : "text-red-400",
      bg: most_volatile.price_diff >= 0 ? "bg-teal-900/20" : "bg-red-900/20",
      border:
        most_volatile.price_diff >= 0
          ? "border-teal-400/50"
          : "border-red-400/50",
    },
    {
      label: "Above Threshold",
      value: above_threshold.toLocaleString(),
      sub: "items < -30% change",
      accent: "border-t-blue-400",
      valueColor: "text-amber-400",
      bg: above_threshold >= 5 ? "bg-teal-900/20" : "bg-red-900/20",
      border: above_threshold >= 0 ? "border-teal-400/50" : "border-red-400/50",
    },
  ];

  return (
    <div className="px-6 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} border border-[#1a2a3a] border-t-2 border-0.5 ${card?.border} ${card.accent} rounded-lg p-3`}
          >
            <p className="font-sans text-[15px] tracking-widest  text-teal-600 mb-2">
              {card.label}
            </p>
            <p
              className={`font-sans text-[15px] font-bold leading-none ${card.valueColor ?? "text-[#e2f5ef]"}`}
            >
              {card.value}
            </p>
            {card?.sub && (
              <p className="font-sans text-[15px] text-[#2d6b54] mt-1.5 truncate">
                {card?.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
