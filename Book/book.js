document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const container = document.getElementById("book-details");

  try {
    const res = await fetch(`https://pbl-backend-cqot.onrender.com/api/explore/${bookId}`, {
      credentials: 'include'
    });
    const book = await res.json();

    let conditionsDropdownHTML = "";

    if (book.conditions && book.conditions.trim() !== "") {
      const conditionsArray = book.conditions.split(';');
      conditionsDropdownHTML = `
        <label for="conditions"><strong>Book Conditions:</strong></label>
        <select id="conditions">
          ${conditionsArray.map(condition => `<option>${condition.trim()}</option>`).join('')}
        </select>
      `;
    } else {
      conditionsDropdownHTML = "<p><strong>Book Conditions:</strong> Not provided</p>";
    }

    container.innerHTML = `
      <img src="${book.image_url}" alt="Book Image" class="book-image">
      <h2>${book.name}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Original Price:</strong> ₹${book.original_price}</p>
      <p><strong>Your Price:</strong> ₹${book.user_price}</p>
      <p><strong>Grade:</strong> ${book.grade || "Not provided"}</p>
      <p><strong>Seller:</strong> ${book.owner_name}</p>
      ${conditionsDropdownHTML}
      <br><br>
      <a href="#" id="whatsapp-link">
        <button class="whatsapp-button">Contact via WhatsApp</button>
      </a>
    `;

    const whatsappButton = document.querySelector(".whatsapp-button");

    if (whatsappButton) {
      whatsappButton.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
          const sessionRes = await fetch('https://pbl-backend-cqot.onrender.com/auth/user', {
            credentials: 'include'
          });
          const sessionData = await sessionRes.json();

          console.log("Session data:", sessionData); // DEBUGGING

          if (sessionData.user) { 
            const message = `Hi, I'm interested in your book "${book.name}"`;
            window.open(`https://wa.me/${book.owner_phone}?text=${encodeURIComponent(message)}`, "_blank");
          } else {
            alert("Please login first to contact the seller.");
            window.location.href = "../login/login.html";
          }
        } catch (err) {
          console.error("Session check failed:", err);
          alert("Unable to verify login. Please refresh and try again.");
        }
      });
    }

  } catch (err) {
    console.error("Book fetch failed:", err);
    container.innerHTML = "<p>Error loading book details.</p>";
  }
});

// Back button function
function goBack() {
  window.history.back();
}


