import Chart from "./Charts/Chart";
import { useState } from "react";
import { getItem } from "../hooks/API_CALLS";

export function ItemModal({ item }) {
  const modal_id = `dialog-${item.name}`;
  const [data, setData] = useState([]);
  const [modal, setOpen] = useState(false);
  const handleOpen = async () => {
    setOpen(true);
    const data = await getItem(item.name);
    setData(data);
  };
  console.log("data from handleOpen", data);
  return (
    <>
      <button
        onClick={handleOpen}
        command="show-modal"
        commandfor={modal_id}
        className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10 dark:bg-white/10 dark:text-white dark:inset-ring dark:inset-ring-white/5 dark:hover:bg-white/20"
      >
        Open chart
      </button>
      {modal ? (
        <el-dialog>
          <dialog
            id={modal_id}
            aria-labelledby="dialog-title"
            className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
          >
            <el-dialog-backdrop className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

            <div
              tabindex="0"
              className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
            >
              <el-dialog-panel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      id="dialog-title"
                      className="text-base font-semibold text-white"
                    >
                      {item.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mt-2">
                        <Chart
                          data={data}
                          x_axis="recent_time"
                          line="full_price"
                        />
                      </div>
                      <div className="mt-2">
                        <Chart
                          data={data}
                          x_axis="recent_time"
                          line="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {/* <button
                    type="button"
                    command="close"
                    commandfor={modal_id}
                    className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                  >
                    Deactivate
                  </button> */}
                  <button
                    type="button"
                    command="close"
                    commandfor={modal_id}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </el-dialog-panel>
            </div>
          </dialog>
        </el-dialog>
      ) : (
        <span></span>
      )}
    </>
  );
}

export default ItemModal;
