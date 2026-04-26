import ItemGrid from "../components/items/ItemGrid";
import SkeletonGrid from "../components/items/SkeletonGrid";
import SearchBar from "../components/items/SearchBar";
import SortBar from "../components/items/SortBar";
import useFilter from "../hooks/useFilter";
import useWebsocket from "../hooks/useWebsocket";
import { toggleFavorite, isFavorite } from "../hooks/favorites";
import { useState } from "react";

export default function ItemPage() {
  const [item_list, setItemList] = useState([]);
  const { loading } = useWebsocket((items) => setItemList(items));
  const { temp_list, ...filter_props } = useFilter(item_list);

  return (
    <>
      <title>Event Tracker: Items</title>
      <div
        className="min-h-screen p-6 md:p-10 bg-[#090e10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div>
          <SearchBar {...filter_props} />
        </div>
        <div className="flex flex-row h-full overflow-auto">
          <div className="w-30 flex-shrink-0">
            <SortBar {...filter_props} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <SkeletonGrid />
            ) : (
              <ItemGrid
                items={temp_list}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
