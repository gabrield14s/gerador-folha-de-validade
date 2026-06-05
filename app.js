const { app, BrowserWindow } = require("electron");
const path = require("path");

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1000,
    height: 700,
  });

  janela.loadFile("./renderer/index.html");
}

app.whenReady().then(() => {
  criarJanela();
});