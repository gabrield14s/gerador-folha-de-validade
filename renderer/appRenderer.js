const { ipcRenderer } = require('electron');

// ── Dependências ───────────────────────────────────────────────
const { calcularDiasRestantes } = require('../controls/validade/calcularDiasRestantes');
const { obterStatus }           = require('../controls/validade/obterStatus');
const { limparCampos }          = require('../controls/UI/limparCampos');

// ── Estado global ──────────────────────────────────────────────
let produtos = [];

// ── Funções que dependem do estado local ──────────────────────
function renderizarTabela() {
  const tabela = document.getElementById('tabelaProdutos');
  tabela.innerHTML = '';

  produtos.forEach(produto => {
    let classeStatus = '';
    if (produto.status === 'ATENÇÃO')  classeStatus = 'alerta60';
    if (produto.status === 'ALERTA')   classeStatus = 'alerta30';
    if (produto.status === 'CRÍTICO')  classeStatus = 'alerta15';

    tabela.innerHTML += `
      <tr>
        <td>${produto.codigo}</td>
        <td>${produto.descricao}</td>
        <td>${produto.validade}</td>
        <td>${produto.diasRestantes}</td>
        <td>${produto.quantidade}</td>
        <td><span class="status ${classeStatus}">${produto.status}</span></td>
      </tr>
    `;
  });

  document.getElementById('totalProdutos').textContent = `${produtos.length} produto(s)`;
}

function adicionarProduto() {
  const codigo    = document.getElementById('codigo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const validade  = document.getElementById('validade').value;
  const quantidade = Number(document.getElementById('quantidade').value);

  if (!codigo || !descricao || !validade || !quantidade) {
    alert('Preencha todos os campos.');
    return;
  }

  const diasRestantes = calcularDiasRestantes(validade);

  if (diasRestantes > 60) {
    alert(`Este produto possui ${diasRestantes} dias para vencer.\n\nEle não precisa entrar na folha de validade.`);
    return;
  }

  produtos.push({
    codigo,
    descricao,
    validade,
    quantidade,
    diasRestantes,
    status: obterStatus(diasRestantes)
  });

  renderizarTabela();
  limparCampos();
}

// ── Event listeners ────────────────────────────────────────────
document.getElementById('btnAdicionar').addEventListener('click', adicionarProduto);

document.getElementById('btnLimpar').addEventListener('click', limparCampos);

document.getElementById('btnPdf').addEventListener('click', async () => {
  if (produtos.length === 0) {
    alert('Nenhum produto adicionado.');
    return;
  }

  const resultado = await ipcRenderer.invoke('gerar-pdf', { produtos, setor: '' });

  if (resultado.sucesso) {
    alert(`PDF salvo em:\n${resultado.caminho}`);
  } else if (resultado.motivo !== 'cancelado') {
    alert(`Erro: ${resultado.motivo}`);
  }
});