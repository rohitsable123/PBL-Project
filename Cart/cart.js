document.addEventListener("DOMContentLoaded", async function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("loginToggle");

  async function fetchCartItems() {
    try {
      const response = await fetch('https://pbl-backend-cqot.onrender.com/api/cart', {
        method: 'GET',
        credentials: 'include',
      });
      const cart = await response.json();
      renderCart(cart);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  function renderCart(cart) {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      summaryContainer.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }

    summaryContainer.style.display = "block";
    emptyMsg.style.display = "none";

    cart.forEach((item) => {
      const itemTotal = parseFloat(item.book_price);
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.book_image}" alt="${item.book_title}" style="height:50px;"></td>
        <td>${item.book_title}</td>
        <td>₹${item.book_price}</td>
        <td>1</td>
        <td>₹${item.book_price}</td>
        <td><button class="remove-btn" onclick="removeItem(${item.id})">X</button></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = total.toFixed(2);
  }

  window.removeItem = async function (itemId) {
    try {
      const response = await fetch(`https://pbl-backend-cqot.onrender.com/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        fetchCartItems(); // Reload cart after delete
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

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

  updateAuthButton();
  fetchCartItems();
});
