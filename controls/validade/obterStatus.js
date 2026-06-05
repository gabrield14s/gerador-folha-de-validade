function obterStatus(diasRestantes) {

    if (diasRestantes <= 15) {
        return "CRÍTICO";
    }

    if (diasRestantes <= 30) {
        return "ALERTA";
    }

    if (diasRestantes <= 60) {
        return "ATENÇÃO";
    }

    return "FORA";
}

module.exports = {
    obterStatus
};