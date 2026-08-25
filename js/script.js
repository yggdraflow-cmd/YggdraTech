initYggdraPageTransition();

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
});




/* =========================================================
   TRANSIÇÃO GLOBAL YGGDRA TECH
========================================================= */

function initYggdraPageTransition() {
  const overlay = document.createElement("div");

  overlay.className = "yggdra-page-transition";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="yggdra-transition-brand">
      <span class="yggdra-transition-name">Yggdra</span>

      <span class="yggdra-transition-word">
        <span class="yggdra-transition-word-current">Tech</span>
      </span>
    </div>
  `;

  document.body.appendChild(overlay);

  const currentWord =
    overlay.querySelector(".yggdra-transition-word-current");

  window.setTimeout(() => {
    if (!currentWord) {
      return;
    }

    currentWord.classList.add("is-leaving");

    window.setTimeout(() => {
      currentWord.textContent = "All";
      currentWord.classList.remove("is-leaving");
      currentWord.classList.add("is-entering");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          currentWord.classList.remove("is-entering");
        });
      });
    }, 260);
  }, 900);

  window.setTimeout(() => {
    overlay.classList.add("is-finished");

    window.setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 1900);
}

/* =========================================================
   CHATBOT - ABRIR, FECHAR E ENVIAR
========================================================= */

function initChatbot() {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const closeChat = document.getElementById("close-chat");
  const chatbotInput = document.getElementById("chatbot-input");
  const sendChat = document.getElementById("send-chat");
  const chatbotMessages = document.getElementById("chatbot-messages");

  if (
    !chatbotToggle ||
    !chatbotWindow ||
    !chatbotInput ||
    !sendChat ||
    !chatbotMessages
  ) {
    return;
  }

  function openChat() {
    chatbotWindow.classList.remove("hidden");
    chatbotInput.focus();
  }

  function closeChatWindow() {
    chatbotWindow.classList.add("hidden");
  }

  function toggleChat() {
    if (chatbotWindow.classList.contains("hidden")) {
      openChat();
    } else {
      closeChatWindow();
    }
  }

  function addMessage(text, type) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", `${type}-message`);
    messageDiv.innerHTML = text.replace(/\n/g, "<br>");

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function sendMessage() {
    const message = chatbotInput.value.trim();

    if (!message) return;

    addMessage(message, "user");
    chatbotInput.value = "";

    chatbotInput.disabled = true;
    sendChat.disabled = true;

    setTimeout(() => {
      const reply = getBotReply(message);

      addMessage(reply, "bot");

      chatbotInput.disabled = false;
      sendChat.disabled = false;
      chatbotInput.focus();
    }, 500);
  }

  chatbotToggle.addEventListener("click", toggleChat);

  if (closeChat) {
    closeChat.addEventListener("click", closeChatWindow);
  }

  sendChat.addEventListener("click", sendMessage);

  chatbotInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  if (!chatbotMessages.dataset.started) {
    chatbotMessages.dataset.started = "true";

    setTimeout(() => {
      addMessage(
        "Olá! Eu sou o assistente da Yggdra Tech. Posso te ajudar com sites, landing pages, sistemas, APIs, automações, integrações, prazos, orçamento ou contato com um representante.",
        "bot"
      );
    }, 500);
  }
}


/* =========================================================
   RESPOSTAS DO CHATBOT
========================================================= */

let chatContext = {
  interesse: null,
  objetivo: null,
  etapa: "inicio"
};

function getBotReply(message) {
  const text = normalizeText(message);

  const whatsappLink =
    "https://wa.me/5511978880443?text=Olá!%20Vim%20pelo%20site%20da%20Yggdra%20Tech%20e%20gostaria%20de%20falar%20com%20um%20representante.";

  if (hasAny(text, ["oi", "ola", "bom dia", "boa tarde", "boa noite", "opa", "eae"])) {
    chatContext.etapa = "inicio";

    return `Olá! Seja bem-vindo à Yggdra Tech 👋

Para eu te orientar melhor, me diga o que você precisa:

• Criar um site
• Criar uma landing page
• Criar um sistema
• Automatizar processos
• Fazer uma integração
• Solicitar orçamento
• Falar com um representante`;
  }

  if (hasAny(text, ["representante", "atendente", "humano", "whatsapp", "zap", "wpp", "contato", "falar com alguem", "falar com alguém"])) {
    return `Claro! Você pode falar diretamente com um representante da Yggdra Tech:

<a href="${whatsappLink}" target="_blank">Clique aqui para chamar no WhatsApp</a>

Ou envie mensagem para: <strong>11 99428-0245</strong>`;
  }

  if (hasAny(text, ["site", "criar um site", "quero um site", "site institucional"])) {
    chatContext.interesse = "site";
    chatContext.etapa = "objetivo";

    return `Perfeito. Um site pode ter objetivos diferentes.

Você quer um site para:

• Apresentar sua empresa
• Captar clientes
• Mostrar seus serviços
• Passar mais credibilidade
• Receber contatos pelo WhatsApp

Qual desses objetivos combina mais com o que você precisa?`;
  }

  if (hasAny(text, ["landing", "landing page", "pagina de vendas", "página de vendas", "captar leads", "leads"])) {
    chatContext.interesse = "landing";
    chatContext.etapa = "orcamento";

    return `Ótima escolha. Uma landing page é indicada quando o foco é conversão.

Ela pode ajudar a:

• Captar clientes
• Divulgar um serviço específico
• Receber contatos
• Direcionar para WhatsApp
• Gerar oportunidades de venda

Você já tem logo, textos e imagens ou ainda precisa criar tudo do zero?`;
  }

  if (hasAny(text, ["sistema", "sistemas", "plataforma", "painel", "dashboard", "admin"])) {
    chatContext.interesse = "sistema";
    chatContext.etapa = "diagnostico";

    return `Entendi. Um sistema web é ideal para organizar processos internos.

Ele pode ter:

• Login de usuários
• Cadastro de clientes
• Painel administrativo
• Controle de serviços
• Relatórios
• Dashboard
• Gestão de informações

O que você gostaria de controlar ou organizar nesse sistema?`;
  }

  if (hasAny(text, ["api", "apis", "backend", "back-end", "endpoint"])) {
    chatContext.interesse = "api";
    chatContext.etapa = "diagnostico";

    return `Certo. Uma API serve para conectar sistemas e organizar a comunicação entre dados.

Podemos criar:

• API REST
• Login e autenticação
• Integração com banco de dados
• Endpoints para sistemas web
• Comunicação entre front-end e back-end

Você precisa criar uma API nova ou integrar com algum sistema que já existe?`;
  }

  if (hasAny(text, ["automacao", "automação", "automatizar", "processo repetitivo", "tarefa repetitiva"])) {
    chatContext.interesse = "automacao";
    chatContext.etapa = "diagnostico";

    return `Boa. Automação é ideal para reduzir tarefas manuais.

Podemos ajudar com:

• Envio automático de mensagens
• Organização de dados
• Integração entre ferramentas
• Alertas automáticos
• Processos repetitivos
• Fluxos internos

Qual tarefa hoje toma tempo e você gostaria de automatizar?`;
  }

  if (hasAny(text, ["integracao", "integração", "integrar", "conectar", "ferramentas"])) {
    chatContext.interesse = "integracao";
    chatContext.etapa = "diagnostico";

    return `Entendi. Integrações ajudam sistemas diferentes a conversarem entre si.

Podemos trabalhar com:

• Integração entre site e sistema
• Integração com APIs externas
• Integração com banco de dados
• Integração com formulários
• Integração com automações

Quais ferramentas ou sistemas você precisa conectar?`;
  }

  if (hasAny(text, ["captar clientes", "clientes", "vender mais", "vendas", "leads", "gerar contatos"])) {
    chatContext.objetivo = "captar clientes";

    return `Nesse caso, uma landing page pode ser mais indicada que um site institucional.

Ela é mais direta e focada em conversão.

O ideal seria criar uma página com:

• Chamada forte
• Apresentação do serviço
• Benefícios
• Diferenciais
• Botão para WhatsApp
• Formulário de contato

Quer seguir para um orçamento ou falar com um representante?`;
  }

  if (hasAny(text, ["apresentar empresa", "minha empresa", "credibilidade", "institucional", "serviços", "servicos"])) {
    chatContext.objetivo = "apresentar empresa";

    return `Para esse objetivo, um site institucional é o caminho mais adequado.

Ele pode conter:

• Quem somos
• Serviços
• Diferenciais
• Contato
• WhatsApp
• Redes sociais

Esse tipo de site ajuda sua empresa a parecer mais profissional e confiável.

Você já tem conteúdo pronto ou precisa de ajuda para estruturar os textos?`;
  }

  if (hasAny(text, ["orcamento", "orçamento", "preco", "preço", "valor", "quanto custa", "custa"])) {
    chatContext.etapa = "orcamento";

    return `Para montar um orçamento justo, precisamos entender alguns pontos:

• Tipo de projeto
• Funcionalidades desejadas
• Prazo esperado
• Se já existe logo, textos e imagens
• Se precisa de integração com WhatsApp, API ou sistema

Para continuar com um representante:

<a href="${whatsappLink}" target="_blank">Chamar no WhatsApp</a>`;
  }

  if (hasAny(text, ["tenho logo", "tenho textos", "tenho imagens", "ja tenho", "já tenho"])) {
    return `Ótimo. Isso ajuda bastante no andamento do projeto.

Com os materiais prontos, conseguimos focar melhor em:

• Estrutura da página
• Design
• Experiência do usuário
• Botões de conversão
• Publicação do site

<a href="${whatsappLink}" target="_blank">Falar com um representante</a>`;
  }

  if (hasAny(text, ["nao tenho", "não tenho", "do zero", "preciso criar", "preciso de ajuda"])) {
    return `Sem problema. Podemos ajudar a estruturar o projeto desde o início.

Nesse caso, podemos pensar em:

• Estrutura da página
• Textos principais
• Organização dos serviços
• Direção visual
• Botões para contato
• Caminho para conversão

<a href="${whatsappLink}" target="_blank">Chamar no WhatsApp</a>`;
  }

  if (hasAny(text, ["servico", "servicos", "serviço", "serviços", "fazem", "trabalham"])) {
    return `A Yggdra Tech trabalha com soluções digitais sob medida:

• Sites institucionais
• Landing pages
• Sistemas web
• APIs
• Automações
• Dashboards
• Integrações

Me diga qual dessas opções faz mais sentido para você.`;
  }

  if (chatContext.interesse) {
    return `Entendi. Como estamos falando sobre ${chatContext.interesse}, o melhor caminho é entender seu objetivo principal.

Você quer:

• Captar clientes
• Apresentar sua empresa
• Organizar processos
• Automatizar tarefas
• Integrar ferramentas
• Solicitar orçamento
• Falar com um representante?`;
  }

  return `Entendi. Para eu te orientar melhor, escolha uma opção:

• Criar um site
• Criar uma landing page
• Criar um sistema
• Automatizar processos
• Fazer uma integração
• Solicitar orçamento
• Falar com um representante

Se preferir, fale direto no WhatsApp:

<a href="${whatsappLink}" target="_blank">Chamar no WhatsApp</a>`;
}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text, words) {
  return words.some((word) => text.includes(normalizeText(word)));
}


/* =========================================================
   LOADER
========================================================= */

function initLoader() {
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "0.5s";

      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 1500);
  });
}