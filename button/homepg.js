// JavaScript for Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("authModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.querySelector(".close");
    
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

   // Open Modal
   openModalBtn.addEventListener("click", () => {
       modal.style.display = "block";
       loginTab.classList.add("active");
       loginForm.classList.add("active");
       signupTab.classList.remove("active");
       signupForm.classList.remove("active");
   });

   // Close Modal
   closeModalBtn.addEventListener("click", () => {
       modal.style.display = "none";
   });

   // Switch to Login Form
   loginTab.addEventListener("click", () => {
       loginTab.classList.add("active");
       signupTab.classList.remove("active");
       loginForm.classList.add("active");
       signupForm.classList.remove("active");
   });

   // Switch to Signup Form
   signupTab.addEventListener("click", () => {
       signupTab.classList.add("active");
       loginTab.classList.remove("active");
       signupForm.classList.add("active");
       loginForm.classList.remove("active");
   });
});
