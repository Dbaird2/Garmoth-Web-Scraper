// hooks/useInvestmentActions.js
import { useState } from "react";

export function useInvestmentActions(
  sendMessage,
  positions,
  setPositions,
  selected,
  setSelected,
) {
  const [form, setForm] = useState({
    item: "",
    buyPrice: "",
    qty: "",
    date: "",
    event: "",
    notes: "",
  });

  function handleDelete(id) {
    const res = confirm("Are you sure you want to delete this entry?");
    if (res) {
      setPositions((prev) => prev.filter((p) => p.id !== id));
      if (selected.id === id && positions.length > 1) {
        setSelected(positions.find((p) => p.id !== id));
      }
      sendMessage("delete", id);
    }
  }

  function handleSubmit() {
    if (!form.item || !form.buyPrice || !form.qty) return;
    const new_pos = {
      id: Date.now(),
      item: form.item,
      qty: parseInt(form.qty),
      buyPrice: parseInt(form.buyPrice),
      date: form.date,
      pnl: 0,
    };
    setPositions((prev) => [...prev, new_pos]);
    sendMessage("create", new_pos);
    setForm({
      item: "",
      buyPrice: "",
      qty: "",
      date: "",
      event: "",
      notes: "",
    });
  }

  return { form, setForm, handleDelete, handleSubmit };
}
