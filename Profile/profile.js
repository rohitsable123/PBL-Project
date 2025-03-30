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
    let age = document.getElementById('age').value;
    let region = document.getElementById('region').value;
    let gender = document.getElementById('gender').value;
    let saveBtn = document.getElementById('saveChangesBtn');

    if (age && region && gender) {
        saveBtn.classList.remove('hidden');
    } else {
        saveBtn.classList.add('hidden');
    }
}

function saveProfile() {
    alert("Profile saved successfully!");
}