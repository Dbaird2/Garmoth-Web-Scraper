import { useState } from "react";
import ItemModal from "./ItemModal";
import { FadeIn } from "../hooks/FadeIn";

export function ItemCard({ item, favorite, toggleFavorite }) {
  const [popped, setPopped] = useState(false);

  const handleFavorite = (name) => {
    console.log(name);
    toggleFavorite(name);
    setPopped(true);
    setTimeout(() => setPopped(false), 600);
  };

  const isPositive = item.percentage >= 0;

  return (
    <div
      key={item.name}
      className={`relative bg-[#0a1018] border border-[#1a2a3a] border-l-2 ${
        isPositive ? "border-l-teal-500" : "border-l-red-500"
      } rounded-sm transition-all duration-300 hover:border-[#2a3a4a] hover:bg-[#0d1520] p-4 flex flex-col gap-3 group`}
    >
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-2">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-yellow-400/70 truncate">
          {item.name}
        </h3>
        <button
          onClick={() => handleFavorite(item.name)}
          className="relative flex-shrink-0 w-7 h-7 flex items-center justify-center cursor-pointer group/heart"
          aria-label="Toggle favorite"
        >
          {popped && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
          )}
          <span
            className={`text-lg leading-none transition-all duration-200 ${
              favorite
                ? "text-red-400 scale-110"
                : "text-[#2a3a4a] group-hover/heart:text-red-400/60"
            } ${popped ? "scale-125" : "scale-100"}`}
          >
            ♥
          </span>
        </button>
      </div>

      {/* Hero stat — percentage change */}
      <div className="flex items-end justify-between gap-2">
        <span
          className={`font-mono text-4xl font-semibold leading-none tracking-tight ${
            isPositive ? "text-teal-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {item.percentage}%
        </span>
        <span
          className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border mb-0.5 ${
            isPositive
              ? "border-teal-500/40 text-teal-600 bg-teal-500/5"
              : "border-red-500/40 text-red-600 bg-red-500/5"
          }`}
        >
          {isPositive ? "rising" : "falling"}
        </span>
      </div>

      {/* Divider */}
      <div
        className={`h-px ${
          isPositive
            ? "bg-gradient-to-r from-teal-500/40 to-transparent"
            : "bg-gradient-to-r from-red-500/40 to-transparent"
        }`}
      />

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[#2d4555]">
            Price
          </span>
          <span className="text-sm font-mono text-[#8aa8b8]">
            {item.price.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[#2d4555]">
            Stock
          </span>
          <span
            className={`text-sm font-mono ${
              item.stock > 0 ? "text-teal-400" : "text-red-400"
            }`}
          >
            {item.stock.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[#2d4555]">
            % Diff
          </span>
          <span
            className={`text-sm font-mono ${
              item.percent_diff > 0 ? "text-teal-400" : "text-red-400"
            }`}
          >
            {item.percent_diff > 0 ? "+" : ""}
            {item.percent_diff ?? 0}%
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-[#2d4555]">
            Price Diff
          </span>
          <span
            className={`text-sm font-mono ${
              item.price_diff > 0 ? "text-teal-400" : "text-red-400"
            }`}
          >
            {item.price_diff > 0 ? "+" : ""}
            {item.price_diff.toLocaleString() ?? 0}
          </span>
        </div>
      </div>

      <ItemModal item={item} />
    </div>
  );
}

export default ItemCard;
