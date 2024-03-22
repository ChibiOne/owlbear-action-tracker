import OBR from "@owlbear-rodeo/sdk";

const ID = "com.example.action-tracker";

function updateCounter(color, value) {
  const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
  const currentValue = parseInt(counterElement.textContent, 10);
  const newValue = currentValue + value;
  counterElement.textContent = newValue.toString();
}

document.querySelectorAll(".plus").forEach((plusElement) => {
  plusElement.addEventListener("click", () => {
    const color = plusElement.getAttribute("data-color");
    updateCounter(color, 1);
  });
});

document.querySelectorAll(".minus").forEach((minusElement) => {
  minusElement.addEventListener("click", () => {
    const color = minusElement.getAttribute("data-color");
    updateCounter(color, -1);
  });
});