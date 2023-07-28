const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

/**
 * Check if the provided package is required and a specific function is used in the code.
 * @param {string} pkgName - The name of the package to check.
 * @param {string} enterPoint - The name of the function to look for in the code.
 * @param {string} file - The path to the code file to analyze.
 * @return {boolean} True if the package is required and the function is used, false otherwise.
 */
module.exports = (pkgName, enterPoint, file) => {
  // Read the code of the plugin
  const code = fs.readFileSync(file, "utf-8");

  // Parse the code to get the AST (Abstract Syntax Tree)
  const ast = parser.parse(code, {
    // sourceType: "module", // Uncomment this line if the plugin is an ES module
  });

  // Traversing the AST to check if the provided package is required and the specific function is used
  // This is a simple example, you may need to perform more sophisticated checks based on your actual use case
  let requireChk = false;
  let useChk = false;

  const requireCheck = (data, callBack) => {
    const { path, pkgName } = data;
    if (
      path.node.callee.name === "require" &&
      path.node.arguments[0]?.value === pkgName
    ) {
      callBack();
    }
  };

  const useCheck = (data, callBack) => {
    const { path, targetFunctionName } = data;
    const callee = path.node.callee;
    if (callee.type === "Identifier" && callee.name === targetFunctionName) {
      callBack();
    }
  };

  traverse(ast, {
    CallExpression(path) {
      requireCheck({ path, pkgName }, () => {
        requireChk = true;
      });

      useCheck({ path, targetFunctionName: enterPoint }, () => {
        useChk = true;
      });
    },
  });

  return [requireChk, useChk].every((b) => b);
};
