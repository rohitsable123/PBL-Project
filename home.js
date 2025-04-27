window.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("navProfileImage"); // corrected id
  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    profilePic.src = savedImage;
  } else {
    profilePic.src = "../profile-icon.png"; // Corrected relative path
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return; // do nothing if search empty

    try {
      const res = await fetch("https://pbl-backend-cqot.onrender.com/api/explore"); // fetch all books
      const books = await res.json();

      const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );

      // Clear previous results
      searchResults.innerHTML = "";

      if (filteredBooks.length === 0) {
        searchResults.innerHTML = "<p>No books found matching your search.</p>";
        return;
      }

      // Show the matching books
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
  });
});
