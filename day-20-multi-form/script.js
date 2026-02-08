const form = document.getElementById("myForm");
const message = document.getElementById("message");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;

    if(!name || !email || !age || !gender) {

        message.textContent = "Please fill all fields ❌";
        return;
    }

    if(!email.includes("@")) {

        message.textContent = "Email must contain @";
        return;
    }

    message.textContent = "Form Submitted Successfully 🎉";

});
