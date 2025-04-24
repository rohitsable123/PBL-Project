document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  bookList.innerHTML = "Loading books...";

  try {
    const response = await fetch("https://pbl-backend-cqot.onrender.com/api/explore", {
      method: "GET",
      credentials: "include"
    });

    const books = await response.json();
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
            window.location.href = `../Book/book.html?id=${book.id}`;
          }
        });

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
