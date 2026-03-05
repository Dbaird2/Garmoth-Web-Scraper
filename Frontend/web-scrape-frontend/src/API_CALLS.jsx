export async function getAllItems() {
    console.log('getAllItems', 'calling fetch')
  try {
    const res = await fetch("http://localhost:8000/items/all");
    console.log("status", res);
    const json_items = await res.json();
    console.log("json_items", json_items);
    return json_items;
  } catch (e) {
    console.error("getAllItems error", e);
  }
}

export async function getItem(item) {
  let url = "http://localhost:8000/items/" + item;

  const res = await fetch(url);

  const json_item = await res.json();
  console.log("Db res", json_item);
  return json_item;
}
