document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyMessage = document.getElementById("empty-message");
  const summary = document.getElementById("summary");
  const cartTable = document.getElementById("cart-table");

  // Load cart from localStorage or start empty
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      emptyMessage.style.display = "block";
      summary.style.display = "none";
      cartTable.style.display = "none";
      return;
    } else {
      emptyMessage.style.display = "none";
      summary.style.display = "block";
      cartTable.style.display = "table";
    }

    cart.forEach((item, index) => {
      let itemTotal = item.price * item.quantity;
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
    localStorage.setItem("cart", JSON.stringify(cart));
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

  renderCart();
});
