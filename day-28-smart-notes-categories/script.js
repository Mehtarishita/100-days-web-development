const notesContainer = document.getElementById("notes");
const filterCategory = document.getElementById("filterCategory");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {

    const selected = filterCategory.value;

    notesContainer.innerHTML = "";

    notes
        .filter(note => !selected || note.category === selected)
        .forEach((note, index) => {

            const div = document.createElement("div");

            div.className = "note";

            div.innerHTML = `
                <strong>${note.category}</strong>
                <span>${note.text}</span>
                <button onclick="deleteNote(${index})">Delete</button>
            `;

            notesContainer.appendChild(div);
        });
}

function addNote() {

    const text = document.getElementById("noteInput").value;
    const category = document.getElementById("categoryInput").value;

    if(text === "") return;

    notes.push({ text, category });

    saveNotes();
    renderNotes();

    document.getElementById("noteInput").value = "";
}

function deleteNote(index) {

    notes.splice(index,1);

    saveNotes();
    renderNotes();
}

filterCategory.addEventListener("change", renderNotes);

renderNotes();
