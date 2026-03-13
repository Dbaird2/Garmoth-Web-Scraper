export function Navbar({ ...props_from_filter }) {
  return (
    <div className="inset-0">
      <div className=" relative z-20 self-center h-[3rem] px-4 flex justify-center space-between">
        <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:text-teal-200 font-bold">
          <input
            placeholder="Search Item"
            onChange={(e) => props_from_filter.setSearch(e.target.value)}
          />
        </div>
        <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
          <span
            className="cursor-pointer"
            onClick={props_from_filter.filterItems}
          >
            Filter
          </span>
        </div>

        <div className="text-teal-200 transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
          <span
            className="cursor-pointer text-sm"
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
            className="w-full accent-teal-200"
          />
        </div>
        <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
          <span
            className="cursor-pointer"
            onClick={props_from_filter.resetItems}
          >
            Reset
          </span>
        </div>
        <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
          <span className="cursor-pointer">About</span>
        </div>
        <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
          <span className="cursor-pointer">Contact</span>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 h-screen "></div>
    </div>
  );
}
export default Navbar;
