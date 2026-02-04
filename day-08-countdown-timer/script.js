let countdownInterval;

function startCountdown() {
    const eventTime = document.getElementById("eventTime").value;

    if (!eventTime) {
        alert("Please select date & time");
        return;
    }

    const targetDate = new Date(eventTime).getTime();

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("timer").textContent = "🎉 Time's Up!";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("timer").textContent =
            `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;

    }, 1000);
}
