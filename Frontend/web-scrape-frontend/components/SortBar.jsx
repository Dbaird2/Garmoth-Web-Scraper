import { useRef, useEffect } from "react";

export function SortBar({ ...props_from_filter }) {
  const change = useRef(null);
  const price = useRef(null);
  const stock = useRef(null);
  const change_diff = useRef(null);
  const price_diff_ref = useRef(null);

  const KEY_CASES = {
    z: change,
    x: price,
    c: stock,
    v: change_diff,
    b: price_diff_ref,
  };
 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && KEY_CASES[e.key]) {
        e.preventDefault();
        KEY_CASES[e.key].current?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex">
      <div className="px-3 flex flex-col w-48 py-3 border-r border-white/[0.07] bg-[#0a0e14]/60">
        <div className="p-2 mr-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Sort By
          </span>
        </div>

        <div className="p-0 mr-4 transition delay-50 duration-150 ease-in-out">
          <span
            ref={change}
            data-value="percentage"
            className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 border border-transparent transition-all duration-150 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400"
            onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
          >
            Change
          </span>
        </div>

        <div className="p-0 mr-4 transition delay-50 duration-150 ease-in-out">
          <span
            ref={price}
            data-value="price"
            className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 border border-transparent transition-all duration-150 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400"
            onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
          >
            Price
          </span>
        </div>

        <div className="p-0 mr-4 transition delay-50 duration-150 ease-in-out">
          <span
            ref={stock}
            data-value="stock"
            className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 border border-transparent transition-all duration-150 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400"
            onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
          >
            Stock
          </span>
        </div>

        <div className="p-0 mr-4 transition delay-50 duration-150 ease-in-out">
          <span
            ref={change_diff}
            data-value="percent_diff"
            className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 border border-transparent transition-all duration-150 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400"
            onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
          >
            Change Difference
          </span>
        </div>

        <div className="p-0 mr-4 transition delay-50 duration-150 ease-in-out">
          <span
            ref={price_diff_ref}
            data-value="price_diff"
            className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-slate-500 border border-transparent transition-all duration-150 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400"
            onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
          >
            Price Difference
          </span>
        </div>
      </div>
    </div>
  );
}
export default SortBar;
