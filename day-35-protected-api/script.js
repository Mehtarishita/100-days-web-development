// Fake protected API
function fakeProtectedAPI(token) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if(token === "abc123xyz") {

                resolve(["Secret Note 1", "Secret Note 2"]);

            } else {

                reject("Unauthorized ❌");
            }

        },1000);

    });
}

async function loadData() {

    const status = document.getElementById("status");
    const dataDiv = document.getElementById("data");

    const token = localStorage.getItem("token");

    status.textContent = "Checking access...";

    try {

        const data = await fakeProtectedAPI(token);

        status.textContent = "Access granted 😈";

        dataDiv.innerHTML = data.map(item => `<p>${item}</p>`).join("");

    } catch(err) {

        status.textContent = err;

    }

}
