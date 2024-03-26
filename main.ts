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
  counterElement.textContent = newValue.toString();
  broadcastCounterUpdate(color, newValue);
}

function initializeCounters() {
  const counterElements = document.querySelectorAll(".counter");
  counterElements.forEach((counterElement) => {
    const color = counterElement.getAttribute("data-color");
    const initialValue = color === "fear" || color === "countdown" ? 0 : 1;
    counterElement.textContent = initialValue.toString();
    broadcastCounterUpdate(color, initialValue);
  });
}

function handleCounterUpdate(event: any) {
  const { color, value } = event.data;
  const counterElement = document.querySelector(`.counter[data-color="${color}"]`);
  counterElement.textContent = value.toString();
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
    const currentValue = parseInt(counterElement.textContent, 10);
    if (currentValue > 0) {
      updateCounter(color, -1);
    }
  });
});

OBR.onReady(() => {
  console.log("OBR is ready");
  initializeCounters();
  OBR.broadcast.onMessage("counter-update", handleCounterUpdate);
});