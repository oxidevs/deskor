const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const requireCheck = (data, callBack) => {
  const { path, pkgName } = data;

  // console.log("CallExpression1-1", path.node.callee.name, "require");
  // console.log("CallExpression1-2", path.node.arguments[0]?.value, pkgName);
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
  // console.log("CallExpression2-1", callee.type, "Identifier");
  // console.log("CallExpression2-2", callee.name, targetFunctionName);
  if (callee.type === "Identifier" && callee.name === targetFunctionName) {
    callBack();
  }
};

module.exports = (pkgName, enterPoint, file) => {
  // 讀取插件的程式碼
  const code = fs.readFileSync(file, "utf-8");

  // 解析程式碼，得到 AST
  const ast = parser.parse(code, {
    // sourceType: "module", // 如果插件是 ES 模塊，設定為 'module'
  });

  // 這裡可以遍歷 AST，尋找是否有引用你提供的套件，可以使用訪問者模式來檢查
  // 這是一個簡單的例子，你可能需要根據實際情況進行更多的處理
  let requireChk = false;
  let useChk = false;

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
