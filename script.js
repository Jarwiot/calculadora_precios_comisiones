document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const quoteForm = document.getElementById("quoteForm")
  const resultContainer = document.getElementById("result-container")
  const resultDiv = document.getElementById("result")
  const recalculateBtn = document.getElementById("recalculate-btn")
  const printBtn = document.getElementById("print-btn")
  const printContainer = document.getElementById("print-container")
  const backgroundToggle = document.getElementById("background-toggle")
  const backgroundText = document.getElementById("background-text")
  const backgroundInput = document.getElementById("background")
  const urgencyToggle = document.getElementById("urgency-toggle")
  const urgencyText = document.getElementById("urgency-text")
  const urgencyInput = document.getElementById("urgency")
  const currencySelect = document.getElementById("currency")
  const currencyLabel = document.getElementById("currency-label")
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const loginBtn = document.getElementById("login-btn")
  const historyBtn = document.getElementById("history-btn")

  // Elementos del selector de idiomas
  const currentLanguage = document.getElementById("current-language")
  const languageDropdown = document.getElementById("language-dropdown")
  const languageOptions = document.querySelectorAll(".language-option")

  // Tasas de conversión (fijas para este ejemplo)
  const exchangeRates = {
    MXN: 1,
    USD: 0.059,
    EUR: 0.054,
    GBP: 0.046,
    CAD: 0.08,
    ARS: 21.5,
    CLP: 53.2,
    COP: 236.5,
  }

  // Símbolos de moneda (opcional, para visualización)
  const currencySymbols = {
    MXN: "$",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    ARS: "AR$",
    CLP: "CL$",
    COP: "COL$",
  }

  // Idioma actual (por defecto: español)
  let currentLang = "es"

  // Variables para almacenar los datos del presupuesto
  let budgetData = {
    basePrice: 0,
    type: "",
    detail: "",
    characters: 1,
    background: "",
    rights: "",
    urgency: false,
    currency: "MXN",
    totalPrice: 0,
    formattedPrice: "",
  }

  // Definición de traducciones para diferentes idiomas
  const translations = {
    // Español (idioma por defecto)
    es: {
      // Títulos y subtítulos
      title: "Calculadora de Presupuesto",
      subtitle: "Dibujos y Arte Digital",

      // Secciones
      basic_info: "Información Básica",
      project_details: "Detalles del Proyecto",
      terms_conditions: "Términos y Condiciones",

      // Campos de formulario
      base_price_label: "Precio Base",
      base_price_placeholder: "Automático si se deja vacío",
      base_price_help: "Deja vacío para calcular automáticamente según el tipo de ilustración",

      currency_label: "Divisa",
      currency_help: "Los precios base están en MXN y se convertirán a la divisa seleccionada",

      // Divisas
      currency_mxn: "Peso Mexicano (MXN)",
      currency_usd: "Dólar Estadounidense (USD)",
      currency_eur: "Euro (EUR)",
      currency_gbp: "Libra Esterlina (GBP)",
      currency_cad: "Dólar Canadiense (CAD)",
      currency_ars: "Peso Argentino (ARS)",
      currency_clp: "Peso Chileno (CLP)",
      currency_cop: "Peso Colombiano (COP)",

      // Tipos de ilustración
      illustration_type_label: "Tipo de Ilustración",
      illustration_portrait: "Retrato",
      illustration_character: "Diseño de personaje",
      illustration_background: "Fondo",
      illustration_concept: "Concept Art",

      // Nivel de detalle
      detail_level_label: "Nivel de Detalle",
      detail_simple: "Boceto",
      detail_medium: "color basico",
      detail_complex: "sombreado completo",

      // Personajes
      characters_label: "Número de Personajes",

      // Fondo
      background_type_label: "Tipo de Fondo",
      background_simple: "Simple",
      background_detailed: "Detallado",

      // Derechos
      rights_label: "Derechos de Uso",
      rights_personal: "Uso Personal",
      rights_none: "Sin Derechos (10% descuento)",
      rights_commercial: "Uso Comercial",
      rights_exclusive: "Derechos Exclusivos",

      // Urgencia
      urgency_label: "Entrega Rápida",
      yes: "Sí",
      no: "No",

      // Botones
      calculate_button: "Calcular Presupuesto",
      recalculate_button: "Recalcular",
      print_button: "Imprimir Resumen",
      login_button: "Iniciar Sesión",
      history_button: "Historial",

      // Resultado
      estimated_budget: "Presupuesto Estimado",
      result_note: "Este presupuesto es una estimación basada en los parámetros seleccionados.",

      // Footer
      footer_text: "Calculadora de Presupuestos para Arte Digital",
      footer_twitter: "Twitter",
      footer_facebook: "Facebook",
      footer_contact: "Contacto",

      // Chatbot
      virtual_assistant: "Asistente Virtual",
      chatbot_placeholder: "Escribe tu pregunta aquí...",

      // Tema
      dark_mode: "Modo Oscuro",
      light_mode: "Modo Claro",

      // Impresión
      print_title: "Resumen de Presupuesto",
      print_subtitle: "Detalles del presupuesto estimado",
      print_date: "Fecha",
      print_basic_info: "Información Básica",
      print_project_details: "Detalles del Proyecto",
      print_terms: "Términos y Condiciones",
      print_total: "Total Estimado",
      print_footer: "Este presupuesto es válido por 30 días a partir de la fecha de emisión.",
      print_characters: "Personajes",
      print_background_type: "Tipo de Fondo",
      print_rights_type: "Derechos de Uso",
      print_urgency_option: "Entrega Rápida",

      // Autenticación
      account_access: "Acceso a la cuenta",
      login: "Iniciar Sesión",
      register: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      confirm_password: "Confirmar contraseña",
      remember_me: "Recordarme",
      forgot_password: "¿Olvidaste tu contraseña?",
      name: "Nombre",
      accept_terms: "Acepto los términos y condiciones",
      register_button: "Registrarse",
      profile: "Perfil",
      my_commissions: "Mis Comisiones",
      logout: "Cerrar Sesión",
      view_profile: "Ver Perfil",
    },

    // Inglés
    en: {
      // Títulos y subtítulos
      title: "Budget Calculator",
      subtitle: "Digital Drawings and Art",

      // Secciones
      basic_info: "Basic Information",
      project_details: "Project Details",
      terms_conditions: "Terms and Conditions",

      // Campos de formulario
      base_price_label: "Base Price",
      base_price_placeholder: "Automatic if left empty",
      base_price_help: "Leave empty to calculate automatically based on illustration type",

      currency_label: "Currency",
      currency_help: "Base prices are in MXN and will be converted to the selected currency",

      // Divisas
      currency_mxn: "Mexican Peso (MXN)",
      currency_usd: "US Dollar (USD)",
      currency_eur: "Euro (EUR)",
      currency_gbp: "British Pound (GBP)",
      currency_cad: "Canadian Dollar (CAD)",
      currency_ars: "Argentine Peso (ARS)",
      currency_clp: "Chilean Peso (CLP)",
      currency_cop: "Colombian Peso (COP)",

      // Tipos de ilustración
      illustration_type_label: "Illustration Type",
      illustration_portrait: "Portrait",
      illustration_character: "Character design",
      illustration_background: "Background",
      illustration_concept: "Concept Art",

      // Nivel de detalle
      detail_level_label: "Detail Level",
      detail_simple: "sketch",
      detail_medium: "Flat Colors",
      detail_complex: "Full shade",

      // Personajes
      characters_label: "Number of Characters",

      // Fondo
      background_type_label: "Background Type",
      background_simple: "Simple",
      background_detailed: "Detailed",

      // Derechos
      rights_label: "Usage Rights",
      rights_personal: "Personal Use",
      rights_none: "No Rights (10% discount)",
      rights_commercial: "Commercial Use",
      rights_exclusive: "Exclusive Rights",

      // Urgencia
      urgency_label: "Fast Delivery",
      yes: "Yes",
      no: "No",

      // Botones
      calculate_button: "Calculate Budget",
      recalculate_button: "Recalculate",
      print_button: "Print Summary",
      login_button: "Log In",
      history_button: "History",

      // Resultado
      estimated_budget: "Estimated Budget",
      result_note: "This budget is an estimate based on the selected parameters.",

      // Footer
      footer_text: "Digital Art Budget Calculator",
      footer_twitter: "Twitter",
      footer_facebook: "Facebook",
      footer_contact: "Contact",

      // Chatbot
      virtual_assistant: "Virtual Assistant",
      chatbot_placeholder: "Type your question here...",

      // Tema
      dark_mode: "Dark Mode",
      light_mode: "Light Mode",

      // Impresión
      print_title: "Budget Summary",
      print_subtitle: "Estimated budget details",
      print_date: "Date",
      print_basic_info: "Basic Information",
      print_project_details: "Project Details",
      print_terms: "Terms and Conditions",
      print_total: "Estimated Total",
      print_footer: "This budget is valid for 30 days from the issue date.",
      print_characters: "Characters",
      print_background_type: "Background Type",
      print_rights_type: "Usage Rights",
      print_urgency_option: "Fast Delivery",

      // Autenticación
      account_access: "Account Access",
      login: "Log In",
      register: "Register",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm password",
      remember_me: "Remember me",
      forgot_password: "Forgot your password?",
      name: "Name",
      accept_terms: "I accept the terms and conditions",
      register_button: "Register",
      profile: "Profile",
      my_commissions: "My Commissions",
      logout: "Log Out",
      view_profile: "View Profile",
    },

    // Francés
    fr: {
      // Títulos y subtítulos
      title: "Calculateur de Budget",
      subtitle: "Dessins et Art Numérique",

      // Secciones
      basic_info: "Informations de Base",
      project_details: "Détails du Projet",
      terms_conditions: "Termes et Conditions",

      // Campos de formulario
      base_price_label: "Prix de Base",
      base_price_placeholder: "Automatique si laissé vide",
      base_price_help: "Laissez vide pour calculer automatiquement selon le type d'illustration",

      currency_label: "Devise",
      currency_help: "Les prix de base sont en MXN et seront convertis dans la devise sélectionnée",

      // Divisas
      currency_mxn: "Peso Mexicain (MXN)",
      currency_usd: "Dollar Américain (USD)",
      currency_eur: "Euro (EUR)",
      currency_gbp: "Livre Sterling (GBP)",
      currency_cad: "Dollar Canadien (CAD)",
      currency_ars: "Peso Argentin (ARS)",
      currency_clp: "Peso Chilien (CLP)",
      currency_cop: "Peso Colombien (COP)",

      // Tipos de ilustración
      illustration_type_label: "Type d'Illustration",
      illustration_portrait: "Portrait",
      illustration_character: "Conception de personnages",
      illustration_background: "Arrière-plan",
      illustration_concept: "Art Conceptuel",

      // Nivel de detalle
      detail_level_label: "Niveau de Détail",
      detail_simple: "esquisser",
      detail_medium: "couleur plate",
      detail_complex: "ombre complète",

      // Personajes
      characters_label: "Nombre de Personnages",

      // Fondo
      background_type_label: "Type d'Arrière-plan",
      background_simple: "Simple",
      background_detailed: "Détaillé",

      // Derechos
      rights_label: "Droits d'Utilisation",
      rights_personal: "Usage Personnel",
      rights_none: "Sans Droits (10% de réduction)",
      rights_commercial: "Usage Commercial",
      rights_exclusive: "Droits Exclusifs",

      // Urgencia
      urgency_label: "Livraison Rapide",
      yes: "Oui",
      no: "Non",

      // Botones
      calculate_button: "Calculer le Budget",
      recalculate_button: "Recalculer",
      print_button: "Imprimer Résumé",
      login_button: "Se Connecter",
      history_button: "Historique",

      // Resultado
      estimated_budget: "Budget Estimé",
      result_note: "Ce budget est une estimation basée sur les paramètres sélectionnés.",

      // Footer
      footer_text: "Calculateur de Budget pour Art Numérique",
      footer_twitter: "Twitter",
      footer_facebook: "Facebook",
      footer_contact: "Contact",

      // Chatbot
      virtual_assistant: "Assistant Virtuel",
      chatbot_placeholder: "Écrivez votre question ici...",

      // Tema
      dark_mode: "Mode Sombre",
      light_mode: "Mode Clair",

      // Impresión
      print_title: "Résumé du Budget",
      print_subtitle: "Détails du budget estimé",
      print_date: "Date",
      print_basic_info: "Informations de Base",
      print_project_details: "Détails du Projet",
      print_terms: "Termes et Conditions",
      print_total: "Total Estimé",
      print_footer: "Ce budget est valable pendant 30 jours à compter de la date d'émission.",
      print_characters: "Personnages",
      print_background_type: "Type d'Arrière-plan",
      print_rights_type: "Droits d'Utilisation",
      print_urgency_option: "Livraison Rapide",

      // Autenticación
      account_access: "Accès au Compte",
      login: "Se Connecter",
      register: "S'inscrire",
      email: "Email",
      password: "Mot de passe",
      confirm_password: "Confirmer le mot de passe",
      remember_me: "Se souvenir de moi",
      forgot_password: "Mot de passe oublié?",
      name: "Nom",
      accept_terms: "J'accepte les termes et conditions",
      register_button: "S'inscrire",
      profile: "Profil",
      my_commissions: "Mes Commissions",
      logout: "Déconnexion",
      view_profile: "Voir le Profil",
    },

    // Portugués
    pt: {
      // Títulos y subtítulos
      title: "Calculadora de Orçamento",
      subtitle: "Desenhos e Arte Digital",

      // Secciones
      basic_info: "Informações Básicas",
      project_details: "Detalhes do Projeto",
      terms_conditions: "Termos e Condições",

      // Campos de formulario
      base_price_label: "Preço Base",
      base_price_placeholder: "Automático se deixado vazio",
      base_price_help: "Deixe vazio para calcular automaticamente com base no tipo de ilustração",

      currency_label: "Moeda",
      currency_help: "Os preços base estão em MXN e serão convertidos para a moeda selecionada",

      // Divisas
      currency_mxn: "Peso Mexicano (MXN)",
      currency_usd: "Dólar Americano (USD)",
      currency_eur: "Euro (EUR)",
      currency_gbp: "Libra Esterlina (GBP)",
      currency_cad: "Dólar Canadense (CAD)",
      currency_ars: "Peso Argentino (ARS)",
      currency_clp: "Peso Chileno (CLP)",
      currency_cop: "Peso Colombiano (COP)",

      // Tipos de ilustración
      illustration_type_label: "Tipo de Ilustração",
      illustration_portrait: "Retrato",
      illustration_character: "Design de personagens",
      illustration_background: "Fundo",
      illustration_concept: "Arte Conceitual",

      // Nivel de detalle
      detail_level_label: "Nível de Detalhe",
      detail_simple: "esboço",
      detail_medium: "cor básica",
      detail_complex: "sombreamento completo",

      // Personajes
      characters_label: "Número de Personagens",

      // Fondo
      background_type_label: "Tipo de Fundo",
      background_simple: "Simples",
      background_detailed: "Detalhado",

      // Derechos
      rights_label: "Direitos de Uso",
      rights_personal: "Uso Pessoal",
      rights_none: "Sem Direitos (10% de desconto)",
      rights_commercial: "Uso Comercial",
      rights_exclusive: "Direitos Exclusivos",

      // Urgencia
      urgency_label: "Entrega Rápida",
      yes: "Sim",
      no: "Não",

      // Botones
      calculate_button: "Calcular Orçamento",
      recalculate_button: "Recalcular",
      print_button: "Imprimir Resumo",
      login_button: "Iniciar Sessão",
      history_button: "Histórico",

      // Resultado
      estimated_budget: "Orçamento Estimado",
      result_note: "Este orçamento é uma estimativa baseada nos parâmetros selecionados.",

      // Footer
      footer_text: "Calculadora de Orçamentos para Arte Digital",
      footer_twitter: "Twitter",
      footer_facebook: "Facebook",
      footer_contact: "Contato",

      // Chatbot
      virtual_assistant: "Assistente Virtual",
      chatbot_placeholder: "Digite sua pergunta aqui...",

      // Tema
      dark_mode: "Modo Escuro",
      light_mode: "Modo Claro",

      // Impresión
      print_title: "Resumo do Orçamento",
      print_subtitle: "Detalhes do orçamento estimado",
      print_date: "Data",
      print_basic_info: "Informações Básicas",
      print_project_details: "Detalhes do Projeto",
      print_terms: "Termos e Condições",
      print_total: "Total Estimado",
      print_footer: "Este orçamento é válido por 30 dias a partir da data de emissão.",
      print_characters: "Personagens",
      print_background_type: "Tipo de Fundo",
      print_rights_type: "Direitos de Uso",
      print_urgency_option: "Entrega Rápida",

      // Autenticação
      account_access: "Acesso à Conta",
      login: "Entrar",
      register: "Registrar",
      email: "Email",
      password: "Senha",
      confirm_password: "Confirmar senha",
      remember_me: "Lembrar de mim",
      forgot_password: "Esqueceu sua senha?",
      name: "Nome",
      accept_terms: "Eu aceito os termos e condições",
      register_button: "Registrar",
      profile: "Perfil",
      my_commissions: "Minhas Comissões",
      logout: "Sair",
      view_profile: "Ver Perfil",
    },
  }

  // Función para cambiar el tema
  function toggleTheme() {
    const isDarkMode = document.body.getAttribute("data-theme") === "dark"

    if (isDarkMode) {
      document.body.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'
      themeToggleBtn.setAttribute("aria-label", translations[currentLang].dark_mode)
    } else {
      document.body.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'
      themeToggleBtn.setAttribute("aria-label", translations[currentLang].light_mode)
    }
  }

  // Inicializar el tema según la preferencia guardada
  function initTheme() {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark")
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'
      themeToggleBtn.setAttribute("aria-label", translations[currentLang].light_mode)
    } else {
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'
      themeToggleBtn.setAttribute("aria-label", translations[currentLang].dark_mode)
    }
  }

  // Función para cambiar el idioma
  function changeLanguage(lang) {
    currentLang = lang

    // Actualizar todos los elementos con atributo data-translate
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate")
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key]
      }
    })

    // Actualizar placeholders
    document.querySelectorAll("[data-translate-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-translate-placeholder")
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key]
      }
    })

    // Actualizar el texto del toggle de fondo
    if (backgroundInput.value === "simple") {
      backgroundText.textContent = translations[lang].background_simple
    } else {
      backgroundText.textContent = translations[lang].background_detailed
    }

    // Actualizar el texto del toggle de urgencia
    if (urgencyInput.value === "false") {
      urgencyText.textContent = translations[lang].no
    } else {
      urgencyText.textContent = translations[lang].yes
    }

    // Actualizar el texto del selector de idioma actual
    const langNames = {
      es: "Español",
      en: "English",
      fr: "Français",
      pt: "Português",
    }

    const flagCodes = {
      es: "es",
      en: "gb",
      fr: "fr",
      pt: "br",
    }

    currentLanguage.innerHTML = `
      <img src="https://flagcdn.com/w20/${flagCodes[lang]}.png" alt="${langNames[lang]}" class="flag-icon" />
      <span>${langNames[lang]}</span>
      <i class="fas fa-chevron-down"></i>
    `

    // Actualizar el texto del botón de tema
    const isDarkMode = document.body.getAttribute("data-theme") === "dark"
    if (isDarkMode) {
      themeToggleBtn.setAttribute("aria-label", translations[lang].light_mode)
    } else {
      themeToggleBtn.setAttribute("aria-label", translations[lang].dark_mode)
    }

    // Cerrar el dropdown después de seleccionar
    languageDropdown.classList.remove("show")

    // Disparar un evento personalizado para notificar al chatbot del cambio de idioma
    const event = new CustomEvent("languageChanged", { detail: { lang } })
    document.dispatchEvent(event)
  }

  // Actualizar la etiqueta de la divisa cuando cambie la selección
  currencySelect.addEventListener("change", function () {
    currencyLabel.textContent = this.value
  })

  // Configurar los toggles
  backgroundToggle.addEventListener("change", function () {
    if (this.checked) {
      backgroundText.textContent = translations[currentLang].background_detailed
      backgroundInput.value = "detallado"
    } else {
      backgroundText.textContent = translations[currentLang].background_simple
      backgroundInput.value = "simple"
    }
  })

  urgencyToggle.addEventListener("change", function () {
    if (this.checked) {
      urgencyText.textContent = translations[currentLang].yes
      urgencyInput.value = "true"
    } else {
      urgencyText.textContent = translations[currentLang].no
      urgencyInput.value = "false"
    }
  })

  // Función para obtener el texto traducido según el tipo de ilustración
  function getIllustrationType(type) {
    switch (type) {
      case "retrato":
        return translations[currentLang].illustration_portrait
      case "personaje":
        return translations[currentLang].illustration_character
      case "fondo":
        return translations[currentLang].illustration_background
      case "concept_art":
        return translations[currentLang].illustration_concept
      default:
        return type
    }
  }

  // Función para obtener el texto traducido según el nivel de detalle
  function getDetailLevel(detail) {
    switch (detail) {
      case "simple":
        return translations[currentLang].detail_simple
      case "medio":
        return translations[currentLang].detail_medium
      case "complejo":
        return translations[currentLang].detail_complex
      default:
        return detail
    }
  }

  // Función para obtener el texto traducido según el tipo de fondo
  function getBackgroundType(background) {
    return background === "simple"
      ? translations[currentLang].background_simple
      : translations[currentLang].background_detailed
  }

  // Función para obtener el texto traducido según los derechos de uso
  function getRightsType(rights) {
    switch (rights) {
      case "true":
        return translations[currentLang].rights_personal
      case "false":
        return translations[currentLang].rights_none
      case "comercial":
        return translations[currentLang].rights_commercial
      case "exclusivo":
        return translations[currentLang].rights_exclusive
      default:
        return rights
    }
  }

  // Función para generar el contenido de impresión
  function generatePrintContent() {
    const today = new Date()
    const formattedDate = today.toLocaleDateString()

    // Obtener los valores traducidos
    const illustrationType = getIllustrationType(budgetData.type)
    const detailLevel = getDetailLevel(budgetData.detail)
    const backgroundType = getBackgroundType(budgetData.background)
    const rightsType = getRightsType(budgetData.rights)
    const urgencyValue = budgetData.urgency ? translations[currentLang].yes : translations[currentLang].no

    // Crear el contenido HTML para imprimir
    const printHTML = `
      <div class="print-header">
        <h1>${translations[currentLang].print_title}</h1>
        <p>${translations[currentLang].print_subtitle}</p>
        <p>${translations[currentLang].print_date}: ${formattedDate}</p>
      </div>
      
      <div class="print-section">
        <h2>${translations[currentLang].print_basic_info}</h2>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].illustration_type_label}:</span>
          <span>${illustrationType}</span>
        </div>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].currency_label}:</span>
          <span>${budgetData.currency}</span>
        </div>
      </div>
      
      <div class="print-section">
        <h2>${translations[currentLang].print_project_details}</h2>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].detail_level_label}:</span>
          <span>${detailLevel}</span>
        </div>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].print_characters}:</span>
          <span>${budgetData.characters}</span>
        </div>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].print_background_type}:</span>
          <span>${backgroundType}</span>
        </div>
      </div>
      
      <div class="print-section">
        <h2>${translations[currentLang].print_terms}</h2>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].print_rights_type}:</span>
          <span>${rightsType}</span>
        </div>
        <div class="print-item">
          <span class="print-item-label">${translations[currentLang].print_urgency_option}:</span>
          <span>${urgencyValue}</span>
        </div>
      </div>
      
      <div class="print-total">
        <span>${translations[currentLang].print_total}:</span>
        <span>${budgetData.formattedPrice}</span>
      </div>
      
      <div class="print-footer">
        <p>${translations[currentLang].print_footer}</p>
      </div>
    `

    return printHTML
  }

  // Función para imprimir el resumen
  function printSummary() {
    // Generar el contenido para imprimir
    const printContent = generatePrintContent()

    // Insertar el contenido en el contenedor de impresión
    printContainer.innerHTML = printContent

    // Imprimir
    window.print()
  }

  // Manejar el envío del formulario
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault()

    // Obtener valores del formulario
    const basePriceInput = document.getElementById("basePrice").value
    const type = document.getElementById("type").value
    const currency = document.getElementById("currency").value

    // Obtener el valor del radio button seleccionado
    const detailRadios = document.querySelectorAll('input[name="detail"]')
    let detail
    for (const radio of detailRadios) {
      if (radio.checked) {
        detail = radio.value
        break
      }
    }

    const characters = Number.parseInt(document.getElementById("characters").value)
    const background = backgroundInput.value
    const rights = document.getElementById("rights").value
    const urgency = urgencyInput.value === "true"

    // Si el usuario no ingresa un precio base, calcularlo automáticamente
    let basePrice = Number.parseFloat(basePriceInput) || 0

    if (basePrice === 0) {
      // Calcular precio base automáticamente
      if (type === "retrato") basePrice = 500
      if (type === "personaje") basePrice = 800
      if (type === "fondo") basePrice = 600
      if (type === "concept_art") basePrice = 1000
    }

    // Ajustar por detalle
    if (detail === "medio") basePrice *= 1.5
    if (detail === "complejo") basePrice *= 2

    // Ajustar por número de personajes
    basePrice += (characters - 1) * 200

    // Ajustar por fondo
    if (background === "detallado") basePrice += 300

    // Ajustar por derechos de uso
    if (rights === "false") {
      basePrice *= 0.9 // 10% de descuento
    } else if (rights === "comercial") {
      basePrice *= 1.2
    } else if (rights === "exclusivo") {
      basePrice *= 1.5
    }

    // Ajustar por urgencia
    if (urgency) basePrice *= 1.3

    // Convertir a la divisa seleccionada
    const convertedPrice = basePrice * exchangeRates[currency]

    // Formatear el precio con separadores de miles y código ISO de la divisa
    const formattedPrice = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(convertedPrice)

    // Guardar los datos del presupuesto
    budgetData = {
      basePrice: basePrice,
      type: type,
      detail: detail,
      characters: characters,
      background: background,
      rights: rights,
      urgency: urgency,
      currency: currency,
      totalPrice: convertedPrice,
      formattedPrice: formattedPrice,
    }

    // Mostrar resultado con animación
    resultDiv.innerHTML = `${formattedPrice} <span class="currency-code">${currency}</span>`
    quoteForm.style.display = "none"
    resultContainer.classList.remove("hidden")

    // Scroll al resultado
    resultContainer.scrollIntoView({ behavior: "smooth" })
  })

  // Botón para recalcular
  recalculateBtn.addEventListener("click", () => {
    resultContainer.classList.add("hidden")
    quoteForm.style.display = "block"
  })

  // Botón para imprimir resumen
  printBtn.addEventListener("click", printSummary)

  // Prevenir que los botones de incremento/decremento envíen el formulario
  document.querySelectorAll(".number-input button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
    })
  })

  // Eventos para el selector de idiomas
  currentLanguage.addEventListener("click", () => {
    languageDropdown.classList.toggle("show")
  })

  // Cerrar el dropdown si se hace clic fuera de él
  document.addEventListener("click", (e) => {
    if (!currentLanguage.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageDropdown.classList.remove("show")
    }
  })

  // Manejar la selección de idioma
  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.getAttribute("data-lang")
      changeLanguage(lang)
    })
  })

  // Evento para cambiar el tema
  themeToggleBtn.addEventListener("click", toggleTheme)

  // Eventos para los botones de usuario
  // Eliminar completamente el manejador de eventos para el botón de login
  // Reemplazar estas líneas:
  // Con este comentario:
  // El evento click para loginBtn se maneja en auth.js

  historyBtn.addEventListener("click", (e) => {
    e.preventDefault()
    alert(translations[currentLang].history_button)
    // Aquí iría la lógica para mostrar el historial de comisiones
  })

  // Inicializar el tema
  initTheme()

  // Inicializar la página con el idioma por defecto
  changeLanguage("es")

  // Añadir al final del evento DOMContentLoaded
  // Sidebar y overlay
  const sidebar = document.getElementById("sidebar")
  const closeSidebar = document.getElementById("close-sidebar")
  const logoutLink = document.getElementById("logout-link")
  const overlay = document.getElementById("overlay")

  // El menú hamburguesa ha sido eliminado

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
  })

  // Si el usuario hace clic en el overlay, cerrar sidebar y modales
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active")
    // Si hay algún modal abierto, cerrarlo también
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach((modal) => {
      modal.classList.remove("active")
    })
    overlay.classList.remove("active")
  })

  // Cerrar sesión desde el menú lateral
  let logout // Declare logout here
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()
      // Verificar si la función logout está disponible (desde auth.js)
      if (typeof window.logout === "function") {
        window.logout()
      }
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
    })
  }
})

