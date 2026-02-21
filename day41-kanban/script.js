import { API } from "./api.js";
import { state } from "./state.js";

const columns = document.querySelectorAll(".column");
const addBtn = document.getElementById("addTaskBtn");

let draggedId = null;

// INIT APP

async function init() {

 const tasks = await API.fetchTasks();
 state.setTasks(tasks);

 render();

}

init();


// RENDER FUNCTION

function render() {

 document.querySelectorAll(".task-container")
 .forEach(el => el.innerHTML = "");

 state.tasks.forEach(task => {

  const el = document.createElement("div");
  el.className = "task";
  el.draggable = true;
  el.textContent = task.title;
  el.dataset.id = task.id;

  addDragEvents(el);

  document
   .querySelector(`[data-status="${task.status}"] .task-container`)
   .appendChild(el);

 });

}


// DRAG LOGIC

function addDragEvents(el) {

 el.addEventListener("dragstart", () => {
  draggedId = el.dataset.id;
  el.classList.add("dragging");
 });

 el.addEventListener("dragend", () => {
  el.classList.remove("dragging");
 });

}

columns.forEach(col => {

 col.addEventListener("dragover", e => e.preventDefault());

 col.addEventListener("drop", async () => {

  const newStatus = col.dataset.status;

  // Optimistic update
  state.moveTask(draggedId, newStatus);
  render();

  // backend sync
  await API.updateTask(draggedId, newStatus);

 });

});


// CREATE TASK

addBtn.addEventListener("click", async () => {

 const title = prompt("Task name?");
 if(!title) return;

 const newTask = await API.createTask(title);

 state.addTask(newTask);
 render();

});