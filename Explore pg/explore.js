
document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  const priceFilter = document.querySelector('select'); // First select
  const regionInput = document.querySelector('input[type="text"]');
  const conditionFilter = document.querySelectorAll('select')[1]; // Second select
  
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

        bookList.appendChild(card);
      });
    } else {
      bookList.innerHTML = "<p>No books found.</p>";
    }
  }

  function filterBooks() {
    let filtered = [...allBooks];

    // Price Filter
    const priceValue = priceFilter.value;
    if (priceValue === "low") {
      filtered = filtered.filter(book => book.user_price < 200);
    } else if (priceValue === "mid") {
      filtered = filtered.filter(book => book.user_price >= 200 && book.user_price <= 500);
    } else if (priceValue === "high") {
      filtered = filtered.filter(book => book.user_price > 500);
    }

    // Region Filter
    const regionValue = regionInput.value.trim().toLowerCase();
    if (regionValue !== "") {
      filtered = filtered.filter(book => (book.region || "").toLowerCase().includes(regionValue));
    }

    // Condition Filter
    const conditionValue = conditionFilter.value;
    if (conditionValue === "new") {
      filtered = filtered.filter(book => book.condition === "New");
    } else if (conditionValue === "used") {
      filtered = filtered.filter(book => book.condition === "Used");
    }

    renderBooks(filtered);
  }

  // Event listeners
  priceFilter.addEventListener("change", filterBooks);
  regionInput.addEventListener("input", filterBooks);
  conditionFilter.addEventListener("change", filterBooks);
});
