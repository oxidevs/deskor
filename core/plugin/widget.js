const path = require("path");
const { BrowserView, contextBridge } = require("electron");
const preloadChecker = require("./preloadChecker");

class Widget {
  name = "";
  #pluginData = null;

  #broswerView;

  constructor(packageInfo) {
    this.name = packageInfo?.name ?? "";
    this.#pluginData = packageInfo?.pluginData ?? null;

    this.#broswerView = new BrowserView(this.#getConfig());
    this.#broswerView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    this.#broswerView.setAutoResize({ width: true });
    this.#broswerView.webContents.on("did-finish-load", () => {
      this.#browserViewLoaded();
    });
  }

  status() {
    return this.#pluginData && true;
  }

  getView() {
    let html = this.#pluginData?.html ?? "";

    if (html) {
      html = path.resolve(__dirname, `../../plugins/${this.name}/${html}`);
    }

    return html;
  }

  getPreload() {
    let preload = this.#pluginData?.preload ?? null;

    if (preload) {
      preload = path.resolve(
        __dirname,
        `../../plugins/${this.name}/${preload}`
      );
    }

    return preload;
  }

  getBroswerView() {
    return this.#broswerView;
  }

  #browserViewLoaded() {
    console.log(`bv-${this.name} loaded!!`);
    this.#broswerView.webContents.insertCSS(`
      html, body {
        margin: 0px !important;
        padding: 0px !important;
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
    const preloadData = this.getPreload();

    let config = {};

    if (this.isVaild()) {
      config = {
        webPreferences: {
          preload: preloadData,
          nodeIntegration: true,
          webviewTag: true,
        },
      };
    }

    return config;
  }
}

module.exports = Widget;
