document.addEventListener("DOMContentLoaded", async function () {
  const accordionButtons = document.querySelectorAll(".accordion-btn");
  const accordionContents = document.querySelectorAll(".accordion-content");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const profileSection = document.querySelector(".profile-box");
  const navIcon = document.getElementById("navProfileIcon");
  const dashboardIcon = document.getElementById("dashboardProfile");
  const loginBtn = document.getElementById("loginToggle");

  // ---------- Profile Image Setup ----------
  const storedProfilePic = localStorage.getItem("profileImage");
  if (storedProfilePic) {
    if (navIcon) navIcon.src = storedProfilePic;
    if (dashboardIcon) dashboardIcon.src = storedProfilePic;
  }

  // ---------- Sidebar Navigation ----------
  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (index === 0) {
        profileSection?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const accordionIndex = index - 1;

      accordionContents.forEach((content, i) => {
        const isActive = i === accordionIndex;
        content.style.display = isActive ? "block" : "none";
        accordionButtons[i].classList.toggle("active", isActive);
      });

      accordionButtons[accordionIndex]?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ---------- Accordion Toggle ----------
  accordionButtons.forEach((button, idx) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const isCurrentlyVisible = content.style.display === "block";

      accordionContents.forEach((c, i) => {
        c.style.display = "none";
        accordionButtons[i].classList.remove("active");
      });

      if (!isCurrentlyVisible) {
        content.style.display = "block";
        button.classList.add("active");
      }
    });
  });

  // ---------- User Info Fetch + Auth Handling ----------
  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/auth/user", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    const username = data.user.fullname || data.user.email;

    const nameEl = document.querySelector(".profile-info h3");
    if (nameEl) {
      nameEl.textContent = `Welcome, ${username}!`;
    }

    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.addEventListener("click", async () => {
        try {
          await fetch("https://pbl-backend-cqot.onrender.com/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (e) {
          console.error("Logout failed", e);
        } finally {
          window.location.href = "../login/login.html";
        }
      });
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    window.location.href = "../login/login.html";
  }
});
