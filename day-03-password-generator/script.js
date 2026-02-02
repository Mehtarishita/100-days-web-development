const passwordField = document.getElementById("password");
const lengthInput = document.getElementById("length");

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+{}[]<>?";

function generatePassword() {
    let characters = "";
    let password = "";

    if (document.getElementById("uppercase").checked)
        characters += uppercase;

    if (document.getElementById("lowercase").checked)
        characters += lowercase;

    if (document.getElementById("numbers").checked)
        characters += numbers;

    if (document.getElementById("symbols").checked)
        characters += symbols;

    if (characters === "") {
        alert("Please select at least one option");
        return;
    }

    const length = lengthInput.value;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    passwordField.value = password;
}
