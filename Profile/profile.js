function toggleDropdown() {
  const fields = document.getElementById("additionalFields");
  fields.classList.toggle("hidden");
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

function goBack() {
  window.history.back();
}

function showNotifications() {
  alert("You have no new notifications.");
}

function removeProfile() {
  const img = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");
  img.src = "profile-icon.png";
  removeBtn.style.display = "none";
  document.getElementById("uploadInput").value = "";
}

document.getElementById("uploadInput").addEventListener("change", function () {
  const file = this.files[0];
  const img = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      removeBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }
});
