// favorites.js
export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

export function toggleFavorite(item_name) {
  console.log("toggleFavorite", item_name);
  const favs = getFavorites();
  const exists = favs.includes(item_name);
  const updated = exists
    ? favs.filter((f) => f !== item_name)
    : [...favs, item_name];
  console.log(updated, exists);
  localStorage.setItem("favorites", JSON.stringify(updated));
  return !exists;
}

export function isFavorite(item_name) {
  return getFavorites().includes(item_name);
}
