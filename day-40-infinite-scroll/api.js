const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function getPosts(page, limit = 10) {

    const response = await fetch(
        `${API_URL}?_page=${page}&_limit=${limit}`
    );

    if(!response.ok) throw new Error("Fetch failed");

    return response.json();
}