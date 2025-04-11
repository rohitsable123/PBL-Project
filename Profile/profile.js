function goBack() {
  window.history.back();
}

function showNotifications() {
  alert("No new notifications.");
}

function toggleDropdown() {
  const dropdown = document.getElementById("additionalFields");
  dropdown.classList.toggle("hidden");
}

function checkProfileCompletion() {
  const age = document.getElementById("age").value.trim();
  const region = document.getElementById("region").value.trim();
  const gender = document.getElementById("gender").value;

  const saveBtn = document.getElementById("saveChangesBtn");
  if (age && region && gender) {
    saveBtn.classList.remove("hidden");
  } else {
    saveBtn.classList.add("hidden");
  }
}

function saveProfile() {
  alert("Profile saved successfully!");
}

function removeProfile() {
  localStorage.removeItem("profileImage");
  document.getElementById("profileImage").src = "../Dashboard/profile-icon.png";
  document.getElementById("removeBtn").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("uploadInput");
  const profileImage = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImage.src = savedImage;
    removeBtn.style.display = "inline-block";
  }

  uploadInput.addEventListener("change", function () {
    const file = uploadInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;
        profileImage.src = dataURL;
        localStorage.setItem("profileImage", dataURL);
        removeBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });
});
