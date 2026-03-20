import { useRef } from "react";
import ItemCard from "./ItemCard";
import { useVirtualizer } from "@tanstack/react-virtual";

const COLUMNS = 5;
const GAP = 16; // gap-4 = 16px
const ROW_HEIGHT = 250 + GAP;

export function ItemGrid({ items }) {
  const scroll_ref = useRef(null);

  const row_count = Math.ceil(items.length / COLUMNS);

  const virtualizer = useVirtualizer({
    count: row_count,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => scroll_ref.current,
    overscan: 3,
  });

  return (
    <div className=" p-4 mx-auto h-[90dvh] overflow-auto" ref={scroll_ref}>
      <div
        className="relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((v_row) => {
          const from = v_row.index * COLUMNS;
          const row_items = items.slice(from, from + COLUMNS);

          return (
            <div
              key={v_row.key}
              className="absolute w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 items-start"
              style={{
                transform: `translateY(${v_row.start}px)`,
                height: `${ROW_HEIGHT}px`,
              }}
            >
              {row_items.map((item) => (
                <ItemCard key={item.name} item={item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemGrid;
