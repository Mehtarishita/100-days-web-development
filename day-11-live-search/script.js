const items = [
    "Apple",
    "Banana",
    "Orange",
    "Mango",
    "Grapes",
    "Pineapple",
    "Strawberry",
    "Watermelon"
];

const searchInput = document.getElementById("searchInput");
const list = document.getElementById("list");

function displayItems(filteredItems) {
    list.innerHTML = "";

    filteredItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// Show all items initially
displayItems(items);

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    const filtered = items.filter(item =>
        item.toLowerCase().includes(searchText)
    );

    displayItems(filtered);
});
