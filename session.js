document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginToggle");

  if (!loginBtn) return;

  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/auth/user", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Not logged in");

    const data = await res.json();
    loginBtn.textContent = "Logout";
    loginBtn.addEventListener("click", async () => {
      await fetch("https://pbl-backend-cqot.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "../login/login.html";
    });
  } catch (err) {
    // Not logged in — keep Login as default
    loginBtn.textContent = "Login";
    loginBtn.addEventListener("click", () => {
      window.location.href = "../login/login.html";
    });
  }
});
