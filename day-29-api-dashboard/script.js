const cards = document.getElementById("cards");
const loading = document.getElementById("loading");

async function loadUsers() {

    loading.textContent = "Loading users...";

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    const data = await response.json();

    loading.textContent = "";

    cards.innerHTML = "";

    data.forEach(user => {

        const div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.company.name}</p>
        `;

        cards.appendChild(div);
    });

}
