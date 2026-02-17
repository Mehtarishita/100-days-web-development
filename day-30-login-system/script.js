const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const error = document.getElementById("error");

// 🔥 Fake Database (like backend users)
const users = [
    { email: "admin@test.com", password: "1234" },
    { email: "rishita@test.com", password: "pass123" },
    { email: "user@test.com", password: "abcd" }
];

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    error.textContent = "Checking...";

    // simulate server delay
    setTimeout(() => {

        const user = users.find(u => u.email === email);

        if(!user) {

            error.textContent = "User not found ❌";
            return;
        }

        if(user.password !== password) {

            error.textContent = "Wrong password ❌";
            return;
        }

        // SUCCESS LOGIN
        loginBox.style.display = "none";
        dashboard.style.display = "block";

        localStorage.setItem("loggedIn", email);

        error.textContent = "";

    }, 800);
}

function logout() {

    localStorage.removeItem("loggedIn");

    dashboard.style.display = "none";
    loginBox.style.display = "block";
}

// 🔥 Auto login session check
const session = localStorage.getItem("loggedIn");

if(session) {

    loginBox.style.display = "none";
    dashboard.style.display = "block";
}
