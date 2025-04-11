document.addEventListener("DOMContentLoaded", function () {
  const authBtn = document.getElementById("auth-btn");
  const profilePhoto = document.getElementById("nav-profile-photo");

  // 🔄 Set profile photo if available
  const storedPhoto = localStorage.getItem("profilePhoto");
  if (storedPhoto) {
    profilePhoto.src = storedPhoto;
  }

  // 🔐 Login/logout toggle
  function updateAuthButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      authBtn.textContent = "Logout";
      authBtn.onclick = () => {
        localStorage.setItem("isLoggedIn", "false");
        location.reload();
      };
    } else {
      authBtn.textContent = "Login";
      authBtn.onclick = () => {
        window.location.href = "../login/login.html";
      };
    }
  }

  updateAuthButton();

  // 📧 Handle Send Message click
  document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = encodeURIComponent(document.getElementById("name").value);
    const email = encodeURIComponent(document.getElementById("email").value);
    const message = encodeURIComponent(document.getElementById("message").value);

    const mailtoLink = `mailto:rohitsable504@gmail.com?subject=Contact%20Query%20from%20${name}&body=Name:%20${name}%0AEmail:%20${email}%0AMessage:%0A${message}`;

    window.location.href = mailtoLink;
  });
});
