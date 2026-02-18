const users = [
    { email:"admin@test.com", password:"1234" }
];

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    const user = users.find(u => u.email === email);

    if(!user) {

        error.textContent = "User not found ❌";
        return;
    }

    if(user.password !== password) {

        error.textContent = "Wrong password ❌";
        return;
    }

    localStorage.setItem("loggedIn", true);

    // redirect
    window.location.href = "dashboard.html";
}
