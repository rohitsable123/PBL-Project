window.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("homeProfilePic");
  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    profilePic.src = savedImage;
  } else {
    profilePic.src = "profile-icon.png"; // Default icon
  }
});
