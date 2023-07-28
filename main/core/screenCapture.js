const { desktopCapturer, screen, BrowserWindow } = require("electron");

const screenCapture = () => {
  const getSize = () => {
    const { size, scaleFactor } = screen.getPrimaryDisplay();
    return {
      width: size.width * 0.1,
      height: size.height * 0.1,
    };
  };

  const sizeInfo = getSize();

  desktopCapturer
    .getSources({
      types: ["window"],
      thumbnailSize: sizeInfo,
    })
    .then(async (source) => {
      let imageData = source[0].thumbnail.toDataURL("image/png");
      BrowserWindow.getFocusedWindow()?.webContents?.send("source", imageData);
    });
};

module.exports = screenCapture;
