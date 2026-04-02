import ItemGrid from "../components/ItemGrid";
import SkeletonGrid from "../components/SkeletonGrid";
import SearchBar from "../components/SearchBar";
import SortBar from "../components/SortBar";
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
    </>
  );
}
