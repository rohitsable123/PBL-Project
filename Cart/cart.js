document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("auth-btn");

  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

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
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.title}"></td>
        <td>${item.title}</td>
        <td>₹${item.price}</td>
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
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }

  window.updateQuantity = function (index, change) {
    if (cart[index].quantity + change > 0) {
      cart[index].quantity += change;
      renderCart();
    }
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
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
  renderCart();
});
