document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    let cart = [
        { id: 1, title: "The Great Gatsby", price: 350, image: "book1.jpg", quantity: 1 },
        { id: 2, title: "1984", price: 250, image: "book2.jpg", quantity: 2 }
    ];

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

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