import { useState, useRef, useEffect } from "react";
import Kebab from "./Kebab";

export default function PositionsTable({
  positions,
  formatSilver,
  handleDelete,
  setSelected,
  selected,
  IMPACT_STYLES,
  setEditModal,
  setModalId,
  modal_open,
  handleSoldAll,
}) {
  const menu_ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menu_ref.current && !menu_ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] uppercase tracking-[.2em] text-teal-400">
            Current investments
          </span>
        </div>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["Item", "Qty", "Buy price", "Impact", "P&L", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[9px] uppercase tracking-[.15em] text-[#4a6a7a] pb-2 px-1 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="cursor-pointer transition-colors"
                style={{
                  background: selected.id === p.id ? "#0a1a28" : "transparent",
                }}
              >
                <td className="py-2 px-1 text-[#e8f4f8] font-medium border-t border-[#1a2a3a]">
                  {p?.item}
                </td>
                <td className="py-2 px-1 border-t border-[#1a2a3a]">
                  {p?.qty}
                </td>
                <td className="py-2 px-1 border-t border-[#1a2a3a]">
                  {formatSilver(p?.buyPrice)}
                </td>
                <td className="py-2 px-1 border-t border-[#1a2a3a]">
                  <span
                    className={`text-[9px] uppercase tracking-[.1em] px-1.5 py-0.5 border rounded-sm ${IMPACT_STYLES[p.impact]}`}
                  >
                    {p?.impact}
                  </span>
                </td>
                <td
                  className={`py-2 px-1 border-t border-[#1a2a3a] ${p?.pnl >= 0 ? "text-teal-400" : "text-red-400"}`}
                >
                  {p?.pnl >= 0 ? "+" : ""}
                  {p?.pnl?.toFixed(1) ?? 0}%
                </td>
                <td className="py-2 px-1  border-t border-[#1a2a3a]">
                  <Kebab
                    item_id={p?.id}
                    menu_ref={menu_ref}
                    open={open}
                    setOpen={setOpen}
                    id={id}
                    setId={setId}
                    setEditModal={setEditModal}
                    setModalId={setModalId}
                    modal_open={modal_open}
                    handleSoldAll={handleSoldAll}
                    handleDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
