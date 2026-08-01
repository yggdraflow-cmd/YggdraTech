const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const PORT = 3000;

// log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// static
app.use(express.static(path.join(__dirname)));

// 🔥 CHATBOT
app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }

  const msg = message.toLowerCase();

  let reply = "Não entendi 🤔\n\nTente perguntar sobre:\n- serviços\n- preços\n- clientes\n- chatbot";

  if (msg.includes('cliente')) {
    reply = "Hoje atendemos +15 clientes ativos 🚀";
  }

  if (msg.includes('plano')) {
    reply = "📦 Temos planos Starter, Pro e Enterprise";
  }

  if (msg.includes('preço') || msg.includes('valor')) {
    reply = "💰 Projetos começam a partir de R$ 1.500";
  }

  if (msg.includes('chatbot')) {
    reply = "🤖 Criamos chatbots inteligentes para automação";
  }

  if (msg.includes('serviço')) {
    reply = "⚙️ Fazemos sistemas, APIs e automações";
  }

  res.json({ reply });
});

// fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});