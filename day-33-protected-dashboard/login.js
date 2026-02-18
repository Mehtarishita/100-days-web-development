const users = [
    { email:"admin@test.com", password:"1234" }
];

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(u => u.email === email);

    if(!user || user.password !== password) {

        document.getElementById("error").textContent = "Invalid Login ❌";
        return;
    }

    localStorage.setItem("loggedIn", true);

    window.location.href = "dashboard.html";
}
