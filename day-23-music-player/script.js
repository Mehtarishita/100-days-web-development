const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");

let playing = false;
let width = 0;
let interval;

playBtn.addEventListener("click", () => {

    playing = !playing;

    if(playing) {

        playBtn.textContent = "⏸";

        interval = setInterval(() => {

            width++;

            progress.style.width = width + "%";

            if(width >= 100) {

                clearInterval(interval);

                playing = false;

                playBtn.textContent = "▶";
            }

        },100);

    } else {

        playBtn.textContent = "▶";

        clearInterval(interval);
    }

});
