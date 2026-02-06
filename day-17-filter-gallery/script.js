const gallery = document.getElementById("gallery");

const ACCESS_KEY = "V6jWbChGnajiaVf0swMe-bep9YQ_2sKQR6CEW6pTod4"; // put your API key here

async function loadImages() {

    try {

        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}`
        );

        const data = await response.json();

        gallery.innerHTML = "";

        data.forEach(photo => {

            const img = document.createElement("img");

            img.src = photo.urls.small;

            gallery.appendChild(img);

        });

    } catch(error) {

        console.log("Error loading images");

    }

}
