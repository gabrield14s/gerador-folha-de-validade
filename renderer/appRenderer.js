const { ipcRenderer } = require('electron');

// ── Dependências ───────────────────────────────────────────────
const { calcularDiasRestantes } = require('../controls/validade/calcularDiasRestantes');
const { obterStatus }           = require('../controls/validade/obterStatus');
const { limparCampos }          = require('../controls/UI/limparCampos');
const { mostrarErro }           = require('../controls/UI/mostrarErro');

// ── Estado global ──────────────────────────────────────────────
let produtos = [];

// ─── Lógica do Modal ──────────────────────────────────────────────]

// índice do produto sendo editado
let indexEdicao = null;

function abrirModal(index) {
  const produto = produtos[index];
  indexEdicao = index;

  document.getElementById('editCodigo').value    = produto.codigo;
  document.getElementById('editDescricao').value = produto.descricao;
  document.getElementById('editValidade').value  = produto.validade;
  document.getElementById('editQuantidade').value = produto.quantidade;

  document.getElementById('modalOverlay').classList.add('ativo');
}

function fecharModal() {
  indexEdicao = null;
  document.getElementById('modalOverlay').classList.remove('ativo');
}

document.getElementById('btnSalvarEdicao').addEventListener('click', () => {
  const validade     = document.getElementById('editValidade').value;
  const diasRestantes = calcularDiasRestantes(validade);

  produtos[indexEdicao] = {
    codigo:       document.getElementById('editCodigo').value.trim(),
    descricao:    document.getElementById('editDescricao').value.trim(),
    validade,
    quantidade:   Number(document.getElementById('editQuantidade').value),
    diasRestantes,
    status:       obterStatus(diasRestantes),
  };

  renderizarTabela();
  fecharModal();
});

document.getElementById('btnCancelarEdicao').addEventListener('click', fecharModal);

// fecha ao clicar fora do modal
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) fecharModal();
});

// ── Funções que dependem do estado local ──────────────────────
function renderizarTabela() {
  const tabela = document.getElementById('tabelaProdutos');
  tabela.innerHTML = '';

  produtos.forEach((produto, index) => {
    let classeStatus = '';
    if (produto.status === 'ATENÇÃO')  classeStatus = 'alerta60';
    if (produto.status === 'ALERTA')   classeStatus = 'alerta30';
    if (produto.status === 'CRÍTICO')  classeStatus = 'alerta15';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.codigo}</td>
      <td>${produto.descricao}</td>
      <td>${produto.validade}</td>
      <td>${produto.diasRestantes}</td>
      <td>${produto.quantidade}</td>
      <td><span class="status ${classeStatus}">${produto.status}</span></td>
      <td><button class="btn-excluir" title="Remover produto">🗑️</button></td>
      <td><button class="btn-editar" title="Editar produto">✏️</button></td>
    `;

    tr.querySelector('.btn-editar').addEventListener('click', () => abrirModal(index));
    tr.querySelector('.btn-excluir').addEventListener('click', () => {
      produtos.splice(index, 1);
      renderizarTabela();
    });

    tabela.appendChild(tr);
  });

  document.getElementById('totalProdutos').textContent = `${produtos.length} produto(s)`;
}

function adicionarProduto() {
  const codigo    = document.getElementById('codigo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const validade  = document.getElementById('validade').value;
  const quantidade = Number(document.getElementById('quantidade').value);

  if (!codigo || !descricao || !validade || !quantidade) {
    mostrarErro('Preencha todos os campos.');
    return;
  }

  const diasRestantes = calcularDiasRestantes(validade);

  if (diasRestantes > 60) {
    mostrarErro('Validade deve ser inferior a 60 dias.');
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
    mostrarErro('Adicione pelo menos um produto para gerar o PDF.');
    return;
  }

  const resultado = await ipcRenderer.invoke('gerar-pdf', { produtos, setor: '' });

  if (resultado.sucesso) {
    alert(`PDF salvo em:\n${resultado.caminho}`);
  } else if (resultado.motivo !== 'cancelado') {
    alert(`Erro: ${resultado.motivo}`);
  }
});