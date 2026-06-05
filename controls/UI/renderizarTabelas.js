function renderizarTabela() {

    const tabela = document.getElementById("tabelaProdutos");

    tabela.innerHTML = "";

    produtos.forEach(produto => {

        let classeStatus = "";

        if (produto.status === "ATENÇÃO") {
            classeStatus = "alerta60";
        }

        if (produto.status === "ALERTA") {
            classeStatus = "alerta30";
        }

        if (produto.status === "CRÍTICO") {
            classeStatus = "alerta15";
        }

        tabela.innerHTML += `
            <tr>
                <td>${produto.codigo}</td>
                <td>${produto.descricao}</td>
                <td>${produto.validade}</td>
                <td>${produto.diasRestantes}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <span class="status ${classeStatus}">
                        ${produto.status}
                    </span>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalProdutos").textContent =
        `${produtos.length} produto(s)`;
}

module.exports = {
    renderizarTabela
};