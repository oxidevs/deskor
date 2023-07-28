const { BrowserWindow, screen } = require("electron");
// const { BrowserWindow } = require("electron-acrylic-window");
const path = require("path");
const listeners = require("./listeners");

const config = {
  width: 800,
  height: 600,
  resizable: false,
  transparent: true,
  // backgroundColor: "white",
  frame: false,
  // backgroundColor: "transparent",
  skipTaskbar: true,
  minimizable: false,

  icon: path.join(__dirname, "../../../../ui/public/deskor-icon.png"),

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

let win = null;

const create = () => {
  win = new BrowserWindow(config);

  const primaryDisplay = screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workArea;
  win.setBounds(workArea);

  // ipc Listeners
  listeners(win);

  if (process.env.NODE_ENV === "dev") {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile("./dist/index.html");
  }

  // 打開開發工具
  // win.webContents.openDevTools();
};

module.exports = {
  window: win,
  create,
};
