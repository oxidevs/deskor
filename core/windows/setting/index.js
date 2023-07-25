const { BrowserWindow, BrowserView } = require("electron");
const config = {};

let win = null;

const create = () => {
  win = new BrowserWindow(config);
  win.setMenuBarVisibility(false);
  win.hide();

  win.loadURL("http://localhost:3000/setting/");
};

module.exports = {
  window: win,
  create,
};
