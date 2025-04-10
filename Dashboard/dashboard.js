document.addEventListener("DOMContentLoaded", function () {
  const accordionButtons = document.querySelectorAll(".accordion-btn");
  const accordionContents = document.querySelectorAll(".accordion-content");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const profileSection = document.querySelector(".profile-box");

  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      if (index === 0) {
        profileSection.scrollIntoView({ behavior: "smooth" });
      } else {
        let accordionIndex = index - 1;

        if (accordionButtons[accordionIndex]) {
          accordionContents.forEach((content, i) => {
            if (i !== accordionIndex) {
              content.style.display = "none";
              accordionButtons[i].classList.remove("active");
            }
          });

          accordionButtons[accordionIndex].classList.add("active");
          accordionButtons[accordionIndex].nextElementSibling.style.display = "block";
          accordionButtons[accordionIndex].scrollIntoView({ behavior: "smooth" });
        }
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

  const loginBtn = document.getElementById("loginToggle");
  const isLoggedIn = false;

  if (isLoggedIn) {
    loginBtn.textContent = "Logout";
    loginBtn.onclick = () => alert("You have been logged out.");
  } else {
    loginBtn.textContent = "Login";
    loginBtn.onclick = () => (window.location.href = "../login/login.html");
  }
});
