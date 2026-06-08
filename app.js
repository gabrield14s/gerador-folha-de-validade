const { app } = require('electron');
const { criarJanela, registrarHandlers } = require('./controls/brainElectron/brainElectron.js');

app.whenReady().then(() => {
  registrarHandlers(); // IPC precisa estar registrado antes da janela abrir
  criarJanela();
});