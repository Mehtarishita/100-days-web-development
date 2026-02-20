// API Service Layer (Industry pattern)

const API_URL = "https://jsonplaceholder.typicode.com/users";

async function fetchUsers() {

    const response = await fetch(API_URL);

    if(!response.ok) {
        throw new Error("Failed to fetch");
    }

    return response.json();
}