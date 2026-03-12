import ItemCard from "./ItemCard";

export function ItemGrid({ items }) {
  return (
    <div className="w-[90rem] mx-auto">
      <div className="text-center">
        <div className="text-slate-300 text-[1rem] m-4 grid grid-cols-5 gap-4">
          {items.map((item) => (
            <ItemCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default ItemGrid;