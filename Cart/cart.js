document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("empty-msg");
  const summaryContainer = document.getElementById("summary-container");
  const authBtn = document.getElementById("auth-btn");

  let cart = []; // Start with an empty cart

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

      cartItemsContainer.innerHTML += `
        <tr>
          <td><img src="${item.image}" alt="${item.title}"></td>
          <td>${item.title}</td>
          <td>₹${item.price}</td>
          <td>
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <input type="text" class="quantity" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </td>
          <td>₹${itemTotal}</td>
          <td><button class="remove-btn" onclick="removeItem(${index})">X</button></td>
        </tr>
      `;
    });

    cartTotalElement.innerText = total.toFixed(2);
  }

  window.updateQuantity = function (index, change) {
    if (cart[index].quantity + change > 0) {
      cart[index].quantity += change;
    }
    renderCart();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  // Toggle login/logout button
  let isLoggedIn = false;
  authBtn.textContent = "Login";

  authBtn.addEventListener("click", () => {
    isLoggedIn = !isLoggedIn;
    authBtn.textContent = isLoggedIn ? "Logout" : "Login";
    authBtn.style.backgroundColor = "gold";
  });

  renderCart();
});
