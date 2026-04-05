import { useState } from "react";
import { sendEvent } from "../hooks/API_CALLS";

export default function EventForm() {
  const [item_set, setItem] = useState([]);
  const [form_data, setFormData] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
    items: item_set,
  });
  const [item_name, setItemName] = useState("Memory Fragment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev_state) => ({ ...prev_state, [name]: value }));
  };

  const addItemToSet = () => {
    const item = item_name.trim();
    if (!item_set.includes(item)) {
      setItem((prev_stack) => [...prev_stack, item]);
      setFormData((prev_state) => ({ ...prev_state, ["items"]: item_set }));
    }
  };

  const deleteFromSet = (item) => {
    item = item.trim();
    const new_item_set = item_set.filter((item_name) => item_name != item);
    setItem(new_item_set);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await sendEvent(form_data);
      if (res == "Error") {
        console.error("EventForm | Error with res");
        setError("Error submitting form");
      } else {
        setItem([]);
        setFormData({
          event_name: "",
          start_date: "",
          end_date: "",
          items: item_set,
        });
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Unexpected error submitting form");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#060d14] border border-[#1a2a3a] rounded-sm px-3 py-2 font-mono text-sm text-[#c8d8e8] placeholder-[#2d4555] focus:outline-none focus:border-teal-500/50 transition-colors duration-200";

  const labelClass =
    "font-mono text-[10px] uppercase tracking-widest text-teal-600 mb-1.5 block";
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#090e14] flex items-center justify-center">
        <div className="bg-[#0d1520] border border-[#1a2a3a] border-l-2 border-l-teal-500 rounded-sm p-6 flex flex-col gap-4 w-80">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 opacity-70">
            // admin access
          </p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="password"
            className="bg-[#060d14] border border-[#1a2a3a] rounded-sm px-3 py-2 font-mono text-sm text-[#c8d8e8] focus:outline-none focus:border-teal-500/50"
          />
          <button
            onClick={() =>
              setAuthed(input === import.meta.env.VITE_ADMIN_PASSWORD)
            }
            className="font-mono text-[10px] uppercase tracking-widest py-2 border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 rounded-sm transition-all duration-200"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen bg-[#090e14] flex items-start justify-center pt-16 px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {" "}
      {loading ? (
        <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
          <svg
            class="text-gray-300 animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-900"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="w-full max-w-lg">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 opacity-70 mb-4">
            // add event
          </p>

          <div className="bg-[#0d1520] border border-[#1a2a3a] border-l-2 border-l-teal-500 rounded-sm p-6 flex flex-col gap-6">
            {/* Event Name */}
            <div>
              <label className={labelClass}>Event Name</label>
              <input
                type="text"
                name="event_name"
                value={form_data.event_name}
                onChange={handleChange}
                placeholder="e.g. Patrigio's Special Shop"
                className={inputClass}
              />
            </div>

            {/* Dates */}
            <div>
              <label className={labelClass}>Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-[#2d4555] mb-1 block">
                    Start
                  </label>
                  <input
                    type="text"
                    name="start_date"
                    value={form_data.start_date}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-[#2d4555] mb-1 block">
                    End
                  </label>
                  <input
                    type="text"
                    name="end_date"
                    value={form_data.end_date}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <label className={labelClass}>Items</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="items"
                  value={item_name}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item name"
                  className={`${inputClass} flex-1`}
                />
                <button
                  onClick={addItemToSet}
                  className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-teal-500/40 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-500/60 rounded-sm transition-all duration-200 shrink-0"
                >
                  + Add
                </button>
              </div>

              {/* Item list */}
              {item_set.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {item_set.map((item, key) => (
                    <li
                      key={item}
                      className="flex flex-row justify-between items-center text-[13px] text-[#8aa8b8] px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a] hover:border-teal-400 hover:text-[#c8d8e8] transition-colors"
                    >
                      <span className="font-mono">
                        <span className="text-[#2d4555] mr-2">
                          {String(key + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </span>
                      <button
                        onClick={() => deleteFromSet(item)}
                        className="font-mono text-[10px] text-red-500/50 hover:text-red-400 px-2 py-0.5 border border-transparent hover:border-red-500/30 rounded-sm transition-all duration-200"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {item_set.length === 0 && (
                <p className="font-mono text-[11px] text-[#1a2a3a] mt-3">
                  no items added yet
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-teal-500/20 to-transparent" />

            {/* Submit */}
            {error && <span className="text-red-400/60">{error}</span>}
            <button
              className="w-full font-mono text-[11px] uppercase tracking-widest py-2.5 border border-teal-500/50 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-500 rounded-sm transition-all duration-200"
              onClick={handleSubmit}
            >
              Submit Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
