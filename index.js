const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;

if (!token || !apiKey) {
    console.error("ERRO CRITICO: Token ou API Key faltando!");
    process.exit(1);
}

const bot = new Telegraf(token);

async function consultarAnalistaSOC(pergunta) {
    const prompt = `Você é um Analista de SOC nível 3 especialista em Space Cybersecurity. Responda de forma técnica e direta: ${pergunta}`;
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            return "⚠️ Erro da API do Gemini: " + data.error.message;
        } else {
            return "⚠️ Resposta vazia da API do Gemini.";
        }
    } catch (error) {
        return "⚠️ Erro de conexão HTTP: " + error.message;
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
