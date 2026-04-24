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
    wanted_sell_price: "",
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
      wanted_sell_price: parseInt(form?.wanted_sell_price),
    };
    setPositions((prev) => [...prev, new_pos]);
    sendMessage("create", new_pos);
    setForm({
      item: "",
      buyPrice: "",
      qty: "",
      date: "",
      wanted_sell_price: "",
      notes: "",
    });
  }

  function handleUpdate(id, buy_price, qty, sold_qty) {
    const update_data = {
      id: id,
      buy_price: buy_price,
      qty: qty,
      sold_qty: sold_qty,
    };
    sendMessage("update", update_data);
  }

  function handleSoldAll(id) {
    sendMessage("sold_all", id);
  }

  return {
    form,
    setForm,
    handleDelete,
    handleSubmit,
    handleUpdate,
    handleSoldAll,
  };
}
