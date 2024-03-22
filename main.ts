import OBR from "@owlbear-rodeo/sdk";

const ID = "com.example.action-tracker";

let actionTokens = [];

function render() {
  const actionList = document.getElementById("action-list");
  actionList.innerHTML = "";

  for (const token of actionTokens) {
    const tokenElement = document.createElement("div");
    tokenElement.classList.add("action-token");
    tokenElement.style.backgroundColor = token.color;
    tokenElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      removeActionToken(token.id);
    });
    actionList.appendChild(tokenElement);
  }

  document.getElementById("total-actions").textContent = actionTokens.length;
}

function addActionToken(color) {
  const tokenId = crypto.randomUUID();
  actionTokens.push({ id: tokenId, color });
  saveActionTokens();
  render();
}

function removeActionToken(tokenId) {
  actionTokens = actionTokens.filter((token) => token.id !== tokenId);
  saveActionTokens();
  render();
}

function saveActionTokens() {
  OBR.room.setMetadata({
    [`${ID}/action-tokens`]: actionTokens,
  });
}

function loadActionTokens() {
  OBR.room.getMetadata().then((metadata) => {
    actionTokens = metadata[`${ID}/action-tokens`] || [];
    render();
  });
}

OBR.onReady(() => {
  loadActionTokens();

  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Add Action Token",
      },
    ],
    onClick(_, elementId) {
      OBR.player.getColor().then((color) => {
        addActionToken(color);
      });
    },
  });
});