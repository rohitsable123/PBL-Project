document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  bookList.innerHTML = "Loading books...";

  try {
    const response = await fetch("https://pbl-backend-cqot.onrender.com/api/explore", {
      method: "GET",
      credentials: "include"
    });

    const books = await response.json();
    bookList.innerHTML = ""; // clear loading text

    if (Array.isArray(books) && books.length > 0) {
      books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <img src="https://pbl-backend-cqot.onrender.com/uploads/${book.image}" alt="Book Image">
          <h3>${book.title}</h3>
          <p>By ${book.author}</p>
          <p>₹${book.price}</p>
          <button class="add-cart-btn">Add to Cart</button>
        `;
        bookList.appendChild(card);
      });
    } else {
      bookList.innerHTML = "<p>No books found.</p>";
    }
  } catch (err) {
    console.error("Failed to fetch books:", err);
    bookList.innerHTML = "<p>Something went wrong while loading books.</p>";
  }
});
