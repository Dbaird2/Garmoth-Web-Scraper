import { useEffect, useState } from "react";
import ItemGrid from "../components/ItemGrid";
import Navbar from "../components/Navbar";
import SortBar from "../components/SortBar";
import useFilter from "../hooks/useFilter";
import useWebsocket from "../hooks/useWebsocket";

function App() {
  const [item_list, setItemList] = useState([]);
  useWebsocket((items) => setItemList(items));

  const { temp_list, ...filter_props } = useFilter(item_list);

  return (
    <div>
      <Navbar {...filter_props} />
      <SortBar {...filter_props} />
      <ItemGrid items={temp_list} />
    </div>
  );
}

export default App;
