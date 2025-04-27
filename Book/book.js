document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const container = document.getElementById("book-details");

  try {
    const res = await fetch(`https://pbl-backend-cqot.onrender.com/api/explore/${bookId}`, {
      credentials: 'include' // important to maintain session/cookies
    });
    const book = await res.json();

    let conditionsDropdownHTML = "";

    if (book.conditions && book.conditions.trim() !== "") {
      const conditionsArray = book.conditions.split(';'); // Split by semicolon

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

    // Add WhatsApp button login check
    const whatsappButton = document.querySelector(".whatsapp-button");

    if (whatsappButton) {
      whatsappButton.addEventListener("click", async (e) => {
        e.preventDefault(); // Stop normal link behavior

        try {
          const sessionRes = await fetch('https://pbl-backend-cqot.onrender.com/auth/user'', {
            credentials: 'include'
          });
          const sessionData = await sessionRes.json();

          console.log("Session data:", sessionData); // DEBUGGING line

          if (sessionData.loggedIn) {
            // User is logged in, open WhatsApp link
            window.open(`https://wa.me/${book.owner_phone}`, "_blank");
          } else {
            alert("Please login first to contact the seller.");
            window.location.href = "../login/login.html"; // Adjust path if needed
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
