const notesContainer = document.getElementById("notes");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {

    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {

        const div = document.createElement("div");

        div.className = "note";

        div.innerHTML = `
            <span>${note}</span>
            <button onclick="deleteNote(${index})">❌</button>
        `;

        notesContainer.appendChild(div);
    });
}

function addNote() {

    const input = document.getElementById("noteInput");

    if(input.value === "") return;

    notes.push(input.value);

    saveNotes();
    renderNotes();

    input.value = "";
}

function deleteNote(index) {

    notes.splice(index,1);

    saveNotes();
    renderNotes();
}

renderNotes();
