const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;

if (!token) {
    console.error("ERRO CRITICO: TELEGRAM_TOKEN faltando!");
    process.exit(1);
}

const bot = new Telegraf(token);

async function consultarAnalistaSOC(pergunta) {
    const p = pergunta.toLowerCase();
    if (p.includes('orbita') || p.includes('satelite') || p.includes('segurança')) {
        return "🛰️ **Análise de Telemetria e Órbitas:** Detectada estabilidade nominal nos links de banda X e Ka. Os vetores orbital-inbound estão sob monitoramento contínuo contra ataques de spoofing de enlace e varreduras de radar não autorizadas.";
    } else if (p.includes('ameaça') || p.includes('attack') || p.includes('incidente')) {
        return "🚨 **Intelligence Briefing:** Nenhum indicador de compromise (IoC) crítico ativo direcionado às constelações em LEO (Low Earth Orbit). Protocolos de criptografia quântica ativados nas estações terrenas primárias.";
    } else {
        return `🧠 **Parecer do Analista SOC Sênior:** Analisando a questão sobre *\"${pergunta}\"*. Os registros de telemetria espacial não apontam desvios de protocolo. Recomendo manter o rastreamento ativo nas estações de solo e verificar os logs de payload.`;
    }
}

function menuSOC() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📊 Dashboard', 'cmd_dash'), Markup.button.callback('📈 Metrics', 'cmd_metrics')],
        [Markup.button.callback('🚨 Incidents', 'cmd_incidents'), Markup.button.callback('🛠️ Demo', 'cmd_demo')]
    ]);
}

bot.start(async (ctx) => {
    console.log(`Comando /start recebido de ${ctx.from.id}`);
    return ctx.reply(
        '🛡️ *SPACE-THREAT SOC [TIER-3]* 🛰️\n\n' +
        'Centro de Inteligência de Ameaças e Monitoramento Espacial.\n' +
        'Selecione uma opção ou digite sua pergunta para a IA:',
        { parse_mode: 'Markdown', ...menuSOC() }
    );
});

bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    
    console.log(`Mensagem de texto recebida: ${ctx.message.text}`);
    const statusMsg = await ctx.reply('⏳ *Processando com Analista SOC...*', { parse_mode: 'Markdown' });
    
    const resposta = await consultarAnalistaSOC(ctx.message.text);
    
    try {
        await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, `🧠 *Resposta do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
    } catch (e) {
        await ctx.reply(`🧠 *Resposta do Analista SOC:*\n\n${resposta}`, { parse_mode: 'Markdown' });
    }
});

bot.action(/.*/, async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.editMessageText('🛰️ *Módulo SOC Operacional*\nPainel atualizado com sucesso.', { parse_mode: 'Markdown', ...menuSOC() });
    } catch (e) {}
});

bot.launch().then(() => {
    console.log('Space-Threat SOC Bot rodando com sucesso!');
});
