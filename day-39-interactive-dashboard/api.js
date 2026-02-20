const API_URL = "https://jsonplaceholder.typicode.com/users";

async function getUsers() {

    const response = await fetch(API_URL);

    if(!response.ok) throw new Error("Error");

    return response.json();
}