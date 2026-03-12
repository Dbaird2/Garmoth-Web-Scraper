export function SortBar({ ...props_from_filter }) {
  return (
    <div className="relative z-20 self-center h-[3rem] px-4 flex justify-center space-between">
      <div className="p-4 mr-4 text-white font-bold">
        <span>Sort By:</span>
      </div>
      <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
        <span
          data-value="percentage"
          className="cursor-pointer"
          onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
        >
          Change
        </span>
      </div>
      <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
        <span
          data-value="price"
          className="cursor-pointer"
          onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
        >
          Price
        </span>
      </div>
      <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
        <span
          data-value="stock"
          className="cursor-pointer"
          onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
        >
          Stock
        </span>
      </div>
      <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
        <span
          data-value="percent_diff"
          className="cursor-pointer"
          onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
        >
          Change Difference
        </span>
      </div>
      <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
        <span
          data-value="price_diff"
          className="cursor-pointer"
          onClick={(e) => props_from_filter.sortItems(e.target.dataset.value)}
        >
          Price Difference
        </span>
      </div>
    </div>
  );
}
export default SortBar;
