let seconds = 0;
let intervalId = null;

const timeDisplay = document.getElementById("time");

function start() {
    if (intervalId !== null) return;

    intervalId = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function stop() {
    clearInterval(intervalId);
    intervalId = null;
}

function reset() {
    stop();
    seconds = 0;
    updateDisplay();
}

function updateDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    timeDisplay.textContent =
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
