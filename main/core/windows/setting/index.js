const { BrowserWindow, BrowserView } = require("electron");
const config = {
  show: false,
};

let win = null;

const create = () => {
  win = new BrowserWindow(config);
  win.setMenuBarVisibility(false);

  win.loadURL("http://localhost:3000/setting/");
};

module.exports = {
  window: win,
  create,
};
