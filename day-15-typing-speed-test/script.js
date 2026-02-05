const sentenceEl = document.getElementById("sentence");
const input = document.getElementById("input");
const result = document.getElementById("result");

// IMPORTANT FIX (see problem 2 below)
const sentence = sentenceEl.textContent.trim();

let startTime = null;

input.addEventListener("input", () => {

    console.log(input.value); // debug

    if (!startTime) {
        startTime = new Date();
    }

    if (input.value === sentence) {

        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;

        const words = sentence.split(" ").length;
        const wpm = Math.round((words / timeTaken) * 60);

        result.textContent = `Your speed: ${wpm} WPM`;
    }
});
