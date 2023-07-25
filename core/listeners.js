const { ipcMain } = require("electron");
const { BrowserWindow, BrowserView } = require("electron");
// const { BrowserWindow } = require("electron-acrylic-window");
const path = require("path");
const fs = require("fs");
// const screenCapture = require("./screenCapture");
const { loadPlugins } = require("./plugin");

let widgets = [];
let usedList = [];

const saveSetting = () => {
  const setting = {
    usedList,
  };

  fs.writeFile(
    path.resolve(__dirname, "../setting.json"),
    JSON.stringify(setting),
    (err) => {
      if (err) console.log("[Error] setting can't save.");
    }
  );
};

module.exports = (win) => {
  // win.setIgnoreMouseEvents(true, { forward: true });

  ipcMain.on("set-ignore-mouse-evnets", (event, ...args) => {
    // console.log("set-ignore-mouse-events", args);
    BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args);
  });

  ipcMain.on("prepared", (evt) => {
    widgets.forEach((w) => win.removeBrowserView(w.getBroswerView()));

    widgets = loadPlugins().filter((w) => {
      console.log(`widget "${w.name}" load${w.status() ? `ed` : `ing faild`}`);
      return w.status();
    });

    const setting = require(path.resolve(__dirname, "../setting.json"));
    usedList = setting.usedList.filter((p) => {
      const w = widgets.find((w) => w.name === p);
      return w && w.isVaild();
    });

    // widgets
    //   .filter((w) => {
    //     return w.isVaild() && setting.usedList.includes(w.name);
    //   })
    //   .map((w) => w.name);

    evt.reply(
      "pluginLoaded",
      widgets.map((w) => {
        return {
          name: w.name,
          isVaild: w.isVaild(),
        };
      }),
      usedList
    );
  });

  ipcMain.on("plugin-resized", (evt, args) => {
    const { name, height } = args;
    // console.log(args);

    win.webContents.send("get-container-rect", { name, height });
  });

  ipcMain.on("set-container-rect", (evt, data) => {
    // console.log(data);

    const widget = widgets.find((w) => w.name === data.name);
    const bv = widget.getBroswerView();
    bv.setBounds({
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
    });
  });

  ipcMain.on("mount-plugin", (evt, name) => {
    console.log("do mount: " + name);

    const widget = widgets.find((w) => w.name === name);
    const bv = widget.getBroswerView();
    bv.webContents.loadFile(widget.getView());

    if (widget.isVaild()) {
      win.addBrowserView(bv);

      if (!usedList.includes(name)) {
        usedList.push(name);
        saveSetting();
      }
    }

    evt.reply("mounted");
  });

  // ipcMain.on("screenCapture", () => {
  //   // screenCapture();
  //   timer();
  // });
};
