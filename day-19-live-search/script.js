const searchInput = document.getElementById("searchInput");
const items = document.querySelectorAll("#list li");
const noResult = document.getElementById("noResult");

searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.toLowerCase();

    let matchFound = false;

    items.forEach(item => {

        const originalText = item.textContent;
        const text = originalText.toLowerCase();

        if(text.includes(searchText)) {

            matchFound = true;

            item.style.display = "block";

            // Highlight matched text
            const highlighted = originalText.replace(
                new RegExp(searchText, "gi"),
                match => `<span class="highlight">${match}</span>`
            );

            item.innerHTML = highlighted;

        } else {

            item.style.display = "none";

        }

    });

    noResult.style.display = matchFound ? "none" : "block";

});
