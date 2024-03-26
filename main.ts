import OBR from "@owlbear-rodeo/sdk";

const ID = "com.example.action-tracker";

function broadcastCounterUpdate(color: string, value: number) {
  if (OBR && OBR.broadcast) {
    console.log("Broadcasting counter update:", color, value);
    OBR.broadcast.sendMessage("counter-update", { color, value });
  } else {
    console.error("OBR.broadcast is not available");
  }
}

function updateCounter(color: string, value: number) {
  const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
  const currentValue = parseInt(counterElement.textContent, 10) || 0;
  const newValue = currentValue + value;
  counterElement.textContent = newValue > 0 ? newValue.toString() : "";
  broadcastCounterUpdate(color, newValue);
  saveCounterValue(color, newValue);
}

function saveCounterValue(color: string, value: number) {
  OBR.room.setMetadata({ [`${ID}/${color}-counter`]: value });
}

function loadCounterValues() {
  OBR.room.getMetadata().then((metadata) => {
    const counterElements = document.querySelectorAll(".counter");
    counterElements.forEach((counterElement) => {
      const color = counterElement.getAttribute("data-color");
      const savedValue = metadata[`${ID}/${color}-counter`] || 0;
      counterElement.textContent = savedValue > 0 ? savedValue.toString() : "";
    });
  });
}

function handleCounterUpdate(event: any) {
  const { color, value } = event.data;
  const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
  counterElement.textContent = value > 0 ? value.toString() : "";
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
    const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
    const currentValue = parseInt(counterElement.textContent, 10) || 0;
    if (currentValue > 0) {
      updateCounter(color, -1);
    }
  });
});

OBR.onReady(() => {
  loadCounterValues();
  OBR.broadcast.onMessage("counter-update", handleCounterUpdate);
});