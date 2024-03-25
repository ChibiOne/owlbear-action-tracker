import OBR from "@owlbear-rodeo/sdk";

const ID = "com.example.action-tracker";

function updateCounter(color, value) {
  const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
  const currentValue = parseInt(counterElement.textContent, 10) || 0;
  const newValue = currentValue + value;
  counterElement.textContent = newValue.toString();
}


function initializeCounters() {
  const counterElements = document.querySelectorAll(".counter");
  counterElements.forEach((counterElement) => {
    const color = counterElement.getAttribute("data-color");
    const initialValue = color === "fear" || color === "countdown" ? 0 : 1;
    counterElement.textContent = initialValue.toString();
    saveCounter(color, initialValue);
  });
}

function saveCounter(color, value) {
  OBR.room.setMetadata({
    [`${ID}/${color}-counter`]: value,
  });
}

function loadCounters() {
  OBR.room.getMetadata().then((metadata) => {
    const counterElements = document.querySelectorAll(".counter");
    counterElements.forEach((counterElement) => {
      const color = counterElement.getAttribute("data-color");
      const savedValue = metadata[`${ID}/${color}-counter`] || 0;
      counterElement.textContent = savedValue.toString();
    });
  });
}

document.querySelectorAll(".plus").forEach((plusElement) => {
  plusElement.addEventListener("click", () => {
    const color = plusElement.getAttribute("data-color");
    updateCounter(color, 1);
    saveCounter(color, parseInt(document.querySelector(`.counter[data-color="${color}"]`).textContent, 10));
  });
});

document.querySelectorAll(".minus").forEach((minusElement) => {
  minusElement.addEventListener("click", () => {
    const color = minusElement.getAttribute("data-color");
    const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
    const currentValue = parseInt(counterElement.textContent, 10);

    if (currentValue > 0) {
      updateCounter(color, -1);
      saveCounter(color, currentValue - 1);
    }
  });
});

OBR.onReady(() => {
  initializeCounters();
  loadCounters();
});