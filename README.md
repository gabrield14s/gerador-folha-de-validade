# 📦 Gerador de Folha de Validade

Aplicação desktop para geração padronizada de folhas de validade no setor de mercearia de supermercados.

## Problema resolvido

Folhas preenchidas manualmente por colaboradores geram baixa padronização e dificuldade de leitura. Esta aplicação automatiza o processo e gera um PDF padronizado.

## Stack

- **Runtime:** Node.js
- **Desktop:** Electron.js
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **PDF:** PDFKit

## Funcionalidades

- Cadastro de produtos próximos ao vencimento
- Classificação automática por status:
  - 🔴 **CRÍTICO** — até 15 dias
  - 🟠 **ALERTA** — até 30 dias
  - 🟡 **ATENÇÃO** — até 60 dias
  - ⚪ **FORA** — acima de 60 dias (não entra na folha)
- Edição e exclusão de produtos cadastrados
- Geração de PDF formatado com tabela de produtos
- Feedback visual inline de erros de validação

## Estrutura

```
Gerador-Folha-de-Validade/
├── app.js                  # Processo main do Electron
├── controls/
│   ├── brainElectron/      # IPC handlers e geração de PDF
│   ├── UI/                 # Manipulação de DOM
│   └── validade/           # Cálculo de dias e classificação de status
├── renderer/
│   ├── index.html
│   ├── style.css
│   └── appRenderer.js      # Lógica do renderer
└── package.json
```

## Como rodar

```bash
npm install
npm start
```