document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const loginBtn = document.getElementById("login-btn")
  const loginModal = document.getElementById("login-modal")
  const closeLoginModal = document.getElementById("close-login-modal")
  const overlay = document.getElementById("overlay")
  const loginTab = document.getElementById("login-tab")
  const registerTab = document.getElementById("register-tab")
  const loginContent = document.getElementById("login-content")
  const registerContent = document.getElementById("register-content")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  // Estado de la sesión
  let isLoggedIn = false
  let currentUser = null

  // Comprobar si hay una sesión activa al cargar la página
  function checkSession() {
    const session = localStorage.getItem("userSession")
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        if (sessionData && sessionData.isLoggedIn && sessionData.user) {
          isLoggedIn = true
          currentUser = sessionData.user
          console.log("Sesión encontrada:", currentUser)

          // Asegurarse de que el DOM esté completamente cargado antes de actualizar la UI
          setTimeout(() => {
            updateUIForLoggedInUser()
            setupUserMenuEvents()
          }, 0)

          return true
        }
      } catch (error) {
        console.error("Error parsing session data:", error)
        localStorage.removeItem("userSession")
      }
    }
    return false
  }

  // Actualizar la interfaz para un usuario que ha iniciado sesión
  function updateUIForLoggedInUser() {
    if (!currentUser) return

    // Actualizar el botón de login con el nombre del usuario
    const loginBtn = document.getElementById("login-btn")
    if (loginBtn) {
      loginBtn.innerHTML = `
        <i class="fas fa-user-check"></i>
        <span>${currentUser.name}</span>
      `
      loginBtn.classList.add("logged-in")
    }

    // Actualizar el menú lateral con opciones de usuario
    const userMenuItems = document.querySelectorAll(".user-menu-item")
    userMenuItems.forEach((item) => {
      item.style.display = "flex"
    })
  }

  // Configurar eventos para el menú de usuario
  function setupUserMenuEvents() {
    const loginBtn = document.getElementById("login-btn")

    if (loginBtn) {
      // Eliminar cualquier manejador de eventos existente
      const newLoginBtn = loginBtn.cloneNode(true)
      loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn)

      // Añadir el nuevo manejador de eventos
      newLoginBtn.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("Login button clicked, isLoggedIn:", isLoggedIn)

        if (isLoggedIn) {
          // Si ya ha iniciado sesión, mostrar menú de usuario
          showUserMenu(newLoginBtn)
        } else {
          openModal()
        }
      })
    }
  }

  // Mostrar el menú de usuario
  function showUserMenu(buttonElement) {
    // Eliminar cualquier menú existente
    const existingMenu = document.querySelector(".user-dropdown")
    if (existingMenu) {
      existingMenu.remove()
    }

    // Crear el menú de usuario
    const userMenu = document.createElement("div")
    userMenu.className = "user-dropdown"
    userMenu.innerHTML = `
      <div class="user-dropdown-item view-profile">
        <i class="fas fa-id-card"></i>
        <span data-translate="view_profile">Ver Perfil</span>
      </div>
      <div class="user-dropdown-item my-commissions">
        <i class="fas fa-palette"></i>
        <span data-translate="my_commissions">Mis Comisiones</span>
      </div>
      <div class="user-dropdown-item logout">
        <i class="fas fa-sign-out-alt"></i>
        <span data-translate="logout">Cerrar Sesión</span>
      </div>
    `

    // Posicionar el menú
    const rect = buttonElement.getBoundingClientRect()
    userMenu.style.position = "fixed"
    userMenu.style.top = `${rect.bottom}px`
    userMenu.style.left = `${rect.left}px`
    userMenu.style.zIndex = "1100"

    // Añadir al DOM
    document.body.appendChild(userMenu)

    // Manejar clics en opciones
    const logoutOption = userMenu.querySelector(".logout")
    if (logoutOption) {
      logoutOption.addEventListener("click", () => {
        logout()
        userMenu.remove()
      })
    }

    const profileOption = userMenu.querySelector(".view-profile")
    if (profileOption) {
      profileOption.addEventListener("click", () => {
        alert("Función de perfil en desarrollo")
        userMenu.remove()
      })
    }

    const commissionsOption = userMenu.querySelector(".my-commissions")
    if (commissionsOption) {
      commissionsOption.addEventListener("click", () => {
        alert("Función de comisiones en desarrollo")
        userMenu.remove()
      })
    }

    // Cerrar al hacer clic fuera
    const handleOutsideClick = (event) => {
      if (!userMenu.contains(event.target) && !buttonElement.contains(event.target)) {
        userMenu.remove()
        document.removeEventListener("click", handleOutsideClick)
      }
    }

    // Retrasar para evitar que se cierre inmediatamente
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick)
    }, 10)
  }

  // Actualizar la interfaz para un usuario que ha cerrado sesión
  function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById("login-btn")
    if (loginBtn) {
      loginBtn.innerHTML = `
        <i class="fas fa-user"></i>
        <span data-translate="login_button">Iniciar Sesión</span>
      `
      loginBtn.classList.remove("logged-in")
    }

    // Ocultar opciones de usuario en el menú lateral
    const userMenuItems = document.querySelectorAll(".user-menu-item")
    userMenuItems.forEach((item) => {
      item.style.display = "none"
    })

    // Actualizar los eventos del botón de login
    setupUserMenuEvents()
  }

  // Iniciar sesión
  function login(email, password) {
    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Buscar usuario por email
    const user = users.find((u) => u.email === email)

    // Verificar credenciales
    if (user && user.password === password) {
      isLoggedIn = true
      currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      }

      // Guardar sesión en localStorage
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          isLoggedIn: true,
          user: currentUser,
        }),
      )

      // Actualizar la UI
      updateUIForLoggedInUser()
      setupUserMenuEvents()
      closeModal()

      // Mostrar mensaje de bienvenida
      showNotification(`¡Bienvenido/a, ${user.name}!`, "success")

      return true
    } else {
      showNotification("Email o contraseña incorrectos", "error")
      return false
    }
  }

  // Registrar nuevo usuario
  function register(name, email, password) {
    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Verificar si el email ya está registrado
    if (users.some((u) => u.email === email)) {
      showNotification("Este email ya está registrado", "error")
      return false
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    // Añadir usuario a la lista
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Iniciar sesión automáticamente
    isLoggedIn = true
    currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    // Guardar sesión en localStorage
    localStorage.setItem(
      "userSession",
      JSON.stringify({
        isLoggedIn: true,
        user: currentUser,
      }),
    )

    updateUIForLoggedInUser()
    setupUserMenuEvents()
    closeModal()

    // Mostrar mensaje de bienvenida
    showNotification(`¡Cuenta creada con éxito! Bienvenido/a, ${newUser.name}`, "success")

    return true
  }

  // Cerrar sesión
  function logout() {
    isLoggedIn = false
    currentUser = null
    localStorage.removeItem("userSession")
    updateUIForLoggedOutUser()
    showNotification("Has cerrado sesión correctamente", "info")
  }

  // Hacer que la función logout esté disponible globalmente
  window.logout = logout
  window.isUserLoggedIn = () => isLoggedIn

  // Mostrar notificación
  function showNotification(message, type = "info") {
    // Crear elemento de notificación
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
      </div>
      <button class="close-notification">
        <i class="fas fa-times"></i>
      </button>
    `

    // Añadir al DOM
    document.body.appendChild(notification)

    // Mostrar con animación
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Configurar cierre automático
    const closeTimeout = setTimeout(() => {
      closeNotification(notification)
    }, 5000)

    // Configurar cierre manual
    const closeBtn = notification.querySelector(".close-notification")
    closeBtn.addEventListener("click", () => {
      clearTimeout(closeTimeout)
      closeNotification(notification)
    })
  }

  // Cerrar notificación
  function closeNotification(notification) {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  }

  // Abrir modal
  function openModal() {
    loginModal.classList.add("active")
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Cerrar modal
  function closeModal() {
    loginModal.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = ""

    // Resetear formularios
    loginForm.reset()
    registerForm.reset()
  }

  // Cambiar entre pestañas de inicio de sesión y registro
  function switchToLoginTab() {
    loginTab.classList.add("active")
    registerTab.classList.remove("active")
    loginContent.classList.add("active")
    registerContent.classList.remove("active")
  }

  function switchToRegisterTab() {
    registerTab.classList.add("active")
    loginTab.classList.remove("active")
    registerContent.classList.add("active")
    loginContent.classList.remove("active")
  }

  // Configurar eventos iniciales
  function setupInitialEvents() {
    // Configurar eventos para las pestañas de login/registro
    loginTab.addEventListener("click", switchToLoginTab)
    registerTab.addEventListener("click", switchToRegisterTab)

    // Configurar eventos para cerrar el modal
    closeLoginModal.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)

    // Configurar eventos para los formularios
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
      const rememberMe = document.getElementById("remember-me").checked

      login(email, password)
    })

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("register-name").value
      const email = document.getElementById("register-email").value
      const password = document.getElementById("register-password").value
      const confirmPassword = document.getElementById("register-confirm-password").value
      const acceptTerms = document.getElementById("terms").checked

      // Validaciones
      if (password !== confirmPassword) {
        showNotification("Las contraseñas no coinciden", "error")
        return
      }

      if (!acceptTerms) {
        showNotification("Debes aceptar los términos y condiciones", "error")
        return
      }

      register(name, email, password)
    })

    // Configurar eventos para el botón de login
    setupUserMenuEvents()
  }

  // Inicializar
  checkSession()
  setupInitialEvents()
})

