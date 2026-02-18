// 🔥 PROTECTED ROUTE CHECK

if(!localStorage.getItem("loggedIn")) {

    // Not logged in → go back to login
    window.location.href = "login.html";
}

function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";
}
