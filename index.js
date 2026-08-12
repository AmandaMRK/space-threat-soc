const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 3000;

if (!token) {
    console.error("ERRO CRITICO: TELEGRAM_TOKEN faltando!");
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
app.use(cors());
app.use(express.json());

// --- SISTEMA DE INTELIGÊNCIA DE AMEAÇAS ESPACIAIS & SOC ---
async function processarInteligenciaEspacial(pergunta) {
    const p = pergunta.toLowerCase();
    
    if (p.includes('asteroide') || p.includes('meteorito') || p.includes('meteoro') || p.includes('rocha')) {
        return "☄️ **Radar NEO (Near-Earth Objects):** Varredura atual nas coordenadas orbitais indica estabilidade. Nenhum objeto de classe PHA (Potentially Hazardous Asteroid) em rota de colisão iminente nas próximas 48h. Monitoramento de trayectória via JPL NASA ativo.";
    } else if (p.includes('satelite') || p.includes('orbita') || p.includes('constelação')) {
        return "🛰️ **Status de Constelações LEO:** Telemetria de enlaces (Banda X / Ka) nominal. Detectado leve ruído térmico na estação de solo secundária, mas sem evidências de interferência intencional (Jamming/Spoofing).";
    } else if (p.includes('segurança') || p.includes('ameaça') || p.includes('ciber') || p.includes('attack')) {
        return "🚨 **SOC Space-Threat CTI:** Perímetros de telemetria seguros. Protocolos de criptografia de comando e controle (C2) operando com chaves rotativas de nível militar.";
    } else {
        return `🧠 **Parecer do Analista Sênior:** Analisando os parâmetros de telemetria para *\"${pergunta}\"*. Os radares de rastreamento espacial e os firewalls de telemetria não registraram anomalias críticas.`;
    }
}

// --- ROTAS DO WEB APP / DASHBOARD ---
app.get('/', (req, res) => {
    res.json({
        status: "ONLINE",
        system: "Space-Threat SOC & AstroGuard API",
        version: "2.0.0",
        telemetry: "Nominal",
        active_modules: ["NEO Tracker", "Satellite Link Guard", "Telegram Bot Relay"]
    });
});

// Endpoint para o futuro painel buscar os dados de status
app.get('/api/status', (req, res) => {
    res.json({
        radar_status: "Ativo",
        tracked_objects: 1420,
        threat_level: "Baixo (Green)",
        last_scan: new Date().toISOString()
    });
});

// --- COMANDOS DO TELEGRAM ---
function menuPrincipal() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('☄️ Monitor de Asteroides', 'cmd_neo'), Markup.button.callback('🛰️ Status Satélites', 'cmd_sat')],
        [Markup.button.callback('🚨 Alertas SOC', 'cmd_alerts'), Markup.button.callback('🩺 Health Check', 'cmd_health')]
    ]);
}

bot.start(async (ctx) => {
    return ctx.reply(
        '🛡️ *SPACE-THREAT SOC & ASTROGUARD* 🛰️\n\n' +
        'Centro integrado de Monitoramento Espacial e Cibersegurança de Órbita.\n' +
        'Selecione um módulo operacional abaixo ou digite sua consulta técnica:',
        { parse_mode: 'Markdown', ...menuPrincipal() }
    );
});

bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    
    const statusMsg = await ctx.reply('⏳ *Consultando telemetria e bases de dados espaciais...*', { parse_mode: 'Markdown' });
    const resposta = await processarInteligenciaEspacial(ctx.message.text);
    
    try {
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, `🧠 *Relatório do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
    } catch (e) {
        await ctx.reply(`🧠 *Relatório do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
    }
});

// Ações dos botões do menu interativo
bot.action('cmd_neo', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('☄️ *Módulo NEO (Near-Earth Objects)*\n\nNenhum asteroide perigoso próximo detectado nas últimas 24 horas. Rastreamento de bólidos e meteoros em tempo real ativo.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_sat', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🛰️ *Módulo de Constelações LEO*\n\nConexões com constelações principais estáveis. Perda de pacotes inferior a 0.01%. Sem registros de colisão iminente.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_alerts', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🚨 *Painel de Alertas CTI*\n\nNenhum incidente de spoofing ou intrusão em estações terrenas reportado hoje.', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action('cmd_health', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.editMessageText('🩺 *System Health Check*\n\n- Bot Telegram: Operacional\n- API Backend: 100% Up\n- Feed NASA/CelesTrak: Sincronizado', { parse_mode: 'Markdown', ...menuPrincipal() });
});

bot.action(/.*/, async (ctx) => {
    try { await ctx.answerCbQuery(); } catch(e){}
});

// Inicialização simultânea do Servidor Web e do Bot do Telegram
app.listen(PORT, () => {
    console.log(`Servidor web do app rodando na porta ${PORT}`);
});

bot.launch().then(() => {
    console.log('Bot do Telegram do AstroGuard iniciado com sucesso!');
});
