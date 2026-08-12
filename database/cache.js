const crypto = require('crypto');

// Armazenamento em memória para cache e eventos de auditoria
const cacheStore = {
    data: new Map(),
    auditLogs: []
};

function setCache(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    cacheStore.data.set(key, { value, expiresAt });
}

function getCache(key) {
    const item = cacheStore.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        cacheStore.data.delete(key);
        return null;
    }
    return item.value;
}

// Sistema de Auditoria Padronizado
function registrarEventoAuditoria({ source, category, severity, confidence, status, risk_score, raw_reference, dataType = 'REAL' }) {
    const event = {
        event_id: `EVT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        timestamp: new Date().toISOString(),
        source,             // ex: 'NASA_NEOWS', 'SYSTEM_SIMULATOR'
        category,           // ex: 'SPACE_MONITORING', 'CYBER_THREAT'
        severity,           // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
        confidence,         // 0 - 100%
        status,             // 'MONITORING', 'ACTIVE', 'MITIGATED'
        risk_score,         // 0 - 100
        data_type: dataType,// 'REAL', 'CALCULATED', 'SIMULATED_DEMO'
        raw_reference,      // dados brutos ou descrição
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    cacheStore.auditLogs.unshift(event);
    if (cacheStore.auditLogs.length > 50) cacheStore.auditLogs.pop(); // Mantém os últimos 50 eventos
    return event;
}

function getAuditLogs() {
    return cacheStore.auditLogs;
}

module.exports = { setCache, getCache, registrarEventoAuditoria, getAuditLogs };
