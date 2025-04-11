document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-upload");
  const profileIcon = document.getElementById("profile-icon");
  const removeBtn = document.getElementById("remove-btn");
  const loginBtn = document.getElementById("login-btn");

  // Load stored image on page load
  const storedImage = localStorage.getItem("profileImage");
  if (storedImage) {
    profileIcon.src = storedImage;
    removeBtn.style.display = "inline-block";
  }

  // File upload handler
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        profileIcon.src = imageUrl;
        localStorage.setItem("profileImage", imageUrl);
        removeBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Remove button handler
  removeBtn.addEventListener("click", function () {
    localStorage.removeItem("profileImage");
    profileIcon.src = "../assets/default-user.png";
    fileInput.value = "";
    removeBtn.style.display = "none";
  });

  // Login/Logout toggle logic
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  loginBtn.textContent = isLoggedIn ? "Logout" : "Login";

  loginBtn.addEventListener("click", () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      localStorage.setItem("isLoggedIn", "false");
      loginBtn.textContent = "Login";
    } else {
      localStorage.setItem("isLoggedIn", "true");
      loginBtn.textContent = "Logout";
    }
  });

  // Clicking profile icon goes to profile page
  profileIcon.addEventListener("click", function () {
    window.location.href = "profile.html";
  });
});
