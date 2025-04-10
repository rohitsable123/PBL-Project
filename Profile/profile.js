function toggleDropdown() {
    let fields = document.getElementById('additionalFields');
    fields.classList.toggle('hidden');
}

function addProfile() {
    alert("Add Profile Picture functionality can be implemented.");
}

function removeProfile() {
    alert("Remove Profile Picture functionality can be implemented.");
}

function goBack() {
    window.history.back();
}

function showNotifications() {
    alert("Notification functionality can be implemented.");
}

function checkProfileCompletion() {
    let age = document.getElementById('age').value.trim();
    let region = document.getElementById('region').value.trim();
    let gender = document.getElementById('gender').value;
    let saveBtn = document.getElementById('saveChangesBtn');

    if (age || region || gender) {
        saveBtn.classList.remove('hidden');
    } else {
        saveBtn.classList.add('hidden');
    }
}

function saveProfile() {
    // Get field values
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let number = document.getElementById("number").value.trim();
    let age = document.getElementById("age").value.trim();
    let region = document.getElementById("region").value.trim();
    let gender = document.getElementById("gender").value;

    // Basic validation
    if (!name || !email || !number || !age || !region || !gender) {
        alert("⚠️ Please fill out all fields before saving.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("⚠️ Please enter a valid email address.");
        return;
    }

    // Phone number validation (10 digits only)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(number)) {
        alert("⚠️ Please enter a valid 10-digit phone number.");
        return;
    }

    // All good
    alert("✅ Profile saved successfully!");
}
