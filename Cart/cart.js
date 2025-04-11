document.addEventListener("DOMContentLoaded", () => {
    const profileImage = document.getElementById("profileImage");
    const loginBtn = document.getElementById("loginBtn");
    const cartItemsContainer = document.getElementById("cart-items");

    // Load profile image
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage && profileImage) {
        profileImage.src = storedImage;
    }

    // Login button toggle
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    loginBtn.textContent = isLoggedIn ? "Logout" : "Login";

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            localStorage.removeItem("isLoggedIn");
            loginBtn.textContent = "Login";
            window.location.href = "../index.html";
        } else {
            window.location.href = "../login/login.html";
        }
    });

    // Retrieve cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Render cart
    function renderCart() {
        cartItemsContainer.innerHTML = "";

        if (cartItems.length === 0) {
            return;
        }

        cartItems.forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.title}" style="width: 50px;"></td>
                <td>${item.title}</td>
                <td>₹${item.price}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" />
                </td>
                <td>₹${item.price * item.quantity}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;

            cartItemsContainer.appendChild(row);
        });

        addEventListeners();
    }

    // Add event listeners to quantity inputs and remove buttons
    function addEventListeners() {
        document.querySelectorAll(".qty-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                const newQty = parseInt(e.target.value);
                if (newQty > 0) {
                    cartItems[index].quantity = newQty;
                    saveCart();
                    renderCart();
                }
            });
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                cartItems.splice(index, 1);
                saveCart();
                renderCart();
            });
        });
    }

    // Save to localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    renderCart();
});
