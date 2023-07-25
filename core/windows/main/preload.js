const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

contextBridge.exposeInMainWorld("electronAPI", {
  loadPlugins: (f) => {
    ipcRenderer.on("pluginLoaded", f);
    ipcRenderer.send("prepared");
  },
  getContainerRect: (f) => {
    ipcRenderer.on("get-container-rect", f);
  },
  setContainerRect: (data) => {
    ipcRenderer.send("set-container-rect", data);
  },
  mountPlugin: (name, f) => {
    ipcRenderer.on("mounted", f);
    ipcRenderer.send("mount-plugin", name);
  },
});

document.addEventListener("DOMContentLoaded", () => {
  // const widgets = document.getElementsByClassName("widget");
  // for (w of widgets) {
  //   w.addEventListener("mouseenter", () => {
  //     console.log("mouseenter");
  //     ipcRenderer.send("set-ignore-mouse-evnets", false);
  //   });
  //   w.addEventListener("mouseleave", () => {
  //     console.log("mouseleave");
  //     ipcRenderer.send("set-ignore-mouse-evnets", true, { forward: true });
  //   });
  // }
  // ipcRenderer.send("screenCapture");
});

// ipcRenderer.on("source", (event, image) => {
//   const app = document.getElementById("app");
//   app.style.backgroundImage = `url(${image})`;
// });
