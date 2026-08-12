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

// Servir o Frontend Web
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint para dados de Space Weather e Threat Score (Etapa 1)
app.get('/api/space-threat-status', (req, res) => {
    res.json({
        operation_status: "NOMINAL",
        threat_score: 23,
        threat_level: "LOW",
        events_24h: 2,
        tracked_objects: 1420,
        reentries: 0,
        space_weather: {
            solar_activity: "Baixa / Estável",
            kp_index: "2.3 (Calmo)",
            geomagnetic_storm: "Nenhum alerta",
            cme: "Não detectada",
            source: "NOAA / SWPC",
            status: "ONLINE",
            updated_at: new Date().toISOString()
        }
    });
});

// Comandos Expandidos do Telegram solicitados no planejamento
bot.start(async (ctx) => {
    return ctx.reply(
        '🛡️ *ASTROGUARD SPACE THREAT SOC* 🛰️\n\n' +
        'Plataforma avançada de Inteligência e Monitoramento Orbital.\n' +
        'Utilize os comandos abaixo ou digite sua consulta técnica:',
        { parse_mode: 'Markdown', ...menuPrincipalTelegram() }
    );
});

bot.command('status', async (ctx) => {
    await ctx.reply('🟢 *Status Operacional:* NOMINAL\n📊 *Space Threat Score:* 23/100 (LOW)\n🛰️ *Objetos Monitorados:* 1,420\n🕒 *Atualizado:* Há 5 minutos', { parse_mode: 'Markdown' });
});

bot.command('spaceweather', async (ctx) => {
    await ctx.reply('☀️ *SPACE WEATHER BRIEFING*\n\n• Atividade Solar: Baixa/Estável\n• Índice Kp: 2.3 (Calmo)\n• Tempestade Geomagnética: Inativa\n• Fonte: NOAA / SWPC', { parse_mode: 'Markdown' });
});

bot.command('alerts', async (ctx) => {
    await ctx.reply('🚨 *Painel de Alertas Ativos*\n\nNenhum incidente crítico de reentrada ou colisão detectado nas últimas 24h.', { parse_mode: 'Markdown' });
});

function menuPrincipalTelegram() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📊 Status Geral', 'cmd_status'), Markup.button.callback('☀️ Space Weather', 'cmd_weather')],
        [Markup.button.callback('🚨 Alertas SOC', 'cmd_alerts'), Markup.button.callback('🛰️ Satélites', 'cmd_sats')]
    ]);
}

bot.action('cmd_status', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🟢 *Status Operacional:* NOMINAL\nSpace Threat Score: 23/100 (LOW). Todos os sistemas operando normalmente.', { parse_mode: 'Markdown', ...menuPrincipalTelegram() });
});

bot.action('cmd_weather', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('☀️ *Space Weather:* Atividade solar estável. Índice Kp em 2.3.', { parse_mode: 'Markdown', ...menuPrincipalTelegram() });
});

bot.action('cmd_alerts', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🚨 *Alertas:* Nenhum risco imediato registrado.', { parse_mode: 'Markdown', ...menuPrincipalTelegram() });
});

bot.action('cmd_sats', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🛰️ *Satélites:* Constelações LEO sob rastreamento nominal.', { parse_mode: 'Markdown', ...menuPrincipalTelegram() });
});

bot.action(/.*/, async (ctx) => {
    try { await ctx.answerCbQuery(); } catch(e){}
});

// Inicialização
app.listen(PORT, () => {
    console.log(`AstroGuard rodando na porta ${PORT}`);
});

bot.launch().then(() => {
    console.log('Bot Telegram do AstroGuard atualizado com sucesso!');
});
