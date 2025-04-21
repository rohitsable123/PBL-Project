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

function calculatePrice() {
  const originalPrice = parseFloat(document.getElementById("originalPrice").value);
  if (isNaN(originalPrice) || originalPrice <= 0) {
    alert("Please enter a valid original price.");
    return;
  }

  let noCount = 0;
  const answers = document.querySelectorAll(".mcq");
  for (let answer of answers) {
    if (answer.value === "no") noCount++;
    if (answer.value === "") {
      alert("Please answer all MCQs.");
      return;
    }
  }

  const priceDisplay = document.getElementById("estimatedPrice");
  const gradeLabel = document.getElementById("gradeLabel");
  let minPercent = 0, maxPercent = 0, grade = "";

  // ✅ Correct grading logic
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
    priceDisplay.textContent = "0";
    gradeLabel.textContent = "Grade: Not Sellable | Too many issues.";
    return;
  }

  const minPrice = originalPrice * (1 - maxPercent);
  const maxPrice = originalPrice * (1 - minPercent);

  priceDisplay.textContent = `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
  gradeLabel.textContent = `Grade: ${grade} | Estimated Range: ₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)} (Max Limit)`;
}
