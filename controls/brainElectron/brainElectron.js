const { ipcMain, dialog, BrowserWindow } = require('electron');
const PDFDocument = require('pdfkit');
const fs = require('fs');

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  janela.loadFile('./renderer/index.html');
}

function registrarHandlers() {
  ipcMain.handle('gerar-pdf', async (event, { produtos, setor }) => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Salvar Folha de Validade',
      defaultPath: `Folha-Validade-${setor || 'Geral'}-${new Date()
        .toLocaleDateString('pt-BR')
        .replace(/\//g, '-')}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });

    if (canceled || !filePath) return { sucesso: false, motivo: 'cancelado' };

    try {
      await gerarPDF(filePath, produtos, setor);
      return { sucesso: true, caminho: filePath };
    } catch (err) {
      return { sucesso: false, motivo: err.message };
    }
  });
}

function gerarPDF(filePath, produtos, setor) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).font('Helvetica-Bold').text('FOLHA DE VALIDADE', { align: 'center' });
    if (setor) doc.fontSize(13).font('Helvetica').text(setor, { align: 'center' });
    doc.fontSize(9).text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' }).moveDown(1.5);

    const colunas = {
      codigo:   { x: 40,  largura: 100 },
      produto:  { x: 145, largura: 170 },
      validade: { x: 320, largura: 75  },
      dias:     { x: 400, largura: 45  },
      qtd:      { x: 450, largura: 45  },
      status:   { x: 500, largura: 75  },
    };
    const alturaLinha = 20;
    let y = doc.y;

    doc.rect(40, y, 535, alturaLinha).fill('#2c3e50');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    doc.text('Código',   colunas.codigo.x,   y + 6, { width: colunas.codigo.largura });
    doc.text('Produto',  colunas.produto.x,  y + 6, { width: colunas.produto.largura });
    doc.text('Validade', colunas.validade.x, y + 6, { width: colunas.validade.largura });
    doc.text('Dias',     colunas.dias.x,     y + 6, { width: colunas.dias.largura,   align: 'center' });
    doc.text('Qtd',      colunas.qtd.x,      y + 6, { width: colunas.qtd.largura,    align: 'center' });
    doc.text('Status',   colunas.status.x,   y + 6, { width: colunas.status.largura, align: 'center' });
    y += alturaLinha;

    const produtosFiltrados = produtos.filter((p) => p.status !== 'FORA');

    produtosFiltrados.forEach((produto, i) => {
      if (y + alturaLinha > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }

      doc.rect(40, y, 535, alturaLinha).fill(i % 2 === 0 ? '#f2f2f2' : '#ffffff');

      const statusCores = { CRÍTICO: '#e74c3c', ALERTA: '#e67e22', ATENÇÃO: '#f1c40f' };

      doc.font('Helvetica').fontSize(8).fillColor('#222222');
      doc.text(produto.codigo,                 colunas.codigo.x,   y + 6, { width: colunas.codigo.largura });
      doc.text(produto.descricao,              colunas.produto.x,  y + 6, { width: colunas.produto.largura });
      doc.text(formatarData(produto.validade), colunas.validade.x, y + 6, { width: colunas.validade.largura });
      doc.text(String(produto.diasRestantes),  colunas.dias.x,     y + 6, { width: colunas.dias.largura,   align: 'center' });
      doc.text(String(produto.quantidade),     colunas.qtd.x,      y + 6, { width: colunas.qtd.largura,    align: 'center' });

      doc.roundedRect(colunas.status.x, y + 4, 70, 13, 3).fill(statusCores[produto.status] || '#95a5a6');
      doc.fillColor('white').text(produto.status, colunas.status.x, y + 6, { width: 70, align: 'center' });

      y += alturaLinha;
    });

    doc.moveDown(2).font('Helvetica').fontSize(8).fillColor('#888888')
      .text(`Total de produtos: ${produtosFiltrados.length}`, { align: 'right' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

module.exports = { criarJanela, registrarHandlers };