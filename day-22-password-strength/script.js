const password = document.getElementById("password");
const strength = document.getElementById("strength");
const status = document.getElementById("status");

password.addEventListener("input", () => {

    const value = password.value;

    let score = 0;

    if(value.length >= 6) score++;
    if(/[A-Z]/.test(value)) score++;
    if(/[0-9]/.test(value)) score++;
    if(/[^A-Za-z0-9]/.test(value)) score++;

    if(score === 1) {

        strength.style.width = "25%";
        strength.style.background = "red";
        status.textContent = "Weak";

    } else if(score === 2 || score === 3) {

        strength.style.width = "60%";
        strength.style.background = "orange";
        status.textContent = "Medium";

    } else if(score === 4) {

        strength.style.width = "100%";
        strength.style.background = "limegreen";
        status.textContent = "Strong";

    } else {

        strength.style.width = "0%";
        status.textContent = "";
    }

});

