import { useEffect, useState } from "react";
import { getAllItems, getItem } from "./API_CALLS";

function App() {
  const [item_list, addToList] = useState([]);
  const [temp_list, setTempList] = useState(item_list);
  const [sorted, setSorted] = useState(false);
  const [search, setSearch] = useState(true);
  const [slider_val, setSliderValue] = useState(0);
  console.log(item_list, "item_list1");
  useEffect(() => {
    console.log("UseEffect going");
    // const intervalId = setInterval(() => {
    const allItemInterval = async () => {
      console.log("Running async");
      const items = await getAllItems();
      console.log("items", items);
      addToList(items);
      setTempList(items);
    };
    allItemInterval();
    // }, 10000);
    console.log("Done with useEffect");
  }, []);

  console.log("item_list", item_list);
  const filterItems = () => {
    console.log(search);
    const new_list = item_list.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()),
    );
    setTempList(new_list);
    // let temp_item_list = filtered
    //   ? [...item_list].filter((a) => a.percentage < 0)
    //   : [...item_list].filter((a) => a.percentage > 0);
    // setTempList(temp_item_list);
    // setFiltered(!filtered);
  };

  const sortItems = () => {
    console.log("sorting");
    let temp_item_list = sorted
      ? [...temp_list].sort((a, b) => a.percentage - b.percentage)
      : [...temp_list].sort((a, b) => b.percentage - a.percentage);
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
  console.log('slider_va', slider_val)
  return (
    <>
      <div className="m-0 relative h-full w-full [background:radial-gradient(125%_125%_at_70%_100%,#000_20%,#137_650%)]">
        <div className="inset-0">
          <div className=" relative z-20 self-center h-[3rem] px-4 flex justify-center space-between">
            <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:text-teal-200 font-bold">
              <input
                placeholder="Search Item"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
              <span className="cursor-pointer" onClick={filterItems}>
                Filter
              </span>
            </div>
            <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
              <span className="cursor-pointer" onClick={sortItems}>
                Sort
              </span>
            </div>
            <div className="text-teal-200 transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
              <span className="cursor-pointer text-sm" onClick={sortItems}>
                {slider_val ?? 0}%
              </span>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                defaultValue={0}
                onChange={(e) => filterBySlider(Number(e.target.value))}
                className="w-full accent-teal-200"
              />
            </div>
            <div className="p-4 mr-4 text-white transition delay-50 duration-300 ease-in-out hover:scale-105 hover:animate-pulse hover:text-teal-200 font-bold">
              <span className="cursor-pointer" onClick={resetItems}>
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
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_20%,#137_650%)]"></div>
        </div>

        <div className="w-[90rem] mx-auto">
          <div className="text-center">
            {/* <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
              Your Next Great
              <span className="text-sky-400"> Project</span>
            </h1> */}
            <div className="text-slate-300 text-[1rem] m-4 grid grid-cols-5 gap-4">
              {temp_list.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 p-4 flex flex-col gap-2"
                >
                  <h3 className="font-semibold text-white truncate">
                    {item.name}
                  </h3>
                  <div
                    className={
                      item.percentage >= 0
                        ? "h-px bg-green-400"
                        : "h-px bg-red-400"
                    }
                  />
                  <div className="flex justify-between text-md">
                    <span className="text-slate-400">Change</span>
                    <span
                      className={
                        item.percentage >= 0 ? "text-green-400" : "text-red-400"
                      }
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Price</span>
                    <span className="text-white">
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Stock</span>
                    <span className="text-white">
                      {item.stock.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="flex flex-wrap justify-center gap-4">
              <button className="rounded-lg px-6 py-3 font-medium bg-sky-400 text-slate-900 hover:bg-sky-300">
                Get Started
              </button>
              <button className="rounded-lg border px-6 py-3 font-medium border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                Learn More
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
