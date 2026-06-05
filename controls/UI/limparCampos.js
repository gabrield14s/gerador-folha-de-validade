function limparCampos() {

    document.getElementById("codigo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("validade").value = "";
    document.getElementById("quantidade").value = "";

    document.getElementById("codigo").focus();
}

module.exports = {
    limparCampos
};