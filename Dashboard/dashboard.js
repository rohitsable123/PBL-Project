document.addEventListener("DOMContentLoaded", function () {
    let accordionButtons = document.querySelectorAll(".accordion-btn");
    let accordionContents = document.querySelectorAll(".accordion-content");
    let sidebarLinks = document.querySelectorAll(".sidebar a");
    let profileSection = document.querySelector(".profile-box"); // Profile section

    sidebarLinks.forEach((link, index) => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            if (index === 0) {
                // If "Profile" is clicked, scroll to the profile section
                profileSection.scrollIntoView({ behavior: "smooth" });
            } else {
                // Otherwise, open the corresponding accordion section
                let accordionIndex = index - 1; // Adjust index (since Profile is not part of accordions)

                if (accordionButtons[accordionIndex]) {
                    // Close all accordion sections first
                    accordionContents.forEach((content, i) => {
                        if (i !== accordionIndex) {
                            content.style.display = "none";
                            accordionButtons[i].classList.remove("active");
                        }
                    });

                    // Open the selected accordion section
                    accordionButtons[accordionIndex].classList.add("active");
                    accordionButtons[accordionIndex].nextElementSibling.style.display = "block";
                    accordionButtons[accordionIndex].scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // Accordion toggle functionality
    accordionButtons.forEach((button) => {
        button.addEventListener("click", function () {
            this.classList.toggle("active");
            let content = this.nextElementSibling;

            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                // Close all other sections
                accordionContents.forEach((c) => (c.style.display = "none"));
                content.style.display = "block";
            }
        });
    });
});
