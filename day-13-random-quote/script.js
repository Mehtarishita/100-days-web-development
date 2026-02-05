const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");

async function generateQuote() {

    try {
        const response = await fetch("https://dummyjson.com/quotes/random");


        const data = await response.json();

        quoteEl.textContent = data.quote;
        authorEl.textContent = "- " + data.author;

    } catch (error) {
        quoteEl.textContent = "Failed to load quote 😢";
        authorEl.textContent = "";
    }
}
