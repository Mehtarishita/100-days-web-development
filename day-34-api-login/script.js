function fakeApiLogin(email, password) {

    // simulate backend delay
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if(email === "admin@test.com" && password === "1234") {

                resolve({
                    token:"abc123xyz"
                });

            } else {

                reject("Invalid credentials");
            }

        },1500);

    });
}


async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    status.textContent = "Logging in... ⏳";

    try {

        const response = await fakeApiLogin(email,password);

        localStorage.setItem("token", response.token);

        status.textContent = "Login success 😈";

    } catch(err) {

        status.textContent = err + " ❌";
    }

}
