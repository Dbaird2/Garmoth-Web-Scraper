import Chart from "./Charts/Chart";
import { useState } from "react";
import { getItem } from "../hooks/API_CALLS";

export function ItemModal({ item }) {
  const modal_id = `dialog-${item.name}`;
  const [data, setData] = useState([]);
  const [modal, setOpen] = useState(false);
  const handleOpen = async () => {
    setOpen(true);

    try {
      const response = await getItem(item.name);
      // ensure we always have an array
      setData(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleOpen}
          command="show-modal"
          commandfor={modal_id}
          className="rounded hover:animate-bounce hover:cursor-pointer w-1/2 border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-400 transition-all duration-150 hover:bg-teal-400/20 hover:shadow-[0_0_14px_rgba(45,212,191,0.2)] hover:-translate-y-px active:translate-y-0"
        >
          ↗ Open Chart
        </button>
      </div>
      {modal ? (
        <el-dialog>
          <dialog
            id={modal_id}
            aria-labelledby="dialog-title"
            className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
          >
            <el-dialog-backdrop className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

            <div
              tabIndex="0"
              className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
            >
              <el-dialog-panel className="relative transform overflow-hidden rounded-xl border border-white/[0.07] bg-[#0a1018] text-left shadow-[0_0_0_1px_rgba(45,212,191,0.08),0_32px_80px_rgba(0,0,0,0.7)] transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                {/* Teal top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

                <div className="bg-[#0a1018] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {data.length > 0 ? (
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      {/* Header */}
                      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-white/[0.07]">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
                        <h3
                          id="dialog-title"
                          className="text-[15px] font-extrabold tracking-tight text-slate-200 "
                        >
                          {item.name}
                        </h3>
                      </div>

                      <div className="gap-4">
                        <div className="mt-2 rounded-lg border border-white/[0.07] p-4 transition-colors hover:border-teal-400/30">
                          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-teal-400">
                            <span className="inline-block h-px w-4 bg-teal-400/50" />
                            Full Price
                          </div>
                          <Chart
                            data={data}
                            y_axis_1="full_price"
                            y_axis_2="percentage"
                            x_axis="recent_time"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-teal-400 font-medium">
                      No Data Available
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.07] bg-[#080c12]/90 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    command="close"
                    commandfor={modal_id}
                    className="mt-3 inline-flex w-full justify-center rounded border border-white/[0.07] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:border-white/[0.18] hover:bg-white/[0.04] hover:text-slate-200 sm:mt-0 sm:w-auto"
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
