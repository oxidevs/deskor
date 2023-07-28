const path = require("path");
const { BrowserView } = require("electron");
const preloadChecker = require("./preloadChecker");

/**
 * Represents a Widget class with some functionalities.
 */
class Widget {
  /**
   * @type {string} The name of the Widget.
   */
  name = "";

  /**
   * @type {string} The display name of the Widget.
   */
  displayName = "";

  #pluginData = null;
  #broswerView;
  #status = true;

  /**
   * Creates a new instance of Widget.
   * @param {Object} packageInfo - The `package.json` object of the Widget.
   * @param {string} packageInfo.name - The name of the Widget.
   * @param {Object | null} packageInfo.pluginData - The plugin data of the Widget (optional).
   */
  constructor(packageInfo) {
    this.name = packageInfo?.name ?? "unknown";
    this.#pluginData = this.#pluginDataResolver(packageInfo?.pluginData);

    this.createBrowserView();
  }

  /**
   * Resolves the file path relative to the Widget's directory.
   * @private
   * @param {string} file - The file path to be resolved.
   * @return {string} The resolved file path.
   */
  #pathResolver(file) {
    if (file.indexOf(`plugins\\${this.name}`) > -1) return file;

    return path.resolve(__dirname, `../../plugins/${this.name}/${file}`);
  }

  /**
   * Resolves and sets the paths in the plugin data of the Widget.
   * @private
   * @param {Object | null} pluginData - The plugin data of the Widget.
   * @return {Object | null} The resolved plugin data.
   */
  #pluginDataResolver(pluginData) {
    if (!this.name || this.name === "unknown") {
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

  /**
   * Returns the status of the Widget (can load or not).
   * @return {boolean} The status of the Widget.
   */
  status() {
    return this.#status;
  }

  /**
   * Returns the **absolutly path** to the enterpoint of the Widget.
   * @return {string} The **absolutly path** to the enterpoint of the Widget.
   */
  getView() {
    return this.#pluginData.main;
  }

  /**
   * Returns the **absolutly path** to the preload script of the Widget.
   * @return {string} The **absolutly path** to the preload script of the Widget.
   */
  getPreload() {
    return this.#pluginData.preload;
  }

  /**
   * Creates a new BrowserView instance and initializes.
   */
  createBrowserView() {
    this.#broswerView = new BrowserView(this.#getConfig());
    this.#broswerView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    this.#broswerView.setAutoResize({ width: true });
    this.#broswerView.webContents.on("did-finish-load", () => {
      this.#browserViewLoaded();
    });
  }

  /**
   * Returns the BrowserView instance associated with the Widget.
   * @return {BrowserView} The BrowserView instance.
   */
  getBroswerView() {
    return this.#broswerView;
  }

  /**
   * Handles the `did-finish-load` event of the BrowserView.
   * @private
   */
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

  /**
   * Checks if the Widget is valid by verifying the preload data.
   * @return {boolean} True if the Widget is valid, false otherwise.
   */
  isVaild() {
    const preloadData = this.getPreload();
    return (
      preloadData &&
      preloadChecker("deskor-plugin-preload", "pluginPreloads", preloadData)
    );
  }

  /**
   * Returns the configuration object for the BrowserView based on the Widget's validity.
   * @private
   * @return {Object} The configuration object for the BrowserView.
   */
  #getConfig() {
    return this.isVaild()
      ? {
          webPreferences: {
            preload: this.getPreload(),
            nodeIntegration: true,
            webviewTag: true,
          },
        }
      : {};
  }
}

module.exports = Widget;
