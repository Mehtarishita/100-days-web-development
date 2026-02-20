const btn = document.getElementById("fetchBtn");
const status = document.getElementById("status");
const dataDiv = document.getElementById("data");

btn.addEventListener("click", async () => {

    status.textContent = "Fetching data... ⏳";

    try {

        const users = await fetchUsers();

        status.textContent = "Success 😈";

        dataDiv.innerHTML = users.map(user => `
            <p>${user.name}</p>
        `).join("");

    } catch(err) {

        status.textContent = "Error ❌";
    }

});