function calcularDiasRestantes(dataValidade) {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const validade = new Date(dataValidade);

    validade.setHours(0, 0, 0, 0);

    const diferencaMs = validade - hoje;

    return Math.ceil(
        diferencaMs / (1000 * 60 * 60 * 24)
    );
}

module.exports = {
    calcularDiasRestantes
};