function setActiveNav(section) {
  document.querySelectorAll(".nav-btn, .bnav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.section === section);
  });
}

function switchSection(target) {
  setActiveNav(target);
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = section.id === "section-" + target ? "block" : "none";
  });
  if (target === "calendar") renderCalendar();
  if (target === "results") renderResults();
  if (target === "leaderboard") renderLeaderboard();
  if (target === "fees") renderFees();
  initIcons();
}

document.querySelectorAll(".nav-btn, .bnav-btn").forEach(button => {
  button.addEventListener("click", () => switchSection(button.dataset.section));
});
