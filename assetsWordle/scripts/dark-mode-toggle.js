const toggleBtn = document.getElementById("mode-toggle");

toggleBtn.addEventListener("click", () => {
  console.log("clicked");
  document.body.classList.toggle("light-mode");
});
