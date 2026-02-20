const loadBtn = document.getElementById("loadBtn");
const usersDiv = document.getElementById("users");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalData = document.getElementById("modalData");
const closeBtn = document.getElementById("close");

let allUsers = [];

loadBtn.addEventListener("click", async () => {

    usersDiv.innerHTML = "Loading...";

    const users = await getUsers();
    allUsers = users;

    renderUsers(users);
});

function renderUsers(users) {

    usersDiv.innerHTML = "";

    users.forEach(user => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
        `;

        div.addEventListener("click", () => openModal(user));

        usersDiv.appendChild(div);
    });
}

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(value)
    );

    renderUsers(filtered);
});

function openModal(user) {

    modal.style.display = "flex";

    modalData.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Company: ${user.company.name}</p>
    `;
}

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
    }
};