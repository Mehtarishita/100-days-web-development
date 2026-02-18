// 🔥 PROTECTED ROUTE

if(!localStorage.getItem("loggedIn")) {

    window.location.href = "login.html";
}

function showSection(id) {

    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    document.getElementById(id).classList.add("active");
}

function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";
}
