const feed = document.getElementById("feed");
const loading = document.getElementById("loading");

let page = 1;
let isLoading = false;

async function loadPosts() {

    if(isLoading) return;

    isLoading = true;
    loading.textContent = "Loading more...";

    const posts = await getPosts(page);

    posts.forEach(post => {

        const div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;

        feed.appendChild(div);
    });

    page++;
    isLoading = false;
    loading.textContent = "";
}

// initial load
loadPosts();

// detect scroll near bottom

window.addEventListener("scroll", () => {

    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {

        loadPosts();
    }

});