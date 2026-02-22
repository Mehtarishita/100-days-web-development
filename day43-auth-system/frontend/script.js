import { API } from "./api.js";

document.getElementById("loginBtn").addEventListener("click", async () => {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = await API.login(username, password);

  console.log("LOGIN RESPONSE:", data); // debugging

  if(data.token){

    localStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";

  } else {
    alert("Login failed");
  }

});