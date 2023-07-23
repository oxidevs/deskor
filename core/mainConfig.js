const path = require("path");

module.exports = {
  width: 800,
  height: 600,
  // resizable: false,
  // transparent: true,
  // backgroundColor: "white",
  // frame: false,
  // backgroundColor: "transparent",

  webPreferences: {
    preload: path.resolve(__dirname, "./preload.js"),
    nodeIntegration: true, // 確保渲染進程可以使用 Node.js API
    enableRemoteModule: true, // 允許渲染進程使用 remote 模組
    experimentalFeatures: true,
    webviewTag: true,
  },

  vibrancy: {
    theme: "#999999", // (default) or 'dark' or '#rrggbbaa'
    effect: "acrylic", // (default) or 'blur'
    disableOnBlur: true, // (default)
  },
};
