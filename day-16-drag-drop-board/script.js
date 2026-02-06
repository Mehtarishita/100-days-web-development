// Select all cards and columns
const cards = document.querySelectorAll(".card");
const columns = document.querySelectorAll(".column");

let draggedCard = null;

// ---------- DRAG FUNCTION (Reusable) ----------
function addDragEvents(card) {

    card.addEventListener("dragstart", () => {
        draggedCard = card;
    });

}

// Apply drag events to existing cards
cards.forEach(card => {
    addDragEvents(card);
});


// ---------- COLUMN DROP LOGIC ----------
columns.forEach(column => {

    // Allow dropping
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    // Drop card into column
    column.addEventListener("drop", () => {
        if (draggedCard) {
            column.appendChild(draggedCard);
        }
    });

});


// ---------- ADD NEW TASK FUNCTION ----------
function addTask() {

    const input = document.getElementById("taskInput");
    const todoColumn = document.getElementById("todo");

    const taskText = input.value.trim();

    if (taskText === "") return;

    // Create new card
    const newCard = document.createElement("div");

    newCard.classList.add("card");
    newCard.setAttribute("draggable", "true");
    newCard.textContent = taskText;

    // VERY IMPORTANT → add drag behaviour
    addDragEvents(newCard);

    // Add card to Todo column
    todoColumn.appendChild(newCard);

    // Clear input
    input.value = "";
}
