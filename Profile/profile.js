function goBack() {
  window.history.back();
}

function showNotifications() {
  alert("No new notifications.");
}

function toggleDropdown() {
  const additionalFields = document.getElementById("additionalFields");
  additionalFields.classList.toggle("hidden");
}

function checkProfileCompletion() {
  const age = document.getElementById("age").value;
  const region = document.getElementById("region").value;
  const gender = document.getElementById("gender").value;

  // No need to toggle save button anymore (always visible)
  // Keeping function in case you want future logic
}

function saveProfile() {
  alert("Profile information saved!");
}

function removeProfile() {
  const img = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  img.src = "../Dashboard/profile-icon.png";
  removeBtn.style.display = "none";

  localStorage.removeItem("profileImage");
}

document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("uploadInput");
  const profileImage = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  // Load image from localStorage if exists
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImage.src = savedImage;
    removeBtn.style.display = "inline-block";
  }

  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
        localStorage.setItem("profileImage", e.target.result);
        removeBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });
});
