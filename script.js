// --- simple persistent store using localStorage ---
const STORAGE_KEY = "tododis.v1";
const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const save = (todos) => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

// --- state ---
let todos = load(); // each item: { id, text, done }

// --- elements ---
const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const list = document.getElementById("todo-list");
const countSpan = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");

// --- helpers ---
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function setCount() {
  const remaining = todos.filter(t => !t.done).length;
  const total = todos.length;
  countSpan.textContent = `${remaining}/${total} left`;
}
function render() {
  list.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "checkbox";
    cb.checked = todo.done;
    cb.addEventListener("change", () => toggle(todo.id));

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.setAttribute("aria-label", `Delete ${todo.text}`);
    del.textContent = "✕";
    del.addEventListener("click", () => remove(todo.id));

    li.append(cb, label, del);
    list.appendChild(li);
  });
  setCount();
  save(todos);
}
function add(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  todos.unshift({ id: uid(), text: cleaned, done: false });
  render();
}
function toggle(id) {
  todos = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
  render();
}
function remove(id) {
  todos = todos.filter(t => t.id !== id);
  render();
}
function clearCompleted() {
  todos = todos.filter(t => !t.done);
  render();
}

// --- events ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  add(input.value);
  input.value = "";
  input.focus();
});
clearBtn.addEventListener("click", clearCompleted);

// --- initial paint ---
render();
