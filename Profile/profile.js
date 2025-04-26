function goBack() {
  window.history.back();
}

function toggleDropdown() {
  const additionalFields = document.getElementById("additionalFields");
  additionalFields.classList.toggle("hidden");
}

function removeProfile() {
  const profileImage = document.getElementById("profileImage");
  profileImage.src = "../Dashboard/profile-icon.png";
  localStorage.removeItem("profileImage");
}

async function fetchProfile() {
  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/profile", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch profile");

    const data = await res.json();

    document.getElementById("name").value = data.fullname || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("number").value = data.phone || "";
    document.getElementById("age").value = data.age || "";
    document.getElementById("region").value = data.region || "";
    document.getElementById("gender").value = data.gender || "";

    if (data.profileImage) {
      document.getElementById("profileImage").src = data.profileImage;
      localStorage.setItem("profileImage", data.profileImage);
    }
  } catch (err) {
    console.error(err);
  }
}

async function saveProfile() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;
  const age = document.getElementById("age").value;
  const region = document.getElementById("region").value;
  const gender = document.getElementById("gender").value;
  const uploadInput = document.getElementById("uploadInput");

  const formData = new FormData();
  formData.append("fullname", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("age", age);
  formData.append("region", region);
  formData.append("gender", gender);

  if (uploadInput.files[0]) {
    formData.append("profileImage", uploadInput.files[0]);
  }

  try {
    const res = await fetch("https://pbl-backend-cqot.onrender.com/profile/update", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile updated successfully!");
      fetchProfile(); // Reload profile info
    } else {
      alert(data.message || "Update failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("uploadInput");
  const profileImage = document.getElementById("profileImage");

  // Load image from localStorage if exists
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImage.src = savedImage;
  }

  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  fetchProfile(); // Fetch user info when page loads
});
