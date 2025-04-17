document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("flipped"));
    card.classList.add("flipped");
  });
});
