const path = require("path");
const { BrowserView, contextBridge } = require("electron");
const preloadChecker = require("./preloadChecker");

class Widget {
  name = "";
  displayName = "";
  #pluginData = null;
  #broswerView;
  #status = true;

  constructor(packageInfo) {
    this.name = packageInfo?.name ?? "unknow";
    this.#pluginData = this.#pluginDataResolve(packageInfo?.pluginData);

    this.createBrowserView();
  }

  #pathResolver(file) {
    if (file.indexOf(`plugins\\${this.name}`) > -1) return file;

    return path.resolve(__dirname, `../../plugins/${this.name}/${file}`);
  }

  #pluginDataResolve(pluginData) {
    if (!this.name || this.name === "unknow") {
      this.#status = false;
      return null;
    }

    let pd = pluginData ?? null;

    if (pd) {
      pd.main && (pd.main = this.#pathResolver(pd.main));
      pd.preload && (pd.preload = this.#pathResolver(pd.preload));

      // console.log(pd);
    } else {
      this.#status = false;
    }

    return pd;
  }

  status() {
    return this.#status;
  }

  getView() {
    return this.#pluginData.main;
  }

  getPreload() {
    return this.#pluginData.preload;
  }

  createBrowserView() {
    this.#broswerView = new BrowserView(this.#getConfig());
    this.#broswerView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    this.#broswerView.setAutoResize({ width: true });
    this.#broswerView.webContents.on("did-finish-load", () => {
      this.#browserViewLoaded();
    });
  }

  getBroswerView() {
    return this.#broswerView;
  }

  #browserViewLoaded() {
    // console.log(`bv-${this.name} loaded!!`);
    this.#broswerView.webContents.insertCSS(`
      html, body {
        margin: 0px !important;
        padding: 0px !important;
        border-radius: 0.375rem/* 4px */;
        overflow: hidden;
      }
    `);
  }

  isVaild() {
    const preloadData = this.getPreload();
    return (
      preloadData &&
      preloadChecker("deskor-plugin-preload", "pluginPreloads", preloadData)
    );
  }

  #getConfig() {
    let config = {};

    if (this.isVaild()) {
      config = {
        webPreferences: {
          preload: this.getPreload(),
          nodeIntegration: true,
          webviewTag: true,
        },
      };
    }

    return config;
  }
}

module.exports = Widget;
