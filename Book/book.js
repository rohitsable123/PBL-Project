document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const container = document.getElementById("book-details");

  try {
    const res = await fetch(`https://pbl-backend-cqot.onrender.com/api/explore/${bookId}`);
    const book = await res.json();

    const conditionsDropdown = book.conditions
      ? `<label for="conditions"><strong>Seller Conditions:</strong></label>
         <select id="conditions">
           ${book.conditions.split(',').map(c => `<option>${c.trim()}</option>`).join('')}
         </select>`
      : "<p><strong>Seller Conditions:</strong> Not provided</p>";

    container.innerHTML = `
      <img src="${book.image_url}" alt="Book Image" class="book-image">
      <h2>${book.name}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Original Price:</strong> ₹${book.original_price}</p>
      <p><strong>Your Price:</strong> ₹${book.user_price}</p>
      <p><strong>Grade:</strong> ${book.grade || "Not provided"}</p>
      <p><strong>Seller:</strong> ${book.owner_name}</p>
      ${conditionsDropdown}
      <br><br>
      <a href="https://wa.me/${book.owner_phone}" target="_blank">
        <button class="whatsapp-button">Contact via WhatsApp</button>
      </a>
    `;
  } catch (err) {
    console.error("Book fetch failed:", err);
    container.innerHTML = "<p>Error loading book details.</p>";
  }
});
