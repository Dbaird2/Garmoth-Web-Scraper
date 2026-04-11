import { useRef, useEffect } from "react";

export default function SearchBar({ ...props_from_filter }) {
  const search_ref = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "/") {
        e.preventDefault();
        search_ref.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="inset-0">
      <div
        className="relative z-20 self-center h-14 px-5 flex items-center gap-1 border-b border-white/[0.07] bg-[#0a0e14]/80 backdrop-blur-lg"
        style={{
          boxShadow:
            "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Teal left accent */}
        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-sm bg-gradient-to-b from-transparent via-teal-400 to-transparent" />

        {/* Search input */}
        <div className="relative flex items-center mr-2">
          <span className="absolute left-2.5 text-[13px] text-slate-500 pointer-events-none">
            ⌕
          </span>
          <input
            placeholder="Search Item"
            ref={search_ref}
            onChange={(e) => props_from_filter.setSearch(e.target.value)}
            className="w-40 rounded-md border border-white/[0.07] bg-white/[0.03] py-1.5 pl-7 pr-3 text-[12px] text-slate-200 placeholder-slate-500 outline-none transition-all duration-200 focus:w-52 focus:border-teal-400/30 focus:bg-teal-400/[0.06] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
          />
          <span
            className="cursor-pointer flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-150 hover:-translate-y-px hover:border-white/[0.07] hover:bg-white/[0.04] hover:text-teal-400"
            onClick={props_from_filter.filterItems}
          >
            ⧩ Search
          </span>
        </div>

        <div className="mx-1.5 h-5 w-px shrink-0 bg-white/[0.07]" />

        {/* Filter */}
        <div className="p-0 mr-0"></div>

        {/* Slider */}
        <div className="flex items-center gap-2.5 rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 min-w-[160px] transition-colors hover:border-teal-400/30 hover:bg-teal-400/[0.06]">
          <span
            className="cursor-pointer min-w-[36px] font-mono text-[11px] font-medium tracking-wide text-teal-400 select-none text-sm"
            onClick={props_from_filter.sortItems}
          >
            {props_from_filter.slider_val ?? 0}%
          </span>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            defaultValue={0}
            onChange={(e) =>
              props_from_filter.filterBySlider(Number(e.target.value))
            }
            className="w-full accent-teal-400"
          />
        </div>

        {/* Category */}
        <div className="p-0 mr-0">
          <span className="cursor-pointer flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-150 hover:-translate-y-px hover:border-yellow-400/30 hover:bg-yellow-400/[0.07] hover:text-yellow-400">
            <select
              onChange={(e) =>
                props_from_filter.filterByCategory(e.target.value)
              }
            >
              <option value="all">All</option>
              <option value="upgrade">Upgrade</option>
              <option value="enhancement">Enhancement</option>
            </select>
          </span>
        </div>

        {/* Favorites */}
        <div className="p-0 mr-0">
          <span
            className="cursor-pointer flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-150 hover:-translate-y-px hover:border-yellow-400/30 hover:bg-yellow-400/[0.07] hover:text-yellow-400"
            onClick={props_from_filter.filterByFavorites}
          >
            &#9733; Favorites
          </span>
        </div>

        {/* Reset */}
        <div className="p-0 mr-0">
          <span
            className="cursor-pointer flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-150 hover:-translate-y-px hover:border-red-400/30 hover:bg-red-400/[0.07] hover:text-red-400"
            onClick={props_from_filter.resetItems}
          >
            ↺ Reset
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
        <div className="mx-1.5 h-5 w-px shrink-0 bg-white/[0.07]" />
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 h-screen"></div>
    </div>
  );
}
