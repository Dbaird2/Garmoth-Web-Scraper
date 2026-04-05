export async function getAllItems() {
  console.log("getAllItems", "calling fetch");
  try {
    const res = await fetch("https://web-scraper-68z5.onrender.com/items/all");
    const json_items = await res.json();
    return json_items;
  } catch (e) {
    console.error("getAllItems error", e);
  }
}

export async function getItem(item) {
  let url = "https://web-scraper-68z5.onrender.com/items/" + item;

  const res = await fetch(url);

  const json_item = await res.json();
  return json_item;
}

export async function sendEvent(form_data) {
  const res = await fetch("https://web-scraper-68z5.onrender.com/addEvent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form_data),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
