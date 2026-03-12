import { useState, useEffect } from "react";

export function useFilter(item_list) {
  const [temp_list, setTempList] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [search, setSearch] = useState("");
  const [slider_val, setSliderValue] = useState(0);

  useEffect(() => {
    setTempList(item_list);
  }, [item_list]);

  const filterItems = () => {
    console.log(search);
    const new_list = item_list.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()),
    );
    setTempList(new_list);
  };

  const sortItems = (sort_column) => {
    console.log("sorting", sort_column);
    let temp_item_list = sorted
      ? [...temp_list].sort((a, b) => a[sort_column] - b[sort_column])
      : [...temp_list].sort((a, b) => b[sort_column] - a[sort_column]);
    setTempList(temp_item_list);
    setSorted(!sorted);
  };

  const resetItems = () => {
    setTempList(item_list);
    setSliderValue(30);
    setSorted(false);
    setSearch("");
  };

  const filterBySlider = (val) => {
    setSliderValue(val);
    console.log(val);
    const new_list = item_list.filter(
      (a) => a.percentage <= -val || a.percentage >= val,
    );
    setTempList(new_list);
  };

  return {
    temp_list,
    search,
    slider_val,
    setSearch,
    filterItems,
    sortItems,
    resetItems,
    filterBySlider,
  };
}
export default useFilter;
