import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily/safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Route for FinBot AI Assistant
  app.post("/api/finbot", async (req, res) => {
    try {
      const { message, history = [], financialData = {} } = req.body;

      if (!message) {
        return res.status(400).json({ error: "O campo 'message' é obrigatório." });
      }

      // Get the appropriate client: custom user API key or system environment variable
      const userApiKey = financialData.customApiKey || process.env.GEMINI_API_KEY;
      
      if (!userApiKey) {
        // Fallback for missing key, so the app doesn't crash on preview
        const accountType = financialData.accountType || "personal";
        const typeLabel = accountType === "company" ? "empresa" : accountType === "family" ? "família" : "pessoal singular";
        return res.json({
          text: `Olá! Sou o **FinBot** 🤖. Notei que a chave da API do Gemini não foi configurada. \n\nNo entanto, consigo ler o teu perfil atualizado: tens uma **conta de ${typeLabel}** registada em nome de **${financialData.userName || "Henrique"}**.\n\nPara obteres conselhos e inteligência artificial reais, insere uma chave API do Gemini nas tuas configurações em **Perfil & Definições**!`,
          isDemo: true
        });
      }

      const client = new GoogleGenAI({
        apiKey: userApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Structure financial context for the system prompt
      const userName = financialData.userName || "Henrique";
      const currency = financialData.currency || "Kz";
      const balance = financialData.balance || 0;
      const incomes = financialData.incomes || 0;
      const expenses = financialData.expenses || 0;
      const healthScore = financialData.healthScore || 82;
      const transactions = financialData.transactions || [];
      const goals = financialData.goals || [];
      const budgets = financialData.budgets || [];
      const accountType = financialData.accountType || "personal";
      const accountTypeLabel = accountType === "company" ? "Empresa / Corporativo (Lda.)" : accountType === "family" ? "Familiar" : "Pessoal Singular";

      let familyInfo = "";
      if (accountType === "family") {
        familyInfo = `
Informações de Gestão Familiar:
- Número de Membros Totais na Família: ${financialData.familyMembersCount || 1}
- Filhos Dependentes: ${financialData.familyChildrenCount || 0}
- Membros Ativos (Trabalham): ${financialData.familyWorkingCount || 0}
- Membros Adicionais Cadastrados:
${
  financialData.familyMembersList && financialData.familyMembersList.length > 0
    ? financialData.familyMembersList.map((m: any) => `  * ${m.name} (${m.relation}) | ${m.works ? `Trabalha | Salário: ${m.salary.toLocaleString()} ${currency}` : "Não trabalha"}`).join('\n')
    : "  * Nenhum membro adicional cadastrado ainda no perfil de família"
}
`;
      }

      const systemInstruction = `Você é o FinBot 🤖, o assistente financeiro de inteligência artificial da FinFalo — uma fintech moderna lançada em 2026. 
Sua missão é dar insights precisos, conselhos acionáveis e responder a dúvidas sobre as finanças do utilizador de forma inteligente, simpática, profissional e direta.

Perfil de Categorização do Utilizador:
- Nome do Utilizador: ${userName}
- Categoria de Conta: ${accountTypeLabel} (Identifique e adapte de forma ultra-personalizada os conselhos sabendo que a conta é de empresa, família ou pessoal singular. Para famílias, fale sobre despesas coletivas, filhos, poupança conjunta e receitas consolidadas. Para empresas, aborde fluxo de caixa, IVA, provisão de imposto e lucros. Para pessoal singular, foque nos objetivos de poupança individuais e hábitos do utilizador).
${familyInfo}

Dados atuais do utilizador:
- Moeda: ${currency}
- Saldo Atual: ${balance.toLocaleString()} ${currency}
- Receitas do Mês: ${incomes.toLocaleString()} ${currency}
- Despesas do Mês: ${expenses.toLocaleString()} ${currency}
- Saúde Financeira: ${healthScore}/100 (Classificação: ${healthScore >= 80 ? 'Boa' : healthScore >= 50 ? 'Razoável' : 'Crítica'})
 
Últimas transações registadas:
${transactions.map((t: any) => `- ${t.date} | ${t.description} | ${t.type === 'income' ? '+' : '-'}${t.amount} ${currency} [Categoria: ${t.category}]`).join('\n')}

Objetivos / Metas financeiras:
${goals.map((g: any) => `- Metas: ${g.title} | Progresso: ${g.current}/${g.target} ${currency} (${Math.round((g.current / g.target) * 100)}%)`).join('\n')}

Orçamentos de Categoria:
${budgets.map((b: any) => `- Categoria: ${b.category} | Limite: ${b.limit} ${currency} | Gasto: ${b.spent} ${currency} (${Math.round((b.spent / b.limit) * 100)}%)`).join('\n')}

Diretrizes de resposta:
1. Responda em Português de Portugal de forma natural, moderna, elegante e objetiva. Use formatação em Markdown (negritos, listas) para facilitar a leitura.
2. Analise os dados reais fornecidos acima para responder perguntas de forma ultra-personalizada. Se o utilizador perguntar "Quanto gastei?", informe o total e destaque as maiores categorias. Se perguntar "Como poupar?", dê ideias concretas baseadas nas transações dele (ex: reduzir despesas em categorias que estão perto ou acima do limite do orçamento).
3. Seja proativo e positivo. Incentive hábitos financeiros saudáveis.
4. Mantenha as respostas relativamente curtas e focadas na pergunta, sem explicações genéricas longas.`;

      // Construct chat structure using contents
      // Gemini chats can be represented as an array of contents with parts
      const contents = [];
      
      // Add chat history
      for (const chatTurn of history) {
        contents.push({
          role: chatTurn.role === "user" ? "user" : "model",
          parts: [{ text: chatTurn.text }]
        });
      }
      
      // Add the latest user message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Desculpe, não consegui processar a resposta.";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Erro na API FinBot:", error);
      res.status(500).json({ error: "Erro interno ao processar solicitação com o FinBot.", details: error.message });
    }
  });

  // Serve Vite or static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FinFalo] Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
