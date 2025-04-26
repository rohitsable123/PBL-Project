
document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  const priceFilter = document.querySelector('select'); // First select
  const regionFilter = document.querySelector('select[name="region"]'); // Region select
  const conditionFilter = document.querySelector('select[name="condition"]'); // Condition select
  const searchBar = document.getElementById("searchBar");
  const removeFiltersBtn = document.getElementById("removeFiltersBtn");

  let allBooks = [];

  bookList.innerHTML = "Loading books...";

  // Fetch books from backend
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

  // Function to render books
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

  // Function to filter books based on selected filters
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

    // Region Filter (Pune or Out of Pune)
    const regionValue = regionFilter.value;
    if (regionValue !== "Select") {
      filtered = filtered.filter(book => book.region.toLowerCase() === regionValue.toLowerCase());
    }

    // Condition Filter (New or Used)
    const conditionValue = conditionFilter.value;
    if (conditionValue === "new") {
      filtered = filtered.filter(book => book.condition === "New");
    } else if (conditionValue === "used") {
      filtered = filtered.filter(book => book.condition === "Used");
    }

    // Search Bar Filter (Live Search by Book Name or Author)
    const searchValue = searchBar.value.trim().toLowerCase();
    if (searchValue) {
      filtered = filtered.filter(book => 
        book.name.toLowerCase().includes(searchValue) || 
        book.author.toLowerCase().includes(searchValue)
      );
    }

    renderBooks(filtered);
  }

  // Event listeners for filters and search bar
  priceFilter.addEventListener("change", filterBooks);
  regionFilter.addEventListener("change", filterBooks);
  conditionFilter.addEventListener("change", filterBooks);
  searchBar.addEventListener("input", filterBooks);

  // Remove Filters button - reset all filters
  removeFiltersBtn.addEventListener("click", () => {
    priceFilter.value = "Select";
    regionFilter.value = "Select";
    conditionFilter.value = "Select";
    searchBar.value = "";
    renderBooks(allBooks);
  });
});
