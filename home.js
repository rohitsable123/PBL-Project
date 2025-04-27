window.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("navProfileImage"); 
  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    profilePic.src = savedImage;
  } else {
    profilePic.src = "../profile-icon.png"; 
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Function to fetch and filter books
  async function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      return;
    }

    try {
      const res = await fetch("https://pbl-backend-cqot.onrender.com/api/explore"); 
      const books = await res.json();

      const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );

      searchResults.innerHTML = "";

      if (filteredBooks.length === 0) {
        searchResults.innerHTML = "<p>No books found matching your search.</p>";
        return;
      }

      filteredBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.innerHTML = `
          <img src="${book.image_url}" alt="Book Image" class="book-image">
          <h3>${book.name}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Price:</strong> ₹${book.user_price}</p>
          <a href="Book/book.html?id=${book.id}" class="view-details-btn">View Details</a>
        `;
        searchResults.appendChild(bookCard);
      });
    } catch (err) {
      console.error("Search failed:", err);
      searchResults.innerHTML = "<p>Error fetching books.</p>";
    }
  }

  // When user types in the input box
  searchInput.addEventListener("input", () => {
    performSearch();
  });

  // When user clicks search button
  searchBtn.addEventListener("click", () => {
    performSearch();
  });

  // When user presses "Enter" inside input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });
});
