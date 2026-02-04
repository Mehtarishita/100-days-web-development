const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        correct: 2
    },
    {
        question: "Inside which HTML element do we put JavaScript?",
        options: ["<js>", "<javascript>", "<script>", "<scripting>"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionButtons = document.querySelectorAll(".options button");
const progressEl = document.getElementById("progress");

loadQuestion();

function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    questionEl.textContent = currentQuiz.question;

    optionButtons.forEach((btn, index) => {
        btn.textContent = currentQuiz.options[index];
    });

    progressEl.textContent =
        `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function selectAnswer(selectedIndex) {
    const correctIndex = quizData[currentQuestion].correct;

    if (selectedIndex === correctIndex) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.querySelector(".quiz-container").innerHTML = `
        <h2>🎉 Quiz Completed</h2>
        <p>Your Score: ${score} / ${quizData.length}</p>
    `;
}
