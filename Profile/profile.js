document.addEventListener("DOMContentLoaded", async () => {
  const uploadInput = document.getElementById("uploadInput");
  const profileImage = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  // Load profile data from backend
  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/profile", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById("name").value = data.fullname || '';
      document.getElementById("email").value = data.email || '';
      document.getElementById("number").value = data.phone || '';
      document.getElementById("age").value = data.age || '';
      document.getElementById("region").value = data.region || '';
      document.getElementById("gender").value = data.gender || '';

      // If you want profile image from backend, you can extend here later
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  }

  // Handle Profile Picture Preview
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

// Save Profile to backend
async function saveProfile() {
  const fullname = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;
  const age = document.getElementById("age").value;
  const region = document.getElementById("region").value;
  const gender = document.getElementById("gender").value;

  const formData = new FormData();
  formData.append("fullname", fullname);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("age", age);
  formData.append("region", region);
  formData.append("gender", gender);

  const profilePic = document.getElementById("uploadInput").files[0];
  if (profilePic) {
    formData.append("profileImage", profilePic);
  }

  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/profile/update", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    if (res.ok) {
      alert("Profile information saved!");
      location.reload();
    } else {
      const errorData = await res.json();
      alert("Failed to save profile: " + (errorData.message || ""));
    }
  } catch (err) {
    console.error('Failed to save profile:', err);
    alert("Something went wrong while saving profile!");
  }
}

// Remove Profile Picture
function removeProfile() {
  const img = document.getElementById("profileImage");
  const removeBtn = document.getElementById("removeBtn");

  img.src = "../Dashboard/profile-icon.png";
  removeBtn.style.display = "none";

  localStorage.removeItem("profileImage");
}

// Optional utilities
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

// No need for checkProfileCompletion now, but you can add logic later if needed
