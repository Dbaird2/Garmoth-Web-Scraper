import { useRef, useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getFavorites } from "../hooks/favorites";
import { FadeIn } from "../hooks/FadeIn";
import Itemstatebar from "./ItemStatBar";



const COLUMNS = 5;
const GAP = 30; // gap-4 = 16px
const ROW_HEIGHT = 250 + GAP;

export function ItemGrid({ items, isFavorite, toggleFavorite }) {
  const scroll_ref = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const row_count = Math.ceil(items.length / COLUMNS);

  const virtualizer = useVirtualizer({
    count: row_count,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => scroll_ref.current,
    overscan: 3,
  });

  const [favorites, setFavorites] = useState(() => getFavorites());

  const handleToggle = (itemName) => {
    toggleFavorite(itemName);
    setFavorites(getFavorites());
  };

  const scrollToTop = () => {
    scroll_ref.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scroll_ref.current;
    const handleScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showScrollTop && (
        <div className="flex justify-center absolute w-[90vw] bg-transparent p-1 ">
          <button
            onClick={scrollToTop}
            className=" z-50 bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 hover:border-teal-400 text-teal-400 rounded-full w-10 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
          >
            ↑
          </button>
        </div>
      )}
      <div
        className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#0d1520] [&::-webkit-scrollbar-thumb]:bg-teal-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-teal-400 p-4 mx-auto h-[90dvh] overflow-auto"
        ref={scroll_ref}
      >
        <div
          className="relative"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <Itemstatebar items={items} />
          {virtualizer.getVirtualItems().map((v_row) => {
            const from = v_row.index * COLUMNS;
            const row_items = items.slice(from, from + COLUMNS);

            return (
              <div
                key={v_row.key}
                className="absolute w-full grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 items-start"
                style={{
                  transform: `translateY(${v_row.start}px)`,
                  height: `${ROW_HEIGHT}px`,
                }}
              >
                {row_items.map((item) => {
                  return (
                    <FadeIn delay={100}>
                      <ItemCard
                        key={item.name}
                        item={item}
                        favorite={favorites.includes(item.name)}
                        toggleFavorite={handleToggle}
                      />
                    </FadeIn>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ItemGrid;
