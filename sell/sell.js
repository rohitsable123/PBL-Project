const mcqs = [
  "Is the book cover in good condition?",
  "Are all pages intact and present?",
  "Is the book free from water damage?",
  "Is the binding firm and undamaged?",
  "Are all pages free from tears or damage?",
  "Is the text clear and easily readable?",
  "Is the book free of handwriting or markings?",
  "Is the book clean and without stains?",
  "Does the book have a neutral or pleasant smell?",
  "Is the outer appearance clean and presentable?"
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
    priceRangeText.textContent = "";
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

document.getElementById("sellingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userPrice = parseFloat(document.getElementById("userPrice").value);
  const originalPrice = parseFloat(document.getElementById("originalPrice").value);

  let noCount = 0;
  document.querySelectorAll(".mcq").forEach(q => {
    if (q.value === "no") noCount++;
  });

  let minPercent = 0;
  if (noCount === 0) minPercent = 0.05;
  else if (noCount <= 2) minPercent = 0.15;
  else if (noCount <= 4) minPercent = 0.25;
  else if (noCount <= 6) minPercent = 0.30;
  else if (noCount === 7) minPercent = 0.50;

  const maxAllowedPrice = originalPrice * (1 - minPercent);
  if (userPrice > maxAllowedPrice) {
    alert(`Selling price cannot exceed ₹${maxAllowedPrice.toFixed(2)}.`);
    return;
  }

  // 🔥 Create the formData correctly
  const sellingForm = document.getElementById("sellingForm");
  const formData = new FormData(sellingForm);

  try {
    const response = await fetch("https://pbl-backend-cqot.onrender.com/api/sell", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Book listed successfully!");
      window.location.href = "../Explore/explore.html"; // (optional) Redirect to Explore page
    } else {
      alert("❌ Failed to list book: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Something went wrong!");
  }
});
