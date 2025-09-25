// data/seed.js
let items = [
  { id: 1, name: "Sample Item 1", description: "First item" },
  { id: 2, name: "Sample Item 2", description: "Second item" }
];

function getAllItems() {
  return items;
}

function getItemById(id) {
  return items.find(item => item.id === id);
}

function createItem({ name, description }) {
  const newItem = {
    id: items.length ? Math.max(...items.map(i => i.id)) + 1 : 1,
    name,
    description: description || ""
  };
  items.push(newItem);
  return newItem;
}

function updateItem(id, { name, description }) {
  const item = getItemById(id);
  if (!item) return null;
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  return item;
}

function deleteItem(id) {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
