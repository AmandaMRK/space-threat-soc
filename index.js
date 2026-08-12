const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command('monitorar', async (ctx) => {
    ctx.reply('🔍 Iniciando varredura de ameaças espaciais... aguarde.');
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const res = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoje}&end_date=${hoje}&api_key=${process.env.NASA_API_KEY}`);
        const asteroides = res.data.near_earth_objects[hoje];
        
        if (!asteroides || asteroides.length === 0) {
            return ctx.reply('✅ Status do Espaço: Nenhum asteroide detectado próximo à Terra hoje.');
        }

        let mensagem = `🚨 *RELATÓRIO DE AMEAÇAS [SOC]* 🚨\n\n`;
        asteroides.forEach((a, i) => {
            const perigoso = a.is_potentially_hazardous_asteroid;
            mensagem += `${i + 1}. *${a.name}*\n`;
            mensagem += `   ⚠️ Perigo: ${perigoso ? 'SIM' : 'NÃO'}\n`;
            mensagem += `   📏 Diâmetro: ${Math.round(a.estimated_diameter.kilometers.estimated_diameter_max)} km\n\n`;
        });
        ctx.reply(mensagem, { parse_mode: 'Markdown' });
    } catch (e) {
        ctx.reply('❌ Erro no sensor de ameaças: ' + e.message);
    }
});

bot.command('start', (ctx) => ctx.reply('🛰️ Space SOC Monitor Online.\nUse /monitorar para escanear ameaças espaciais.'));

bot.launch();
console.log('Space SOC Monitor rodando!');
