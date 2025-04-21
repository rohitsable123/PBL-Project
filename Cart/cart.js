document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "https://pbl-backend-cqot.onrender.com";

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("auth-btn");

  let cart = [];

  // Fetch cart items from backend
  function fetchCart() {
    fetch(`${BASE_URL}/cart`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cart = data;
        renderCart();
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
      });
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      summaryContainer.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }

    summaryContainer.style.display = "block";
    emptyMsg.style.display = "none";

    cart.forEach((item, index) => {
      const itemTotal = item.book_price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.book_image}" alt="${item.book_title}"></td>
        <td>${item.book_title}</td>
        <td>₹${item.book_price}</td>
        <td>
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <input type="text" class="quantity" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </td>
        <td>₹${itemTotal.toFixed(2)}</td>
        <td><button class="remove-btn" onclick="removeItem(${index})">X</button></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = total.toFixed(2);
  }

  window.updateQuantity = function (index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) return;

    fetch(`${BASE_URL}/cart/update/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cart[index].quantity = newQuantity;
          renderCart();
        } else {
          alert("Failed to update quantity");
        }
      });
  };

  window.removeItem = function (index) {
    const item = cart[index];

    fetch(`${BASE_URL}/cart/${item.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cart.splice(index, 1);
          renderCart();
        } else {
          alert("Failed to remove item");
        }
      });
  };

  function updateAuthButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      authBtn.textContent = "Logout";
      authBtn.onclick = () => {
        localStorage.setItem("isLoggedIn", "false");
        location.reload();
      };
    } else {
      authBtn.textContent = "Login";
      authBtn.onclick = () => {
        window.location.href = "../login/login.html";
      };
    }
  }

  function loadProfilePhoto() {
    const profileImg = document.getElementById("nav-profile-img");
    const savedImg = localStorage.getItem("profileImage");
    if (savedImg) {
      profileImg.src = savedImg;
    }
  }

  updateAuthButton();
  loadProfilePhoto();
  fetchCart();
});
