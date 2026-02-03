const colorText = document.getElementById("color");

function changeColor() {
    const randomColor = generateHexColor();
    document.body.style.backgroundColor = randomColor;
    colorText.textContent = randomColor;
}

function generateHexColor() {
    const hexChars = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 16);
        color += hexChars[randomIndex];
    }

    return color;
}
