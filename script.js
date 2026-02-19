// simulate backend API

function fakeServer(requestHeaders) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            const authHeader = requestHeaders.Authorization;

            if(authHeader === "Bearer abc123xyz") {

                resolve(["Private Data A", "Private Data B"]);

            } else {

                reject("Access denied ❌");
            }

        },1000);

    });

}


async function getProtectedData() {

    const status = document.getElementById("status");
    const result = document.getElementById("result");

    const token = localStorage.getItem("token");

    status.textContent = "Sending request...";

    try {

        // REAL INDUSTRY FORMAT

        const response = await fakeServer({

            Authorization: `Bearer ${token}`

        });

        status.textContent = "Success 😈";

        result.innerHTML = response.map(item => `<p>${item}</p>`).join("");

    } catch(err) {

        status.textContent = err;
    }

}
