document.addEventListener("DOMContentLoaded", function () {
  // Only run auth check if not already handled elsewhere
  // Remove or comment out the following block if auth is checked in another script
  /*
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
  }
  */

  // Theme toggling
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return; // Prevent errors if button not found

  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(currentTheme + "-mode");
  themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", function () {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.replace("light-mode", "dark-mode");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.replace("dark-mode", "light-mode");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
});