document.getElementById("close-button").addEventListener("click", () => {
  window.api.closeWidget();
});

document.getElementById("widget-logo").addEventListener("click", () => {
  window.api.openExternalLink();
});

const alwaysOnTopToggle = document.getElementById("always-on-top-toggle");

window.api.getAlwaysOnTop().then((isAlwaysOnTop) => {
  alwaysOnTopToggle.checked = isAlwaysOnTop;
});

alwaysOnTopToggle.addEventListener("change", (event) => {
  const isAlwaysOnTop = event.target.checked;
  window.api.setAlwaysOnTop(isAlwaysOnTop);
  showNotification(`Always on Top ${isAlwaysOnTop ? 'enabled' : 'disabled'}`);
});

// Function to show native OS notification
function showNotification(message) {
  if (Notification.permission === "granted") {
    const notification = new Notification("Electron Widget", {
      body: message,
      icon: "assets/icons/logo.png" // Adjust the path if necessary
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("Electron Widget", {
          body: message,
          icon: "assets/icons/logo.png"
        });
      }
    });
  }
}