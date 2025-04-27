document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginToggle");
  const profileImg = document.getElementById("navProfileImage");

  if (!loginBtn || !profileImg) return;

  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/auth/user", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Not logged in");

    const userData = await res.json();

    loginBtn.textContent = "Logout";
    loginBtn.addEventListener("click", async () => {
      await fetch("https://pbl-backend-cqot.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("profileImage");
      window.location.href = "../login/login.html";
    });

    // Fetch profile image separately
    let savedImage = localStorage.getItem("profileImage");

    if (!savedImage) {
      // If not in localStorage, fetch from backend
      const profileRes = await fetch("https://pbl-backend-cqot.onrender.com/profile", {
        credentials: "include",
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        savedImage = profileData.profileImage || "../Dashboard/profile-icon.png";
        localStorage.setItem("profileImage", savedImage);
      } else {
        savedImage = "../Dashboard/profile-icon.png";
      }
    }

    profileImg.src = savedImage;

  } catch (err) {
    // User not logged in
    loginBtn.textContent = "Login";
    loginBtn.addEventListener("click", () => {
      window.location.href = "../login/login.html";
    });

    // Always show default image when not logged in
    const profileImg = document.getElementById("navProfileImage");
    if (profileImg) {
      profileImg.src = "../Dashboard/profile-icon.png";
    }
    localStorage.removeItem("profileImage");
  }
});
