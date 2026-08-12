function logEvent(nivel, mensagem) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const prefixos = {
        INFO: '🟢 [INFO]',
        WARN: '🟡 [WARNING]',
        ALERT: '🔴 [ALERT]',
        ERROR: '❌ [ERROR]'
    };
    console.log(`${timestamp} ${prefixos[nivel] || '[LOG]'} ${mensagem}`);
}

module.exports = { logEvent };
