export default function Kebab({
  menu_ref,
  item_id,
  open,
  setOpen,
  id,
  setId,
  setEditModal,
  setModalId,
  modal_open,
  handleSoldAll,
  handleDelete
}) {
  const options = [
    {
      label: "Edit",
      onClick: (e) => {
        handleEditModal(id);
      },
    },
    { label: "Sold", onClick: () => handleSoldAll(id) },
    {
      label: "Remove",
      onClick: (e) => {
        e.stopPropagation();
        handleDelete(id);
      },
    },
  ];
  const handleEditModal = (item_id) => {
    setEditModal(!modal_open)
    setModalId(item_id);
  }
  const handleKebab = (item_id) => {
    setOpen(!open);
    setId(item_id);
  };
  return (
    <>
      <button
        onClick={() => handleKebab(item_id)}
        className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 border border-teal-400/30 text-teal-400/70 hover:text-teal-400 hover:border-teal-400 rounded transition-colors duration-150"
      >
        ⋮
      </button>
      {open && id === item_id && (
        <div className="relative" ref={menu_ref}>
          <div className="absolute right-0 mt-1 w-fit bg-[#1a2535] border border-white/10 rounded-lg shadow-lg z-50">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  opt.onClick();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white first:rounded-t-lg last:rounded-b-lg"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
