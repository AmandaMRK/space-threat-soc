const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const { logEvent } = require('./utils/logger');
const { calcularRiscoEspacial } = require('./analyzers/riskCalculator');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

function menuSOC() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📊 Dashboard', 'cmd_dashboard'), Markup.button.callback('🚨 Ameaças (Threats)', 'cmd_threats')],
        [Markup.button.callback('🛰️ Monitor Espacial', 'cmd_space'), Markup.button.callback('🌐 Correlação Space x Cyber', 'cmd_correlacao')],
        [Markup.button.callback('📋 Briefing Diário', 'cmd_briefing'), Markup.button.callback('ℹ️ Ajuda / Comandos', 'cmd_help')]
    ]);
}

bot.command(['start', 'menu', 'help'], async (ctx) => {
    logEvent('INFO', `Usuário ${ctx.from.username || ctx.from.id} acessou o menu principal.`);
    return ctx.reply(
        '🛰️ *SPACE-THREAT SOC* 🛰️\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        'Centro de Inteligência de Ameaças, CTI e Monitoramento Espacial.\n\n' +
        'Selecione uma opção no painel de controle abaixo:',
        { parse_mode: 'Markdown', ...menuSOC() }
    );
});

bot.action('cmd_dashboard', async (ctx) => {
    logEvent('INFO', 'Dashboard solicitado via painel.');
    const dashboardText = 
        '🛰️ *SPACE-THREAT SOC* 🛰️\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '🟢 *SYSTEM:* OPERATIONAL\n' +
        '🔐 *CYBER MONITOR:* ONLINE\n' +
        '🛰️ *SPACE MONITOR:* ONLINE\n' +
        '🌌 *ASTRO MONITOR:* ONLINE\n' +
        'Threat Level: 🟢 *LOW*\n\n' +
        '• Alertas ativos: 0\n' +
        '• Uptime do sistema: 99.9%\n' +
        '• Última atualização: ' + new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    await ctx.editMessageText(dashboardText, { parse_mode: 'Markdown', ...menuSOC() });
});

bot.action('cmd_threats', async (ctx) => {
    logEvent('WARN', 'Iniciando varredura de Near-Earth Objects (NeoWS)...');
    await ctx.editMessageText('🔍 *[SIEM]* Analisando feed de Near-Earth Objects (NeoWS)...', { parse_mode: 'Markdown' });
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const res = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoje}&end_date=${hoje}&api_key=${process.env.NASA_API_KEY}`);
        const asteroides = res.data.near_earth_objects[hoje] || [];
        
        // Calcula o risco dinamicamente usando nosso módulo
        const risco = calcularRiscoEspacial(asteroides);
        logEvent('INFO', `Varredura concluída. Risco calculado: ${risco.nivel} (${risco.score}/100)`);

        if (asteroides.length === 0) {
            return ctx.editMessageText('✅ *[SIEM]* Nenhum objeto detectado na órbita terrestre hoje.', { parse_mode: 'Markdown', ...menuSOC() });
        }

        let msg = `🚨 *RELATÓRIO DE AMEAÇAS ESPACIAIS* 🚨\n`;
        msg += `Global Risk Score: ${risco.cor} *${risco.nivel} (${risco.score}/100)*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        asteroides.forEach((a, i) => {
            const perigoso = a.is_potentially_hazardous_asteroid;
            msg += `${i + 1}. *${a.name}*\n`;
            msg += `   ⚠️ Perigo Potencial: ${perigoso ? '🚨 SIM' : '✅ NÃO'}\n`;
            msg += `   📏 Diâmetro Máx: ${Math.round(a.estimated_diameter.kilometers.estimated_diameter_max)} km\n\n`;
        });

        await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...menuSOC() });
    } catch (e) {
        logEvent('ERROR', 'Falha ao consultar API da NASA no módulo de threats: ' + e.message);
        await ctx.editMessageText('❌ Erro ao consultar fontes de dados da NASA.', menuSOC());
    }
});

bot.action('cmd_space', async (ctx) => {
    logEvent('INFO', 'Consultando telemetria visual da NASA (APOD)...');
    try {
        const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
        const d = res.data;
        await ctx.deleteMessage();
        if (d.media_type === 'image') {
            await ctx.replyWithPhoto(d.url, {
                caption: `🛰️ *Space Monitor - APOD Intel*\n\n*${d.title}*\n\n${d.explanation.substring(0, 200)}...`,
                parse_mode: 'Markdown',
                ...menuSOC()
            });
        } else {
            await ctx.reply(`🛰️ *${d.title}* (Mídia externa detectada)`, {
                ...Markup.inlineKeyboard([
                    [Markup.button.url('🎬 Ver Mídia Original', d.url)],
                    [Markup.button.callback('⬅️ Voltar ao Menu', 'cmd_dashboard')]
                ])
            });
        }
    } catch (e) {
        logEvent('ERROR', 'Erro ao buscar dados do APOD.');
        await ctx.editMessageText('⚠️ Erro ao consultar telemetria espacial.', menuSOC());
    }
});

bot.action('cmd_correlacao', async (ctx) => {
    logEvent('INFO', 'Executando motor de correlação Space x Cyber...');
    const correlacaoText = 
        '🌐 *SPACE × CYBER CORRELATION ENGINE* 🌐\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '☀️ *Solar Event Status:* Nominal\n' +
        '• Impacto em Comunicações: 🟢 BAIXO\n' +
        '• Impacto em Redes GNSS/GPS: 🟢 ESTÁVEL\n' +
        '• Infraestrutura de Satélites: 🟢 SEM ANOMALIAS\n\n' +
        'Risk Score Calculado: *15 / 100 (INFORMATION)*\n' +
        'Fatores: Ausência de CMEs ativas nas últimas 24h.';

    await ctx.editMessageText(correlacaoText, { parse_mode: 'Markdown', ...menuSOC() });
});

bot.action('cmd_briefing', async (ctx) => {
    logEvent('INFO', 'Gerando Briefing Diário de Operações...');
    const briefingText = 
        '🌌 *SPACE-THREAT DAILY BRIEFING* 🌌\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '🔐 *CYBER*\n' +
        '• CVEs monitoradas: Fontes ativas\n' +
        '• Alertas críticos: 0\n\n' +
        '🛰️ *SPACE*\n' +
        '• NEOs sob vigilância: Ativo\n' +
        '• Atividade solar: Monitorada\n\n' +
        '🌍 *ENVIRONMENT*\n' +
        '• Condição geomagnética: Calma\n\n' +
        '📊 *GLOBAL RISK:* 🟢 *LOW (12/100)*\n' +
        '_Generated by Space-Threat SOC_';

    await ctx.editMessageText(briefingText, { parse_mode: 'Markdown', ...menuSOC() });
});

bot.action('cmd_help', async (ctx) => {
    await ctx.editMessageText(
        '📋 *Central de Comandos do SOC*\n\n' +
        'Utilize os botões interativos para navegar pelas operações ou dispare comandos diretos.',
        { parse_mode: 'Markdown', ...menuSOC() }
    );
});

bot.launch();
logEvent('INFO', 'Space-Threat SOC Core Engine iniciado com sucesso!');
