const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;

if (!token || !apiKey) {
    console.error("ERRO CRITICO: TELEGRAM_TOKEN ou GEMINI_API_KEY não configurados no .env / Railway!");
    process.exit(1);
}

const bot = new Telegraf(token);
const genAI = new GoogleGenerativeAI(apiKey);

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

function menuSOCAvancado() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📊 Dashboard', 'cmd_dashboard'), Markup.button.callback('📈 Metrics', 'cmd_metrics')],
        [Markup.button.callback('🚨 Incidents', 'cmd_incidents'), Markup.button.callback('⏳ Timeline', 'cmd_timeline')],
        [Markup.button.callback('📋 Briefing', 'cmd_briefing'), Markup.button.callback('🛰️ Sources', 'cmd_sources')],
        [Markup.button.callback('🩺 Health Check', 'cmd_health'), Markup.button.callback('🛠️ Demo Mode', 'cmd_demo')]
    ]);
}

bot.start(async (ctx) => {
    try {
        logEvent('INFO', `Comando /start acionado por ${ctx.from.username || ctx.from.id}`);
        return await ctx.reply(
            '🛡️ *SPACE-THREAT SOC [TIER-3]* 🛰️\n' +
            '_____________________\n' +
            'Centro avançado de Inteligência de Ameaças, CTI e Monitoramento Espacial.\n\n' +
            'Selecione um módulo operacional abaixo ou digite qualquer pergunta:',
            { parse_mode: 'Markdown', ...menuSOCAvancado() }
        );
    } catch (err) {
        console.error("Erro no /start:", err);
    }
});

bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    
    logEvent('INFO', `Mensagem recebida de ${ctx.from.username || ctx.from.id}`);
    const statusMsg = await ctx.reply('⏳ *Processando comando...*', { parse_mode: 'Markdown' });
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Você é um Analista de SOC especialista em Space Cybersecurity. Responda de forma técnica e direta: ${ctx.message.text}`;
        const result = await model.generateContent(prompt);
        const resposta = result.response.text();

        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, `🧠 *Resposta do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
    } catch (error) {
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, `⚠️ *Modo Operacional de Contingência* (IA temporariamente indisponível na chave).\n\nSeu comando foi registrado com sucesso nos logs do SOC!`, { parse_mode: 'Markdown' });
    }
});

// Ações dos botões
bot.action('cmd_dashboard', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🛰️ *DASHBOARD ONLINE*\nSistema operando nominalmente.', { parse_mode: 'Markdown', ...menuSOCAvancado() });
});

bot.action(/.*/, async (ctx) => {
    try { await ctx.answerCbQuery(); } catch(e){}
});

bot.launch().then(() => {
    logEvent('INFO', 'Bot iniciado com sucesso via Telegraf Polling!');
}).catch((err) => {
    console.error('Erro ao iniciar bot:', err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
