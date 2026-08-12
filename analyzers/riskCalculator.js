function calcularRiscoEspacial(asteroides) {
    if (!asteroides || asteroides.length === 0) {
        return { score: 10, nivel: 'INFORMATION', cor: '🟢', type: 'CALCULATED' };
    }

    const temPerigoso = asteroides.some(a => a.is_potentially_hazardous_asteroid);
    const total = asteroides.length;

    if (temPerigoso && total > 2) {
        return { score: 75, nivel: 'HIGH', cor: '🔴', type: 'CALCULATED' };
    } else if (temPerigoso) {
        return { score: 55, nivel: 'MEDIUM', cor: '🟠', type: 'CALCULATED' };
    } else {
        return { score: 25, nivel: 'LOW', cor: '🟡', type: 'CALCULATED' };
    }
}

module.exports = { calcularRiscoEspacial };
