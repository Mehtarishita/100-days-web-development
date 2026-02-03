let count = 0;

const countDisplay = document.getElementById("count");

function increase() {
    count++;
    updateDisplay();
}

function decrease() {
    count--;
    updateDisplay();
}

function reset() {
    count = 0;
    updateDisplay();
}

function updateDisplay() {
    countDisplay.textContent = count;
}
