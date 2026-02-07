const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("close");

gallery.addEventListener("click", (e) => {

    if(e.target.tagName === "IMG") {

        modal.style.display = "flex";
        modalImg.src = e.target.src;

    }

});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});
