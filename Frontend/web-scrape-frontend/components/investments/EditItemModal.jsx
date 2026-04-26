export default function EditItemModal({
  modal_ref,
  modal_open,
  setEditModal,
  modal_id,
  positions,
  handleUpdate,
}) {
  console.log("EditItemModal", modal_id, modal_open);
  const item = positions.find((p) => p.id === modal_id);
  if (!modal_open || !item) return null;

  return (
    <div className="z-999 absolute inset-0 h-[120vh] backdrop-blur-md bg-black/40 flex items-center justify-center">
      <div
        ref={modal_ref}
        className="w-full max-w-md bg-[#0f1622] border border-white/[0.07] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h2
            className="text-white font-semibold text-base tracking-wide"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Edit Investment
          </h2>
          <button
            onClick={() => setEditModal(false)}
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-teal-500 uppercase tracking-widest">
              {item?.item}
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-widest">
              Buy Price
            </label>
            <input
              defaultValue={item?.buyPrice}
              type="number"
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-widest">
              Quantity
            </label>
            <input
              defaultValue={item?.qty}
              type="number"
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-widest">
              Sold
            </label>
            <input
              defaultValue={item?.sold_qty}
              type="number"
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.07] flex justify-end gap-3">
          <button
            onClick={() => setEditModal(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-teal-400/10 hover:bg-teal-400/20 text-teal-400 border border-teal-400/20 rounded-lg text-sm font-medium transition-colors"
            onClick={() =>
              handleUpdate(item?.id, item?.buyPrice, item?.qty, item?.sold_qty)
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
