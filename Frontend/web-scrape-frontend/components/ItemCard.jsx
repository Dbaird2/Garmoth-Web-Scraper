import ItemModal from "./ItemModal";

export function ItemCard({ item }) {
  
  return (
    <>
      <div
        key={item.name}
        className="bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 p-4 flex flex-col gap-2"
      >
        <h3 className="font-semibold text-white truncate">{item.name}</h3>
        <div
          className={
            item.percentage >= 0 ? "h-px bg-green-400" : "h-px bg-red-400"
          }
        />
        <div className="flex justify-between text-md">
          <span className="text-slate-400">Change</span>
          <span
            className={item.percentage >= 0 ? "text-green-400" : "text-red-400"}
          >
            {item.percentage}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Price</span>
          <span className="text-white">{item.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Stock</span>
          <span className="text-white">{item.stock.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">% Difference</span>
          <span
            className={
              item.percent_diff >= 0 ? "text-green-400" : "text-red-400"
            }
          >
            {item.percent_diff ?? 0}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Price Difference</span>
          <span
            className={item.price_diff >= 0 ? "text-green-400" : "text-red-400"}
          >
            {item.price_diff.toLocaleString() ?? 0}
          </span>
        </div>
        <ItemModal item={item} />
      </div>
    </>
  );
}
export default ItemCard;
