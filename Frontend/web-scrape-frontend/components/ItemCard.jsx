import { useState } from "react";
import ItemModal from "./ItemModal";
import { FadeIn } from "../hooks/FadeIn";

export function ItemCard({ item, favorite, toggleFavorite }) {
  // filled star &#9733;
  const [popped, setPopped] = useState(false);

  const handleFavorite = (name) => {
    console.log(name);
    toggleFavorite(name);
    setPopped(true);
    setTimeout(() => setPopped(false), 400);
  };
  return (
    <>
      <div
        key={item.name}
        className={`relative bg-[#111d2e] border-0 border-b-1 border-t-1 border-t-red-900/40 border-b-teal-900/40 rounded-xl border border-[#1a2a3a] ${item.percentage >= 0 ? "hover:border-1 hover:border-teal-500/50" : "hover:border-1 hover:border-red-500/50"} transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 p-4 flex flex-col gap-3 group`}
      >
        {/* Header */}
        <div className="flex flex-row justify-between items-start gap-2">
          <h3 className="tracking-wider font-semibold text-[#c8d8e8] truncate text-sm">
            {item.name}
          </h3>
          <span
            onClick={() => handleFavorite(item.name)}
            className={`hover:scale-125 text-yellow-400/80 hover:text-yellow-300 text-lg cursor-pointer transition-all duration-200 inline-block flex-shrink-0 ${popped ? "scale-125 animate-spin" : "scale-100"}`}
          >
            {favorite ? "★" : "☆"}
          </span>
        </div>

        {/* Divider */}
        <div
          className={`h-px ${item.percentage >= 0 ? "bg-gradient-to-r from-teal-500/70 via-purple-500/50 to-transparent" : "bg-gradient-to-r from-red-500/50 via-blue-500/50 to-transparent"}`}
        />

        {/* Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#4a6070]">
              Change
            </span>
            <span
              className={`text-sm font-mono font-semibold ${item.percentage >= 0 ? "text-teal-400" : "text-red-400"}`}
            >
              {item.percentage >= 0 ? "+" : ""}
              {item.percentage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#4a6070]">
              Price
            </span>
            <span className="text-sm font-mono text-[#c8d8e8]">
              {item.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#4a6070]">
              Stock
            </span>
            <span
              className={`text-sm font-mono ${item.stock > 0 ? "text-teal-400" : "text-red-400"}`}
            >
              {item.stock.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#4a6070]">
              % Diff
            </span>
            <span
              className={`text-sm font-mono ${item.percent_diff > 0 ? "text-teal-400" : "text-red-400"}`}
            >
              {item.percent_diff > 0 ? "+" : ""}
              {item.percent_diff ?? 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#4a6070]">
              Price Diff
            </span>
            <span
              className={`text-sm font-mono ${item.price_diff > 0 ? "text-teal-400" : "text-red-400"}`}
            >
              {item.price_diff > 0 ? "+" : ""}
              {item.price_diff.toLocaleString() ?? 0}
            </span>
          </div>
        </div>

        <ItemModal item={item} />
      </div>
    </>
  );
}
export default ItemCard;
