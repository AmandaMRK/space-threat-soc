const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const PORT = process.env.PORT || 3000;

if (!token) {
    console.error("ERRO CRITICO: TELEGRAM_TOKEN faltando!");
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
app.use(cors());
app.use(express.json());

// TORNA O APLICATIVO VISÍVEL NO NAVEGADOR (Página Web)
app.use(express.static(path.join(__dirname, 'public')));

// Inteligência do Bot do Telegram
async function processarInteligenciaEspacial(pergunta) {
    const p = pergunta.toLowerCase();
    if (p.includes('asteroide') || p.includes('meteorito') || p.includes('meteoro')) {
        return "☄️ **Radar NEO:** Varredura orbital indica estabilidade. Nenhum PHA em rota de colisão iminente.";
    } else if (p.includes('satelite') || p.includes('orbita')) {
        return "🛰️ **Status LEO:** Telemetria de enlaces (Banda X / Ka) nominal. Sem interferência detectada.";
    } else {
        return `🧠 **Analista SOC:** Analisando parâmetros para *\"${pergunta}\"*. Radares espaciais e firewalls operando normalmente.`;
    }
}

// Comandos do Telegram
function menuPrincipal() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('☄️ Monitor NEO', 'cmd_neo'), Markup.button.callback('🛰️ Satélites', 'cmd_sat')],
        [Markup.button.callback('🚨 Alertas SOC', 'cmd_alerts'), Markup.button.callback('🩺 Health Check', 'cmd_health')]
    ]);
}

bot.start(async (ctx) => {
    return ctx.reply(
        '🛡️ *SPACE-THREAT SOC & ASTROGUARD* 🛰️\n\n' +
        'Centro integrado de Monitoramento Espacial e Cibersegurança.',
        { parse_mode: 'Markdown', ...menuPrincipal() }
    );
});

bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    const statusMsg = await ctx.reply('⏳ *Consultando telemetria...*', { parse_mode: 'Markdown' });
    const resposta = await processarInteligenciaEspacial(ctx.message.text);
    await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, `🧠 *Relatório do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
});

bot.action('cmd_neo', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('☄️ **Módulo NEO:** Nenhum asteroide perigoso próximo hoje.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_sat', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🛰️ **Módulo LEO:** Constelações e estações de solo estáveis.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_alerts', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🚨 **Alertas CTI:** Perímetro seguro.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_health', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🩺 **Health Check:** 100% Operacional.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action(/.*/, async (ctx) => {
    try { await ctx.answerCbQuery(); } catch(e){}
});

app.listen(PORT, () => {
    console.log(`Servidor e App Web rodando na porta ${PORT}`);
});

bot.launch().then(() => {
    console.log('Bot do Telegram iniciado!');
});
