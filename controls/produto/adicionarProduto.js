function adicionarProduto() {

    const codigo =
        document.getElementById("codigo").value.trim();

    const descricao =
        document.getElementById("descricao").value.trim();

    const validade =
        document.getElementById("validade").value;

    const quantidade =
        Number(
            document.getElementById("quantidade").value
        );

    if (
        !codigo ||
        !descricao ||
        !validade ||
        !quantidade
    ) {

        alert("Preencha todos os campos.");

        return;
    }

    const diasRestantes =
        calcularDiasRestantes(validade);

    if (diasRestantes > 60) {

        alert(
            `Este produto possui ${diasRestantes} dias para vencer.\n\nEle não precisa entrar na folha de validade.`
        );

        return;
    }

    const produto = {
        codigo,
        descricao,
        validade,
        quantidade,
        diasRestantes,
        status: obterStatus(diasRestantes)
    };

    produtos.push(produto);

    renderizarTabela();

    limparCampos();
}

module.exports = {
    adicionarProduto
};