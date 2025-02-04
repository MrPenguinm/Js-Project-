// [1] https://github.com/
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");

// [2]
let todos = JSON.parse(localStorage.getItem("todos")) || [];

//
function updateEmptyState() {
  emptyState.style.display = todos.length === 0 ? "block" : "none";
}

//
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// [3]
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  const checkbox = document.createElement("div");
  checkbox.className = `checkbox ${todo.completed ? "checked" : ""}`;
  checkbox.addEventListener("click", () => toggleTodo(todo.id));

  const textSpan = document.createElement("span");
  textSpan.className = `todo-text ${todo.completed ? "completed" : ""}`;
  textSpan.textContent = todo.text;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "action-buttons";

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditing(todo));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  actionsDiv.append(editButton, deleteButton);
  li.append(checkbox, textSpan, actionsDiv);

  return li;
}

// [4]
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = { id: Date.now().toString(), text, completed: false };
  todos.push(newTodo);
  todoList.appendChild(createTodoElement(newTodo));
  saveTodos();
  updateEmptyState();
  todoInput.value = "";
}

// [5]
function toggleTodo(id) {
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// [6]
function startEditing(todo) {
  todoInput.value = todo.text;
  addButton.textContent = "Save";
  addButton.dataset.editingId = todo.id;
}

//[7]
function saveEdit() {
  const id = addButton.dataset.editingId;
  const text = todoInput.value.trim();
  if (!id || !text) return;

  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.text = text;
    saveTodos();
    renderTodos();
  }

  addButton.textContent = "Add";
  delete addButton.dataset.editingId;
  todoInput.value = "";
}

// [8]
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

//[9]
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
  updateEmptyState();
}

// [10]
document.addEventListener("DOMContentLoaded", renderTodos);

// [11]
addButton.addEventListener("click", () => {
  if (addButton.dataset.editingId) {
    saveEdit();
  } else {
    addTodo();
  }
});
