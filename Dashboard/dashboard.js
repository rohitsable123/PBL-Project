document.addEventListener("DOMContentLoaded", function () {
  const accordionButtons = document.querySelectorAll(".accordion-btn");
  const accordionContents = document.querySelectorAll(".accordion-content");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const profileSection = document.querySelector(".profile-box");

  // Sidebar Navigation Logic
  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      if (index === 0) {
        profileSection.scrollIntoView({ behavior: "smooth" });
      } else {
        let accordionIndex = index - 1;

        accordionContents.forEach((content, i) => {
          content.style.display = i === accordionIndex ? "block" : "none";
          accordionButtons[i].classList.toggle("active", i === accordionIndex);
        });

        accordionButtons[accordionIndex].scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  accordionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;

      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        accordionContents.forEach((c) => (c.style.display = "none"));
        content.style.display = "block";
      }
    });
  });

  // Load profile picture from localStorage
  const storedProfilePic = localStorage.getItem("profileImage");
  const navIcon = document.getElementById("navProfileIcon");
  const dashboardIcon = document.getElementById("dashboardProfile");

  if (storedProfilePic) {
    navIcon.src = storedProfilePic;
    dashboardIcon.src = storedProfilePic;
  }
});

// dashboard.js

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/auth/user", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      const username = data.user.fullname || data.user.email;

      // Replace the welcome text
      const nameEl = document.querySelector(".profile-info h3");
      if (nameEl) {
        nameEl.textContent = `Welcome, ${username}!`;
      }

      // Optional: toggle login/logout button
      const loginBtn = document.getElementById("loginToggle");
      if (loginBtn) {
        loginBtn.textContent = "Logout";
        loginBtn.onclick = async () => {
          await fetch("https://pbl-backend-cqot.onrender.com/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          window.location.href = "../login/login.html";
        };
      }

    } else {
      // Not logged in - redirect to login
      window.location.href = "../login/login.html";
    }

  } catch (err) {
    console.error("Error fetching user info", err);
    window.location.href = "../login/login.html";
  }
});

