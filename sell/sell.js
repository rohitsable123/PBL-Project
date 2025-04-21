const mcqs = [
  "Is the book cover intact?",
  "Are all pages present?",
  "Is there any water damage?",
  "Is the binding in good condition?",
  "Are there any torn pages?",
  "Is the text easily readable?",
  "Is there any handwriting inside?",
  "Is the book free from stains?",
  "Does the book smell okay?",
  "Is the spine undamaged?"
];

const mcqSection = document.getElementById("mcqSection");
const priceDisplay = document.getElementById("estimatedPrice");
const gradeLabel = document.getElementById("gradeLabel");
const priceRangeText = document.getElementById("priceRangeText");

mcqs.forEach((question, index) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <label>${index + 1}. ${question}</label>
    <select id="q${index + 1}" class="mcq">
      <option value="">--Select--</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  `;
  mcqSection.appendChild(wrapper);
});

document.querySelectorAll(".mcq, #originalPrice").forEach(el => {
  el.addEventListener("change", updateEstimate);
});

function updateEstimate() {
  const originalPrice = parseFloat(document.getElementById("originalPrice").value);
  if (isNaN(originalPrice) || originalPrice <= 0) {
    priceDisplay.textContent = "0";
    gradeLabel.textContent = "";
    return;
  }

  let noCount = 0;
  const answers = document.querySelectorAll(".mcq");
  for (let answer of answers) {
    if (answer.value === "no") noCount++;
    if (answer.value === "") {
      priceDisplay.textContent = "0";
      gradeLabel.textContent = "";
      priceRangeText.textContent = "";
      return;
    }
  }

  let minPercent = 0, maxPercent = 0, grade = "";

  if (noCount === 0) {
    grade = "A";
    minPercent = 0.05;
    maxPercent = 0.15;
  } else if (noCount <= 2) {
    grade = "B";
    minPercent = 0.15;
    maxPercent = 0.25;
  } else if (noCount <= 4) {
    grade = "C";
    minPercent = 0.25;
    maxPercent = 0.30;
  } else if (noCount <= 6) {
    grade = "D";
    minPercent = 0.30;
    maxPercent = 0.40;
  } else if (noCount === 7) {
    grade = "E";
    minPercent = 0.50;
    maxPercent = 0.70;
  } else {
    grade = "Not Sellable";
    priceDisplay.textContent = "0";
    gradeLabel.textContent = "Grade: Not Sellable | Too many issues.";
    priceRangeText.textContent = "";
    return;
  }

  const minPrice = originalPrice * (1 - maxPercent);
  const maxPrice = originalPrice * (1 - minPercent);

  priceDisplay.textContent = `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
  gradeLabel.textContent = `Grade: ${grade}`;
  priceRangeText.textContent = `Suggested Selling Price Range: ₹${minPrice.toFixed(2)} – ₹${maxPrice.toFixed(2)}`;
}

document.getElementById("sellingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Create FormData object (it can handle file + text)
  const formData = new FormData();
  formData.append("bookName", document.getElementById("bookName").value);
  formData.append("bookAuthor", document.getElementById("bookAuthor").value);
  formData.append("originalPrice", document.getElementById("originalPrice").value);
  formData.append("userPrice", document.getElementById("userPrice").value);
  formData.append("bookImage", document.getElementById("bookImage").files[0]);

  // Get grade from UI (e.g., A, B, C)
  const gradeText = document.getElementById("gradeLabel").textContent;
  const grade = gradeText.includes("Grade:") ? gradeText.split("Grade:")[1].trim().split(" ")[0] : "Unknown";
  formData.append("grade", grade);

  // Send to backend using fetch
  fetch("https://pbl-backend-cqot.onrender.com/api/sell", {
    method: "POST",
    credentials: "include", // important if you use sessions
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Book listed successfully!");
        document.getElementById("sellingForm").reset();
        priceDisplay.textContent = "0";
        gradeLabel.textContent = "";
        priceRangeText.textContent = "";
      } else {
        alert("Failed to list book.");
      }
    })
    .catch(err => {
      console.error("Error uploading book:", err);
      alert("Error listing the book.");
    });
});
