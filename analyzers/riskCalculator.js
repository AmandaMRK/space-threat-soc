function calcularRiscoEspacial(asteroides) {
    if (!asteroides || asteroides.length === 0) {
        return { score: 10, nivel: 'INFORMATION', cor: '🟢' };
    }

    let temPerigoso = asteroides.some(a => a.is_potentially_hazardous_asteroid);
    let total = asteroides.length;

    if (temPerigoso && total > 2) {
        return { score: 75, nivel: 'HIGH', cor: '🔴' };
    } else if (temPerigoso) {
        return { score: 55, nivel: 'MEDIUM', cor: '🟠' };
    } else {
        return { score: 25, nivel: 'LOW', cor: '🟡' };
    }
}

module.exports = { calcularRiscoEspacial };
