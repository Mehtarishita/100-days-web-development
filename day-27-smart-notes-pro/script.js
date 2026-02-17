const notesContainer = document.getElementById("notes");
const searchInput = document.getElementById("searchInput");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(filter = "") {

    notesContainer.innerHTML = "";

    notes
        .filter(note => note.toLowerCase().includes(filter.toLowerCase()))
        .forEach((note, index) => {

            const div = document.createElement("div");

            div.className = "note";

            div.innerHTML = `
                <span contenteditable="true" onblur="editNote(${index}, this.innerText)">
                    ${note}
                </span>

                <button onclick="deleteNote(${index})">Delete</button>
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
    renderNotes(searchInput.value);
}

function editNote(index, newText) {

    notes[index] = newText;

    saveNotes();
}

searchInput.addEventListener("input", () => {

    renderNotes(searchInput.value);
});

renderNotes();
