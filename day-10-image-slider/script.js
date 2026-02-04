const images = [
    "https://picsum.photos/id/1015/600/400",
    "https://picsum.photos/id/1016/600/400",
    "https://picsum.photos/id/1025/600/400",
    "https://picsum.photos/id/1035/600/400"
];

let currentIndex = 0;

const sliderImage = document.getElementById("sliderImage");

// Load first image
sliderImage.src = images[currentIndex];

function nextImage() {
    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    sliderImage.src = images[currentIndex];
}

function prevImage() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    sliderImage.src = images[currentIndex];
}
