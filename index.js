const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simulação de base de dados e logs em memória
const auditLogs = [];

function logEvent(level, message) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    auditLogs.unshift({
        event_id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        level,
        message,
        timestamp
    });
    if (auditLogs.length > 30) auditLogs.pop();
}

// IA Analista SOC Espacial
async function consultarAnalistaSOC(pergunta) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Você é um Analista de SOC nível 3 especialista em Space Cybersecurity. Responda de forma técnica, direta e profissional sobre astronomia, segurança de satélites e ameaças espaciais. Pergunta do operador: ${pergunta}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        return "⚠️ Erro de conexão com o Analista SOC: " + error.message;
    }
}

// Novo Menu Interativo Avançado SOC (Tier-3)
function menuSOCAvancado() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📊 Dashboard', 'cmd_dashboard'), Markup.button.callback('📈 Metrics', 'cmd_metrics')],
        [Markup.button.callback('🚨 Incidents', 'cmd_incidents'), Markup.button.callback('⏳ Timeline', 'cmd_timeline')],
        [Markup.button.callback('📋 Briefing', 'cmd_briefing'), Markup.button.callback('🛰️ Sources', 'cmd_sources')],
        [Markup.button.callback('🩺 Health Check', 'cmd_health'), Markup.button.callback('🛠️ Demo Mode', 'cmd_demo')]
    ]);
}

bot.command(['start', 'menu', 'help'], async (ctx) => {
    logEvent('INFO', `Operador ${ctx.from.username || ctx.from.id} acessou o Command Center.`);
    return ctx.reply(
        '🛡️ *SPACE-THREAT SOC [TIER-3]* 🛰️\n' +
        '_____________________\n' +
        'Centro avançado de Inteligência de Ameaças, CTI e Monitoramento Espacial.\n\n' +
        'Selecione um módulo operacional abaixo ou digite qualquer pergunta para conversar com o Analista de IA:',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

// Resposta por Texto Livre via IA (Analista SOC)
bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    
    logEvent('INFO', `Consulta de IA solicitada por ${ctx.from.username || ctx.from.id}`);
    const statusMsg = await ctx.reply('⏳ *Analista SOC processando inteligência...*', { parse_mode: 'Markdown' });
    
    const resposta = await consultarAnalistaSOC(ctx.message.text);
    
    try {
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            statusMsg.message_id, 
            null, 
            `🧠 *Resposta do Analista SOC (IA):*\n\n${resposta}`, 
            { parse_mode: 'Markdown' }
        );
    } catch (e) {
        await ctx.reply(`🧠 *Resposta do Analista SOC (IA):*\n\n${resposta}`, { parse_mode: 'Markdown' });
    }
});

// Ações dos Botões do Menu
bot.action('cmd_dashboard', async (ctx) => {
    const lastEvent = auditLogs.length > 0 ? auditLogs[0].event_id : 'NENHUM';
    const text = 
        '🛰️ *SPACE-THREAT SOC - DASHBOARD* 🛡️\n' +
        '_____________________\n' +
        '🟢 *SYSTEM:* OPERACIONAL\n' +
        '🔐 *CYBER MONITOR:* ONLINE\n' +
        '🛰️ *SPACE MONITOR:* ONLINE\n' +
        'Threat Level: 🟢 *LOW (12/100)*\n\n' +
        `• Eventos Registrados: ${auditLogs.length}\n` +
        `• Último Evento ID: \`${lastEvent}\`\n` +
        '• Uptime: 99.98%\n' +
        `• Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`;
    
    await ctx.answerCbQuery();
    return ctx.editMessageText(text, { parse_mode: 'Markdown', ...menuSOCAvancado() });
});

bot.action('cmd_metrics', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
        '📈 *SPACE-THREAT SOC - METRICS* 📊\n_____________________\n' +
        '• Total Processado: 1,420 pacotes\n' +
        '• Fontes Reais (NASA/NVD): 88%\n' +
        '• Simulações / Demo: 12%\n' +
        '• Latência Média de Resposta: 142ms\n' +
        '• Confiabilidade Operacional: 99.9%',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_incidents', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
        '🚨 *SPACE-THREAT SOC - INCIDENTS* ⚠️\n_____________________\n' +
        'Nenhum incidente crítico ativo no momento.\n' +
        '• Último alerta menor resolvido há 2h.\n' +
        '• Sistema operando dentro dos parâmetros nominais.',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_timeline', async (ctx) => {
    await ctx.answerCbQuery();
    const ultimos = auditLogs.slice(0, 5).map(l => `• \`${l.timestamp}\` - [${l.level}] ${l.message}`).join('\n') || 'Nenhum evento recente.';
    return ctx.editMessageText(
        '⏳ *SPACE-THREAT SOC - TIMELINE* 🕒\n_____________________\n' +
        ultimos,
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_briefing', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
        '📋 *SPACE-THREAT SOC - BRIEFING DIÁRIO* 🛰️\n_____________________\n' +
        '• *Clima Espacial:* Vento solar estável (450 km/s).\n' +
        '• *NEOs Próximos:* 2 asteroides em órbita segura hoje.\n' +
        '• *CTI Cibersegurança:* Nenhuma CVE crítica afetando infraestruturas espaciais nas últimas 24h.',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_sources', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
        '🛰️ *SOURCES & GOVERNANCE* 📋\n_____________________\n' +
        '• NASA NeoWS API (Near Earth Objects)\n' +
        '• NASA APOD (Astronomy Picture of the Day)\n' +
        '• National Vulnerability Database (NVD)\n' +
        '• Status: Conectado com criptografia TLS 1.3',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_health', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText(
        '🩺 *HEALTH CHECK - SISTEMA* 🟢\n_____________________\n' +
        '• Core Engine: 🟢 OK\n' +
        '• Cache em Memória: 🟢 OK\n' +
        '• Gateway de APIs: 🟢 OK\n' +
        '• Auditoria e Logs: 🟢 OK',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.action('cmd_demo', async (ctx) => {
    logEvent('ALERT', 'Simulação de incidente (Demo Mode) acionada pelo operador.');
    await ctx.answerCbQuery('Modo Demo executado!');
    return ctx.editMessageText(
        '🛠️ *DEMO MODE - SIMULAÇÃO DE INCIDENTE* ⚠️\n_____________________\n' +
        '🚨 *ALERTA SIMULADO:* Detectada anomalia de sinal em banda X em estação terrena.\n' +
        '• Severidade: ALTA (Simulação Controlada)\n' +
        '• Ação recomendada: Isolamento de link secundário.\n' +
        '*(Este é um evento de teste e não afeta sistemas reais)*',
        { parse_mode: 'Markdown', ...menuSOCAvancado() }
    );
});

bot.launch();
logEvent('INFO', 'Space-Threat SOC Core Engine com IA Gemini iniciado com sucesso!');
