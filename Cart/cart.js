document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("loginToggle");

  // Fetch cart from backend
  async function loadCart() {
    try {
      const res = await fetch("/cart", {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Not logged in");

      const cart = await res.json();
      renderCart(cart);
    } catch (err) {
      console.log("User not logged in or error loading cart");
      summaryContainer.style.display = "none";
      emptyMsg.innerHTML = `Please <a href="../login/login.html">log in</a> to view your cart.`;
      emptyMsg.style.display = "block";
    }
  }

  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    await fetch(`/cart/update/${itemId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity })
    });

    loadCart();
  }

  async function removeItem(itemId) {
    await fetch(`/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include"
    });

    loadCart();
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
      const itemTotal = item.book_price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.book_image}" alt="${item.book_title}"></td>
        <td>${item.book_title}</td>
        <td>₹${item.book_price}</td>
        <td>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="text" class="quantity" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </td>
        <td>₹${itemTotal.toFixed(2)}</td>
        <td><button class="remove-btn" onclick="removeItem(${item.id})">X</button></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = total.toFixed(2);
  }

  // Authentication UI
  function updateAuthButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      authBtn.textContent = "Logout";
      authBtn.onclick = () => {
        fetch("/logout", { method: "POST", credentials: "include" }).then(() => {
          localStorage.setItem("isLoggedIn", "false");
          window.location.href = "../login/login.html";
        });
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
    if (savedImg) profileImg.src = savedImg;
  }

  window.updateQuantity = updateQuantity;
  window.removeItem = removeItem;

  updateAuthButton();
  loadProfilePhoto();
  loadCart();
});
