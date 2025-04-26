

document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  const priceFilter = document.getElementById("priceFilter");
  const sortFilter = document.getElementById("sortFilter");
  const searchInput = document.getElementById("searchInput");

  let allBooks = [];

  bookList.innerHTML = "Loading books...";

  try {
    const response = await fetch("https://pbl-backend-cqot.onrender.com/api/explore", {
      method: "GET",
      credentials: "include"
    });

    allBooks = await response.json();
    renderBooks(allBooks);
  } catch (err) {
    console.error("Failed to fetch books:", err);
    bookList.innerHTML = "<p>Something went wrong while loading books.</p>";
  }

  function renderBooks(books) {
    bookList.innerHTML = "";

    if (Array.isArray(books) && books.length > 0) {
      books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <img src="${book.image_url}" alt="Book Image">
          <h3>${book.name}</h3>
          <p>By ${book.author}</p>
          <p>₹${book.user_price}</p>
          <button class="add-cart-btn">Add to Cart</button>
        `;

        card.addEventListener("click", (event) => {
          if (!event.target.classList.contains("add-cart-btn")) {
            window.location.href = `https://rohitsable123.github.io/PBL-Project/Book/book.html?id=${book.id}`;
          }
        });

        const addToCartBtn = card.querySelector(".add-cart-btn");
        addToCartBtn.addEventListener("click", async (e) => {
          e.stopPropagation();

          const cartItem = {
            book_id: book.id,
            book_title: book.name,
            book_price: book.user_price,
            book_image: book.image_url,
          };

          try {
            const response = await fetch('https://pbl-backend-cqot.onrender.com/api/cart', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(cartItem),
            });

            if (response.ok) {
              addToCartBtn.disabled = true;
              addToCartBtn.innerText = "Added to cart ✓";
              addToCartBtn.style.backgroundColor = "#4CAF50";
              addToCartBtn.style.cursor = "default";
            } else {
              alert("Failed to add. Please login first.");
            }
          } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Something went wrong!");
          }
        });

        bookList.appendChild(card);
      });
    } else {
      bookList.innerHTML = "<p>No results found.</p>";
    }
  }

  function filterBooks() {
    let filtered = [...allBooks];

    const priceValue = priceFilter.value;
    if (priceValue === "low") {
      filtered = filtered.filter(book => book.user_price < 200);
    } else if (priceValue === "mid") {
      filtered = filtered.filter(book => book.user_price >= 200 && book.user_price <= 500);
    } else if (priceValue === "high") {
      filtered = filtered.filter(book => book.user_price > 500);
    }

    const sortValue = sortFilter.value;
    if (sortValue === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue !== "") {
      filtered = filtered.filter(book => book.name.toLowerCase().includes(searchValue));
    }

    renderBooks(filtered);
  }

  priceFilter.addEventListener("change", filterBooks);
  sortFilter.addEventListener("change", filterBooks);
  searchInput.addEventListener("input", filterBooks);
});
