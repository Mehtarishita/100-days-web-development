const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load saved tasks
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTask(taskText);
    saveTask(taskText);
    taskInput.value = "";
}

function createTask(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
        ${taskText}
        <button onclick="removeTask(this)">X</button>
    `;
    taskList.appendChild(li);
}

function removeTask(button) {
    const li = button.parentElement;
    removeFromStorage(li.textContent.slice(0, -1));
    li.remove();
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
}

function removeFromStorage(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
