const loadBtn = document.getElementById("loadBtn");
const usersDiv = document.getElementById("users");
const status = document.getElementById("status");

loadBtn.addEventListener("click", async () => {

    status.textContent = "";
    usersDiv.innerHTML = "";

    // Show loading skeletons
    for(let i=0;i<6;i++){
        usersDiv.innerHTML += `<div class="skeleton"></div>`;
    }

    try {

        const users = await getUsers();

        usersDiv.innerHTML = "";

        users.forEach(user => {

            usersDiv.innerHTML += `
                <div class="card">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    <p>${user.company.name}</p>
                </div>
            `;
        });

    } catch(err) {

        usersDiv.innerHTML = "";
        status.innerHTML = `<div class="error">Failed to load users ❌</div>`;
    }

});