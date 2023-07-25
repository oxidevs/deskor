const { ipcRenderer, contextBridge } = require("electron");

const pluginPreloads = (widgetName, customPreload) => {
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

  const calcWidgetHeight = () => {
    let widgetHeight = 0;
    const children = document.body.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      widgetHeight += child.offsetHeight;
    }

    ipcRenderer.send("plugin-resized", {
      name: widgetName,
      height: widgetHeight,
    });
  };

  const resize_ob = new ResizeObserver(function (entries) {
    // since we are observing only a single element, so we access the first element in entries array
    calcWidgetHeight();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const children = document.body.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      // start observing for resize
      resize_ob.observe(child);
    }

    calcWidgetHeight();

    const widget = document.body;
    widget.addEventListener("mouseenter", () => {
      console.log("mouseenter");
      ipcRenderer.send("set-ignore-mouse-evnets", false);
    });
    widget.addEventListener("mouseleave", () => {
      console.log("mouseleave");
      ipcRenderer.send("set-ignore-mouse-evnets", true, { forward: true });
    });
  });

  customPreload();
};

module.exports = {
  pluginPreloads: pluginPreloads,
};
