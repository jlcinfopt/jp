const carousel = document.getElementById("carousel");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

next.addEventListener("click", () => {
  carousel.scrollBy({ left: 220, behavior: "smooth" });
});

prev.addEventListener("click", () => {
  carousel.scrollBy({ left: -220, behavior: "smooth" });
});
