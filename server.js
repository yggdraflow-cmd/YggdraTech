const express = require("express");
const path = require("path");

const app = express();

const PORT = Number(process.env.PORT || 3000);

const YGGDRAFLOW_APP_URL = String(
  process.env.YGGDRAFLOW_APP_URL || "http://localhost:5173"
).replace(/\/+$/, "");

const YGGDRAFLOW_API_URL = String(
  process.env.YGGDRAFLOW_API_URL || "http://localhost:3333"
).replace(/\/+$/, "");

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/api/config", (req, res) => {
  res.json({
    yggdraflowAppUrl: YGGDRAFLOW_APP_URL,
    yggdraflowApiUrl: YGGDRAFLOW_API_URL,
  });
});

app.use(express.static(path.join(__dirname)));

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Mensagem vazia",
    });
  }

  const msg = message.toLowerCase();

  let reply =
    "Não entendi 🤔\n\nTente perguntar sobre:\n- serviços\n- preços\n- clientes\n- chatbot";

  if (msg.includes("cliente")) {
    reply = "Hoje atendemos +15 clientes ativos 🚀";
  }

  if (msg.includes("plano")) {
    reply = "📦 Temos planos Starter, Pro e Enterprise";
  }

  if (msg.includes("preço") || msg.includes("valor")) {
    reply = "💰 Projetos começam a partir de R$ 1.500";
  }

  if (msg.includes("chatbot")) {
    reply = "🤖 Criamos chatbots inteligentes para automação";
  }

  if (msg.includes("serviço")) {
    reply = "⚙️ Fazemos sistemas, APIs e automações";
  }

  return res.json({ reply });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`YggdraTech rodando em http://localhost:${PORT}`);
  console.log(`YggdraFlow conectado em ${YGGDRAFLOW_APP_URL}`);
});
