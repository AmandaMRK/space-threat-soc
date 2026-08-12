const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function consultarAnalistaSOC(pergunta) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Você é um Analista de SOC nível 3 especialista em Space Cybersecurity. 
    Responda tecnicamente sobre astronomia e segurança de infraestrutura orbital. 
    Pergunta: ${pergunta}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { consultarAnalistaSOC };
