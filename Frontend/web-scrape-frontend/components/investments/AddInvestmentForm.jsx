export default function AddInvestmentForm({ form, setForm, handleSubmit }) {
  return (
    <>
      {/* Add position form */}
      <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5 mb-5">
        <p className="text-[11px] uppercase tracking-[.2em] text-teal-400 mb-4">
          Add Investment
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
              Item name
            </span>
            <input
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              placeholder="Search item..."
              className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
            />
          </div>
          {[
            {
              label: "Buy price (silver)",
              key: "buyPrice",
              type: "number",
              placeholder: "0",
            },
            {
              label: "Quantity",
              key: "qty",
              type: "number",
              placeholder: "0",
            },
            {
              label: "Date purchased",
              key: "date",
              type: "date",
              placeholder: "",
            },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
                {label}
              </span>
              {form[key] === "number" ?
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
              />
              :
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
              />
              }
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-[.15em] text-[#4a6a7a]">
              Wanted Sell Price
            </span>
            <input
              value={form.event}
              type="number"
              onChange={(e) => setForm({ ...form, event: e.target.value })}
              className="bg-[#0a1018] border border-[#1a2a3a] rounded text-[#c8d8e8] text-[12px] px-3 py-2 font-mono outline-none"
              thousandSeparator
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-[#0f6e56] border border-[#1d9e75] text-teal-400 text-[10px] uppercase tracking-[.2em] py-2.5 rounded font-mono hover:bg-[#0d5c47] transition-colors"
        >
          Add to investments
        </button>
      </div>
    </>
  );
}
