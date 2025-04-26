document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("auth-btn");

  let cart = [];

  async function fetchCartFromServer() {
    try {
      const response = await fetch('https://pbl-backend-cqot.onrender.com/api/cart', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        cart = await response.json();
        renderCart();
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async function saveCartItemToServer(item) {
    try {
      await fetch('https://pbl-backend-cqot.onrender.com/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error('Error saving cart item:', error);
    }
  }

  async function removeCartItemFromServer(cartItemId) {
    try {
      await fetch(`https://pbl-backend-cqot.onrender.com/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
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
      const itemTotal = item.book_price * 1; // quantity = 1 fixed for now
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.book_image}" alt="${item.book_title}"></td>
        <td>${item.book_title}</td>
        <td>₹${item.book_price}</td>
        <td>1</td>
        <td>₹${itemTotal.toFixed(2)}</td>
        <td><button class="remove-btn" onclick="removeItem(${item.id})">X</button></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = total.toFixed(2);
  }

  window.removeItem = async function (id) {
    await removeCartItemFromServer(id);
    cart = cart.filter((item) => item.id !== id);
    renderCart();
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
  fetchCartFromServer();
});
