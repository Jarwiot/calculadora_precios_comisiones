document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const chatbotToggle = document.getElementById("chatbot-toggle")
  const chatbotBox = document.getElementById("chatbot-box")
  const chatbotClose = document.getElementById("chatbot-close")
  const chatbotMessages = document.getElementById("chatbot-messages")
  const chatbotInput = document.getElementById("chatbot-input")
  const chatbotSend = document.getElementById("chatbot-send")
  const chatbotNotification = document.querySelector(".chatbot-notification")

  // Idioma actual (por defecto: español)
  let currentLang = "es"

  // Caché para respuestas frecuentes
  const responseCache = new Map()

  // Bases de conocimientos para diferentes idiomas
  const knowledgeBases = {
    es: [
      {
        keywords: ["hola", "saludos", "buenos días", "buenas tardes", "buenas noches", "hey"],
        response:
          "¡Hola! Soy el asistente virtual de la calculadora de presupuestos para dibujos digitales. ¿En qué puedo ayudarte hoy?",
        weight: 1,
      },
      {
        keywords: ["precio", "cuánto cuesta", "tarifa", "costo", "valor"],
        response:
          "Los precios varían según el tipo de ilustración, nivel de detalle, número de personajes y otros factores. Puedes usar nuestra calculadora para obtener un presupuesto personalizado.",
        weight: 2,
      },
      {
        keywords: ["tipo", "ilustración", "retrato", "personaje", "fondo", "concept art"],
        response:
          "Ofrecemos varios tipos de ilustraciones: retratos (desde $500), personajes completos (desde $800), fondos (desde $600) y concept art (desde $1000). Cada tipo tiene diferentes precios base.",
        weight: 2,
      },
      {
        keywords: ["detalle", "nivel", "simple", "medio", "complejo"],
        response:
          "El nivel de detalle afecta significativamente el precio: simple (precio base), medio (50% adicional) y complejo (100% adicional). Esto refleja el tiempo y esfuerzo necesarios para crear la ilustración.",
        weight: 2,
      },
      {
        keywords: ["personajes", "personas", "figuras", "cantidad"],
        response:
          "Cada personaje adicional aumenta el precio en $200. Esto se debe al trabajo extra que implica diseñar y dibujar cada personaje.",
        weight: 2,
      },
      {
        keywords: ["fondo", "background", "escenario"],
        response:
          "Puedes elegir entre un fondo simple (incluido en el precio base) o un fondo detallado (costo adicional de $300).",
        weight: 2,
      },
      {
        keywords: ["derechos", "uso", "comercial", "exclusivo"],
        response:
          "Ofrecemos diferentes opciones de derechos: sin derechos (10% de descuento), uso personal (precio estándar), uso comercial (20% adicional) y derechos exclusivos (50% adicional).",
        weight: 2,
      },
      {
        keywords: ["urgencia", "rápido", "prisa", "entrega"],
        response:
          "La opción de entrega rápida tiene un costo adicional del 30% sobre el precio base, pero garantiza una prioridad en la realización del trabajo.",
        weight: 2,
      },
      {
        keywords: ["tiempo", "duración", "plazo", "cuánto tarda"],
        response:
          "El tiempo de entrega depende de la complejidad del proyecto. Normalmente, un trabajo simple puede tardar 3-5 días, mientras que uno complejo puede llevar 1-2 semanas. Con la opción de urgencia, estos plazos se reducen significativamente.",
        weight: 2,
      },
      {
        keywords: ["pago", "método", "transferencia", "efectivo", "tarjeta"],
        response:
          "Aceptamos diversos métodos de pago: transferencia bancaria, PayPal, y tarjetas de crédito/débito. Normalmente solicitamos un anticipo del 50% para iniciar el trabajo.",
        weight: 2,
      },
      {
        keywords: ["proceso", "cómo funciona", "pasos", "procedimiento"],
        response:
          "Nuestro proceso es simple: 1) Obtienes un presupuesto con esta calculadora, 2) Nos contactas para discutir detalles, 3) Realizamos un boceto preliminar, 4) Una vez aprobado, completamos la ilustración, 5) Entregamos el trabajo final en los formatos solicitados.",
        weight: 2,
      },
      {
        keywords: ["formato", "archivo", "jpg", "png", "psd"],
        response:
          "Entregamos los trabajos en formato digital de alta resolución. Normalmente proporcionamos archivos JPG y PNG. Los archivos editables (PSD, AI) están disponibles con costo adicional o incluidos en los paquetes con derechos exclusivos.",
        weight: 2,
      },
      {
        keywords: ["contacto", "email", "teléfono", "whatsapp", "comunicar"],
        response:
          "Puedes contactarnos a través de nuestro email: info@ejemplo.com o por WhatsApp al +XX XXXX XXXX. Estaremos encantados de responder a todas tus preguntas.",
        weight: 2,
      },
      {
        keywords: ["divisa", "moneda", "cambio", "dólar", "euro", "peso"],
        response:
          "Nuestra calculadora te permite obtener presupuestos en diferentes divisas. Los precios base están en Pesos Mexicanos (MXN), pero puedes seleccionar otras monedas como USD, EUR, GBP, entre otras. La conversión se realiza automáticamente según las tasas de cambio actuales.",
        weight: 2,
      },
      {
        keywords: ["idioma", "lenguaje", "traducción", "traducir", "cambiar idioma"],
        response:
          "Nuestra calculadora está disponible en varios idiomas: Español, Inglés, Francés y Portugués. Puedes cambiar el idioma usando el selector en la parte superior de la página.",
        weight: 2,
      },
      {
        keywords: ["gracias", "thank", "agradecido", "agradezco"],
        response: "¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en consultarme.",
        weight: 1,
      },
      {
        keywords: ["adiós", "chao", "hasta luego", "nos vemos", "bye"],
        response:
          "¡Hasta luego! Espero haberte sido de ayuda. Vuelve cuando quieras para resolver más dudas sobre nuestros servicios de ilustración.",
        weight: 1,
      },
      {
        keywords: ["oscuro", "claro", "tema", "modo oscuro", "modo claro", "dark mode", "light mode"],
        response:
          "Puedes cambiar entre modo oscuro y claro haciendo clic en el botón con el icono de sol/luna en la parte superior izquierda de la página. Tu preferencia se guardará para futuras visitas.",
        weight: 2,
      },
      {
        keywords: ["imprimir", "resumen", "pdf", "guardar presupuesto"],
        response:
          "Una vez calculado tu presupuesto, puedes imprimir un resumen detallado haciendo clic en el botón 'Imprimir Resumen' que aparece junto al presupuesto estimado. Esto generará un documento con todas las opciones seleccionadas y el precio final.",
        weight: 2,
      },
    ],

    en: [
      {
        keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
        response:
          "Hello! I'm the virtual assistant for the digital drawing budget calculator. How can I help you today?",
        weight: 1,
      },
      {
        keywords: ["price", "cost", "fee", "rate", "value"],
        response:
          "Prices vary depending on the type of illustration, level of detail, number of characters, and other factors. You can use our calculator to get a personalized quote.",
        weight: 2,
      },
      {
        keywords: ["type", "illustration", "portrait", "character", "background", "concept art"],
        response:
          "We offer various types of illustrations: portraits (from $500), full characters (from $800), backgrounds (from $600), and concept art (from $1000). Each type has different base prices.",
        weight: 2,
      },
      {
        keywords: ["detail", "level", "simple", "medium", "complex"],
        response:
          "The level of detail significantly affects the price: simple (base price), medium (50% additional), and complex (100% additional). This reflects the time and effort required to create the illustration.",
        weight: 2,
      },
      {
        keywords: ["characters", "people", "figures", "quantity"],
        response:
          "Each additional character increases the price by $200. This is due to the extra work involved in designing and drawing each character.",
        weight: 2,
      },
      {
        keywords: ["background", "setting", "scene"],
        response:
          "You can choose between a simple background (included in the base price) or a detailed background (additional cost of $300).",
        weight: 2,
      },
      {
        keywords: ["rights", "usage", "commercial", "exclusive"],
        response:
          "We offer different rights options: no rights (10% discount), personal use (standard price), commercial use (20% additional), and exclusive rights (50% additional).",
        weight: 2,
      },
      {
        keywords: ["urgency", "fast", "rush", "delivery"],
        response:
          "The fast delivery option has an additional cost of 30% on the base price, but guarantees priority in the completion of the work.",
        weight: 2,
      },
      {
        keywords: ["time", "duration", "deadline", "how long"],
        response:
          "Delivery time depends on the complexity of the project. Typically, a simple job can take 3-5 days, while a complex one can take 1-2 weeks. With the urgency option, these timeframes are significantly reduced.",
        weight: 2,
      },
      {
        keywords: ["payment", "method", "transfer", "cash", "card"],
        response:
          "We accept various payment methods: bank transfer, PayPal, and credit/debit cards. We typically request a 50% deposit to start the work.",
        weight: 2,
      },
      {
        keywords: ["process", "how it works", "steps", "procedure"],
        response:
          "Our process is simple: 1) Get a quote with this calculator, 2) Contact us to discuss details, 3) We create a preliminary sketch, 4) Once approved, we complete the illustration, 5) We deliver the final work in the requested formats.",
        weight: 2,
      },
      {
        keywords: ["format", "file", "jpg", "png", "psd"],
        response:
          "We deliver the work in high-resolution digital format. We typically provide JPG and PNG files. Editable files (PSD, AI) are available at an additional cost or included in packages with exclusive rights.",
        weight: 2,
      },
      {
        keywords: ["contact", "email", "phone", "whatsapp", "communicate"],
        response:
          "You can contact us through our email: info@example.com or via WhatsApp at +XX XXXX XXXX. We'll be happy to answer all your questions.",
        weight: 2,
      },
      {
        keywords: ["currency", "money", "exchange", "dollar", "euro", "peso"],
        response:
          "Our calculator allows you to get quotes in different currencies. Base prices are in Mexican Pesos (MXN), but you can select other currencies such as USD, EUR, GBP, among others. The conversion is done automatically according to current exchange rates.",
        weight: 2,
      },
      {
        keywords: ["language", "translation", "translate", "change language"],
        response:
          "Our calculator is available in several languages: Spanish, English, French, and Portuguese. You can change the language using the selector at the top of the page.",
        weight: 2,
      },
      {
        keywords: ["thanks", "thank you", "grateful", "appreciate"],
        response: "You're welcome! I'm here to help. If you have more questions, feel free to ask.",
        weight: 1,
      },
      {
        keywords: ["goodbye", "bye", "see you", "later"],
        response:
          "Goodbye! I hope I've been helpful. Come back anytime to resolve more questions about our illustration services.",
        weight: 1,
      },
      {
        keywords: ["dark", "light", "theme", "dark mode", "light mode"],
        response:
          "You can switch between dark and light mode by clicking the button with the sun/moon icon at the top left of the page. Your preference will be saved for future visits.",
        weight: 2,
      },
      {
        keywords: ["print", "summary", "pdf", "save quote"],
        response:
          "Once your budget is calculated, you can print a detailed summary by clicking the 'Print Summary' button that appears next to the estimated budget. This will generate a document with all the selected options and the final price.",
        weight: 2,
      },
    ],

    fr: [
      {
        keywords: ["bonjour", "salut", "hey", "bonsoir", "coucou"],
        response:
          "Bonjour ! Je suis l'assistant virtuel de la calculatrice de budget pour dessins numériques. Comment puis-je vous aider aujourd'hui ?",
        weight: 1,
      },
      {
        keywords: ["prix", "coût", "tarif", "taux", "valeur"],
        response:
          "Les prix varient selon le type d'illustration, le niveau de détail, le nombre de personnages et d'autres facteurs. Vous pouvez utiliser notre calculatrice pour obtenir un devis personnalisé.",
        weight: 2,
      },
      {
        keywords: ["type", "illustration", "portrait", "personnage", "arrière-plan", "concept art"],
        response:
          "Nous proposons différents types d'illustrations : portraits (à partir de 500$), personnages complets (à partir de 800$), arrière-plans (à partir de 600$) et concept art (à partir de 1000$). Chaque type a des prix de base différents.",
        weight: 2,
      },
      {
        keywords: ["détail", "niveau", "simple", "moyen", "complexe"],
        response:
          "Le niveau de détail affecte significativement le prix : simple (prix de base), moyen (50% supplémentaire) et complexe (100% supplémentaire). Cela reflète le temps et l'effort nécessaires pour créer l'illustration.",
        weight: 2,
      },
      {
        keywords: ["personnages", "personnes", "figures", "quantité"],
        response:
          "Chaque personnage supplémentaire augmente le prix de 200$. Cela est dû au travail supplémentaire impliqué dans la conception et le dessin de chaque personnage.",
        weight: 2,
      },
      {
        keywords: ["arrière-plan", "fond", "décor", "scène"],
        response:
          "Vous pouvez choisir entre un arrière-plan simple (inclus dans le prix de base) ou un arrière-plan détaillé (coût supplémentaire de 300$).",
        weight: 2,
      },
      {
        keywords: ["droits", "utilisation", "commercial", "exclusif"],
        response:
          "Nous proposons différentes options de droits : sans droits (10% de réduction), usage personnel (prix standard), usage commercial (20% supplémentaire) et droits exclusifs (50% supplémentaire).",
        weight: 2,
      },
      {
        keywords: ["urgence", "rapide", "pressé", "livraison"],
        response:
          "L'option de livraison rapide a un coût supplémentaire de 30% sur le prix de base, mais garantit une priorité dans la réalisation du travail.",
        weight: 2,
      },
      {
        keywords: ["temps", "durée", "délai", "combien de temps"],
        response:
          "Le temps de livraison dépend de la complexité du projet. Généralement, un travail simple peut prendre 3-5 jours, tandis qu'un travail complexe peut prendre 1-2 semaines. Avec l'option d'urgence, ces délais sont considérablement réduits.",
        weight: 2,
      },
      {
        keywords: ["paiement", "méthode", "virement", "espèces", "carte"],
        response:
          "Nous acceptons divers modes de paiement : virement bancaire, PayPal et cartes de crédit/débit. Nous demandons généralement un acompte de 50% pour commencer le travail.",
        weight: 2,
      },
      {
        keywords: ["processus", "comment ça marche", "étapes", "procédure"],
        response:
          "Notre processus est simple : 1) Obtenez un devis avec cette calculatrice, 2) Contactez-nous pour discuter des détails, 3) Nous créons une esquisse préliminaire, 4) Une fois approuvée, nous complétons l'illustration, 5) Nous livrons le travail final dans les formats demandés.",
        weight: 2,
      },
      {
        keywords: ["format", "fichier", "jpg", "png", "psd"],
        response:
          "Nous livrons le travail en format numérique haute résolution. Nous fournissons généralement des fichiers JPG et PNG. Les fichiers éditables (PSD, AI) sont disponibles à un coût supplémentaire ou inclus dans les forfaits avec droits exclusifs.",
        weight: 2,
      },
      {
        keywords: ["contact", "email", "téléphone", "whatsapp", "communiquer"],
        response:
          "Vous pouvez nous contacter par email : info@exemple.com ou via WhatsApp au +XX XXXX XXXX. Nous serons heureux de répondre à toutes vos questions.",
        weight: 2,
      },
      {
        keywords: ["devise", "monnaie", "change", "dollar", "euro", "peso"],
        response:
          "Notre calculatrice vous permet d'obtenir des devis dans différentes devises. Les prix de base sont en Pesos Mexicains (MXN), mais vous pouvez sélectionner d'autres devises comme USD, EUR, GBP, entre autres. La conversion est effectuée automatiquement selon les taux de change actuels.",
        weight: 2,
      },
      {
        keywords: ["langue", "langage", "traduction", "traduire", "changer langue"],
        response:
          "Notre calculatrice est disponible en plusieurs langues : Espagnol, Anglais, Français et Portugais. Vous pouvez changer la langue en utilisant le sélecteur en haut de la page.",
        weight: 2,
      },
      {
        keywords: ["merci", "remercie", "reconnaissant", "apprécier"],
        response:
          "De rien ! Je suis là pour vous aider. Si vous avez d'autres questions, n'hésitez pas à me consulter.",
        weight: 1,
      },
      {
        keywords: ["au revoir", "adieu", "à bientôt", "à plus tard"],
        response:
          "Au revoir ! J'espère avoir été utile. Revenez quand vous voulez pour résoudre d'autres questions sur nos services d'illustration.",
        weight: 1,
      },
      {
        keywords: ["sombre", "clair", "thème", "mode sombre", "mode clair"],
        response:
          "Vous pouvez basculer entre le mode sombre et le mode clair en cliquant sur le bouton avec l'icône soleil/lune en haut à gauche de la page. Votre préférence sera enregistrée pour vos prochaines visites.",
        weight: 2,
      },
      {
        keywords: ["imprimer", "résumé", "pdf", "sauvegarder devis"],
        response:
          "Une fois votre budget calculé, vous pouvez imprimer un résumé détaillé en cliquant sur le bouton 'Imprimer Résumé' qui apparaît à côté du budget estimé. Cela générera un document avec toutes les options sélectionnées et le prix final.",
        weight: 2,
      },
    ],

    pt: [
      {
        keywords: ["olá", "oi", "bom dia", "boa tarde", "boa noite"],
        response:
          "Olá! Sou o assistente virtual da calculadora de orçamentos para desenhos digitais. Como posso ajudá-lo hoje?",
        weight: 1,
      },
      {
        keywords: ["preço", "custo", "tarifa", "valor"],
        response:
          "Os preços variam de acordo com o tipo de ilustração, nível de detalhe, número de personagens e outros fatores. Você pode usar nossa calculadora para obter um orçamento personalizado.",
        weight: 2,
      },
      {
        keywords: ["tipo", "ilustração", "retrato", "personagem", "fundo", "arte conceitual"],
        response:
          "Oferecemos vários tipos de ilustrações: retratos (a partir de $500), personagens completos (a partir de $800), fundos (a partir de $600) e arte conceitual (a partir de $1000). Cada tipo tem preços base diferentes.",
        weight: 2,
      },
      {
        keywords: ["detalhe", "nível", "simples", "médio", "complexo"],
        response:
          "O nível de detalhe afeta significativamente o preço: simples (preço base), médio (50% adicional) e complexo (100% adicional). Isso reflete o tempo e esforço necessários para criar a ilustração.",
        weight: 2,
      },
      {
        keywords: ["personagens", "pessoas", "figuras", "quantidade"],
        response:
          "Cada personagem adicional aumenta o preço em $200. Isso se deve ao trabalho extra envolvido no design e desenho de cada personagem.",
        weight: 2,
      },
      {
        keywords: ["fundo", "cenário", "background", "cena"],
        response:
          "Você pode escolher entre um fundo simples (incluído no preço base) ou um fundo detalhado (custo adicional de $300).",
        weight: 2,
      },
      {
        keywords: ["direitos", "uso", "comercial", "exclusivo"],
        response:
          "Oferecemos diferentes opções de direitos: sem direitos (10% de desconto), uso pessoal (preço padrão), uso comercial (20% adicional) e direitos exclusivos (50% adicional).",
        weight: 2,
      },
      {
        keywords: ["urgência", "rápido", "pressa", "entrega"],
        response:
          "A opção de entrega rápida tem um custo adicional de 30% sobre o preço base, mas garante prioridade na realização do trabalho.",
        weight: 2,
      },
      {
        keywords: ["tempo", "duração", "prazo", "quanto tempo"],
        response:
          "O tempo de entrega depende da complexidade do projeto. Normalmente, um trabalho simples pode levar 3-5 dias, enquanto um complexo pode levar 1-2 semanas. Com a opção de urgência, esses prazos são significativamente reduzidos.",
        weight: 2,
      },
      {
        keywords: ["pagamento", "método", "transferência", "dinheiro", "cartão"],
        response:
          "Aceitamos diversos métodos de pagamento: transferência bancária, PayPal e cartões de crédito/débito. Normalmente solicitamos um adiantamento de 50% para iniciar o trabalho.",
        weight: 2,
      },
      {
        keywords: ["processo", "como funciona", "passos", "procedimento"],
        response:
          "Nosso processo é simples: 1) Obtenha um orçamento com esta calculadora, 2) Entre em contato conosco para discutir detalhes, 3) Criamos um esboço preliminar, 4) Uma vez aprovado, completamos a ilustração, 5) Entregamos o trabalho final nos formatos solicitados.",
        weight: 2,
      },
      {
        keywords: ["formato", "arquivo", "jpg", "png", "psd"],
        response:
          "Entregamos o trabalho em formato digital de alta resolução. Normalmente fornecemos arquivos JPG e PNG. Arquivos editáveis (PSD, AI) estão disponíveis com custo adicional ou incluídos nos pacotes com direitos exclusivos.",
        weight: 2,
      },
      {
        keywords: ["contato", "email", "telefone", "whatsapp", "comunicar"],
        response:
          "Você pode nos contatar através do nosso email: info@exemplo.com ou pelo WhatsApp no +XX XXXX XXXX. Teremos prazer em responder a todas as suas perguntas.",
        weight: 2,
      },
      {
        keywords: ["moeda", "câmbio", "dólar", "euro", "peso"],
        response:
          "Nossa calculadora permite obter orçamentos em diferentes moedas. Os preços base estão em Pesos Mexicanos (MXN), mas você pode selecionar outras moedas como USD, EUR, GBP, entre outras. A conversão é feita automaticamente de acordo com as taxas de câmbio atuais.",
        weight: 2,
      },
      {
        keywords: ["idioma", "língua", "tradução", "traduzir", "mudar idioma"],
        response:
          "Nossa calculadora está disponível em vários idiomas: Espanhol, Inglês, Francês e Português. Você pode mudar o idioma usando o seletor no topo da página.",
        weight: 2,
      },
      {
        keywords: ["obrigado", "grato", "agradeço", "agradecido"],
        response: "De nada! Estou aqui para ajudar. Se tiver mais perguntas, não hesite em consultar-me.",
        weight: 1,
      },
      {
        keywords: ["adeus", "tchau", "até logo", "até mais"],
        response:
          "Até logo! Espero ter sido útil. Volte quando quiser para resolver mais dúvidas sobre nossos serviços de ilustração.",
        weight: 1,
      },
      {
        keywords: ["escuro", "claro", "tema", "modo escuro", "modo claro"],
        response:
          "Você pode alternar entre o modo escuro e claro clicando no botão com o ícone de sol/lua no canto superior esquerdo da página. Sua preferência será salva para visitas futuras.",
        weight: 2,
      },
      {
        keywords: ["imprimir", "resumo", "pdf", "salvar orçamento"],
        response:
          "Depois que seu orçamento for calculado, você pode imprimir um resumo detalhado clicando no botão 'Imprimir Resumo' que aparece ao lado do orçamento estimado. Isso gerará um documento com todas as opções selecionadas e o preço final.",
        weight: 2,
      },
    ],
  }

  // Respuestas por defecto para cada idioma
  const defaultResponses = {
    es: "Lo siento, no tengo información específica sobre eso. ¿Puedes preguntarme sobre nuestros precios, tipos de ilustración, proceso de trabajo o métodos de pago?",
    en: "I'm sorry, I don't have specific information about that. Can you ask me about our prices, illustration types, work process, or payment methods?",
    fr: "Désolé, je n'ai pas d'informations spécifiques à ce sujet. Pouvez-vous me demander sur nos prix, types d'illustration, processus de travail ou méthodes de paiement ?",
    pt: "Desculpe, não tenho informações específicas sobre isso. Você pode me perguntar sobre nossos preços, tipos de ilustração, processo de trabalho ou métodos de pagamento?",
  }

  // Mensajes de bienvenida para cada idioma
  const welcomeMessages = {
    es: "¡Hola! Soy el asistente virtual de la calculadora de presupuestos. Puedo ayudarte a entender cómo funciona nuestra calculadora y responder preguntas sobre nuestros servicios de ilustración. ¿En qué puedo ayudarte hoy?",
    en: "Hello! I'm the virtual assistant for the budget calculator. I can help you understand how our calculator works and answer questions about our illustration services. How can I help you today?",
    fr: "Bonjour ! Je suis l'assistant virtuel du calculateur de budget. Je peux vous aider à comprendre comment fonctionne notre calculateur et répondre à vos questions sur nos services d'illustration. Comment puis-je vous aider aujourd'hui ?",
    pt: "Olá! Sou o assistente virtual da calculadora de orçamentos. Posso ajudá-lo a entender como nossa calculadora funciona e responder perguntas sobre nossos serviços de ilustração. Como posso ajudá-lo hoje?",
  }

  // Sugerencias para cada idioma
  const suggestions = {
    es: [
      "¿Cómo se calculan los precios?",
      "¿Qué tipos de ilustraciones ofrecen?",
      "¿Cuánto cuesta añadir personajes adicionales?",
      "¿Cómo funciona el modo oscuro?",
      "¿Puedo imprimir mi presupuesto?",
    ],
    en: [
      "How are prices calculated?",
      "What types of illustrations do you offer?",
      "How much does it cost to add additional characters?",
      "How does dark mode work?",
      "Can I print my budget?",
    ],
    fr: [
      "Comment les prix sont-ils calculés?",
      "Quels types d'illustrations proposez-vous?",
      "Combien coûte l'ajout de personnages supplémentaires?",
      "Comment fonctionne le mode sombre?",
      "Puis-je imprimer mon budget?",
    ],
    pt: [
      "Como os preços são calculados?",
      "Quais tipos de ilustrações vocês oferecem?",
      "Quanto custa adicionar personagens adicionais?",
      "Como funciona o modo escuro?",
      "Posso imprimir meu orçamento?",
    ],
  }

  // Función para mostrar mensajes en el chat
  function addMessage(message, isUser = false) {
    const messageElement = document.createElement("div")
    messageElement.classList.add("chat-message")
    messageElement.classList.add(isUser ? "user" : "bot")

    const avatar = document.createElement("div")
    avatar.classList.add("chat-avatar")
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'

    const bubble = document.createElement("div")
    bubble.classList.add("chat-bubble")
    bubble.textContent = message

    messageElement.appendChild(avatar)
    messageElement.appendChild(bubble)

    chatbotMessages.appendChild(messageElement)

    // Scroll al último mensaje
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight
  }

  // Función para mostrar sugerencias
  function showSuggestions() {
    const suggestionsContainer = document.createElement("div")
    suggestionsContainer.classList.add("chat-suggestions")

    const currentSuggestions = suggestions[currentLang] || suggestions.es

    currentSuggestions.forEach((suggestion) => {
      const suggestionButton = document.createElement("button")
      suggestionButton.classList.add("suggestion-button")
      suggestionButton.textContent = suggestion

      suggestionButton.addEventListener("click", () => {
        chatbotInput.value = suggestion
        handleSendMessage()
      })

      suggestionsContainer.appendChild(suggestionButton)
    })

    chatbotMessages.appendChild(suggestionsContainer)
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight
  }

  // Función para mostrar indicador de escritura
  function showTypingIndicator() {
    const indicator = document.createElement("div")
    indicator.classList.add("typing-indicator")
    indicator.id = "typing-indicator"

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span")
      indicator.appendChild(dot)
    }

    chatbotMessages.appendChild(indicator)
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight

    return indicator
  }

  // Función para eliminar el indicador de escritura
  function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator")
    if (indicator) {
      indicator.remove()
    }
  }

  // Función para procesar la entrada del usuario y obtener una respuesta
  function processUserInput(userInput) {
    // Verificar si la respuesta está en caché
    const cacheKey = `${currentLang}:${userInput.toLowerCase()}`
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey)
    }

    userInput = userInput.toLowerCase().trim()

    // Crear un mapa para almacenar las puntuaciones de cada respuesta
    const scoreMap = new Map()

    // Verificar coincidencias en la base de conocimientos del idioma actual
    const knowledgeBase = knowledgeBases[currentLang] || knowledgeBases.es

    // Dividir la entrada del usuario en palabras para una mejor coincidencia
    const userWords = userInput.split(/\s+/)

    // Calcular puntuación para cada elemento en la base de conocimientos
    for (const item of knowledgeBase) {
      let score = 0

      // Verificar coincidencias exactas de frases completas
      if (item.keywords.some((keyword) => userInput.includes(keyword))) {
        score += 10 * item.weight
      }

      // Verificar coincidencias de palabras individuales
      for (const word of userWords) {
        if (word.length > 2) {
          // Ignorar palabras muy cortas
          for (const keyword of item.keywords) {
            if (keyword.includes(word) || word.includes(keyword)) {
              score += 2 * item.weight
            }
          }
        }
      }

      if (score > 0) {
        scoreMap.set(item.response, score)
      }
    }

    // Ordenar las respuestas por puntuación
    const sortedResponses = [...scoreMap.entries()].sort((a, b) => b[1] - a[1])

    // Si hay coincidencias, devolver la respuesta con mayor puntuación
    if (sortedResponses.length > 0 && sortedResponses[0][1] >= 5) {
      const response = sortedResponses[0][0]
      // Guardar en caché para futuras consultas similares
      responseCache.set(cacheKey, response)
      return response
    }

    // Si no hay coincidencias suficientes, devolver respuesta por defecto
    return defaultResponses[currentLang] || defaultResponses.es
  }

  // Función para manejar el envío de mensajes
  function handleSendMessage() {
    const userMessage = chatbotInput.value.trim()

    if (userMessage === "") return

    // Mostrar mensaje del usuario
    addMessage(userMessage, true)

    // Limpiar input
    chatbotInput.value = ""

    // Mostrar indicador de escritura
    const typingIndicator = showTypingIndicator()

    // Simular tiempo de respuesta (entre 0.5 y 1.5 segundos)
    setTimeout(
      () => {
        // Eliminar indicador de escritura
        removeTypingIndicator()

        // Procesar entrada y mostrar respuesta
        const botResponse = processUserInput(userMessage)
        addMessage(botResponse)

        // Mostrar sugerencias después de la respuesta (con una pequeña probabilidad)
        if (Math.random() < 0.3) {
          setTimeout(() => {
            showSuggestions()
          }, 500)
        }
      },
      Math.random() * 1000 + 500,
    )
  }

  // Event listeners
  chatbotToggle.addEventListener("click", () => {
    chatbotBox.classList.toggle("active")
    chatbotNotification.style.display = "none"

    // Si es la primera vez que se abre, mostrar mensaje de bienvenida
    if (chatbotMessages.children.length === 0) {
      setTimeout(() => {
        addMessage(welcomeMessages[currentLang] || welcomeMessages.es)

        // Mostrar sugerencias después del mensaje de bienvenida
        setTimeout(() => {
          showSuggestions()
        }, 500)
      }, 500)
    }
  })

  chatbotClose.addEventListener("click", () => {
    chatbotBox.classList.remove("active")
  })

  chatbotSend.addEventListener("click", handleSendMessage)

  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  })

  // Traducciones para el chatbot
  const translations = {
    es: {
      chatbot_placeholder: "Escribe tu pregunta aquí...",
    },
    en: {
      chatbot_placeholder: "Type your question here...",
    },
    fr: {
      chatbot_placeholder: "Écrivez votre question ici...",
    },
    pt: {
      chatbot_placeholder: "Digite sua pergunta aqui...",
    },
  }

  // Función para actualizar el idioma del chatbot
  function updateChatbotLanguage(lang) {
    currentLang = lang

    // Actualizar placeholder del input
    if (translations[lang] && translations[lang].chatbot_placeholder) {
      chatbotInput.placeholder = translations[lang].chatbot_placeholder
    }

    // Limpiar caché al cambiar de idioma
    responseCache.clear()
  }

  // Escuchar cambios de idioma
  document.addEventListener("languageChanged", (e) => {
    updateChatbotLanguage(e.detail.lang)
  })

  // Opcional: Mostrar notificación después de un tiempo para llamar la atención
  setTimeout(() => {
    if (!chatbotBox.classList.contains("active")) {
      chatbotNotification.style.display = "flex"
    }
  }, 3000)
})

