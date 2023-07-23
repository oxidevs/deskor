const path = require("path");
const fs = require("fs");
const Widget = require("./widget");

exports.Widget = Widget;

exports.loadPlugins = () => {
  const pluginSource = path.resolve(__dirname, "../../plugins");
  if (!fs.existsSync(pluginSource)) {
    fs.mkdirSync(pluginSource);
  }

  const plugins = fs.readdirSync(pluginSource);
  return plugins
    .filter((plugin) => fs.existsSync(`${pluginSource}/${plugin}/package.json`))
    .map((plugin) => {
      const packageJson = require(`${pluginSource}/${plugin}/package.json`);
      return new Widget(packageJson);
    });
};
