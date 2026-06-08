// 1. Usuarios Predeterminados de Prueba (Requisito Obligatorio)
const DEFAULT_USERS = [
    { name: "Admin SGG", email: "admin@sgg.com", password: "password123" },
    { name: "Usuario Prueba", email: "user@sgg.com", password: "password2026" }
];

// Inicialización de persistencia local segura (DRY)
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
}

// 2. Control de Vistas (Navegación interna limpia)
function switchView(view) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('recover-section').classList.add('hidden');
    
    // Limpieza de estados anteriores
    clearFeedback();

    if (view === 'login') document.getElementById('login-section').classList.remove('hidden');
    if (view === 'register') document.getElementById('register-section').classList.remove('hidden');
    if (view === 'recover') document.getElementById('recover-section').classList.remove('hidden');
}

// Helper funcional (DRY) para renderizar estados visuales
function showFeedback(elementId, text, isSuccess) {
    const feedbackEl = document.getElementById(elementId);
    feedbackEl.textContent = text;
    feedbackEl.className = `feedback-msg ${isSuccess ? 'success-text' : 'error-text'}`;
}

function clearFeedback() {
    document.querySelectorAll('.feedback-msg').forEach(el => el.textContent = '');
}

function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('users'));
}

// 3. Manejo de Eventos y Validaciones (Ortogonalidad)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL ACCESORIO DE TEMA (DARK/LIGHT) ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.body.className = `${currentTheme}-theme`;
    themeToggle.textContent = currentTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.className = 'dark-theme';
            themeToggle.textContent = '☀️ Modo Claro';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.className = 'light-theme';
            themeToggle.textContent = '🌙 Modo Oscuro';
            localStorage.setItem('theme', 'light');
        }
    });

    // --- MANEJO DE ENVÍO: LOGIN ---
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;

        if (!email || !pass) {
            return showFeedback('login-feedback', 'Todos los campos son requeridos.', false);
        }

        const users = getUsersFromStorage();
        const userFound = users.find(u => u.email === email && u.password === pass);

        if (userFound) {
            showFeedback('login-feedback', `¡Bienvenido/a, ${userFound.name}! Iniciando sesión...`, true);
            localStorage.setItem('activeSession', JSON.stringify(userFound));
            // Aquí iría la redirección en incrementos futuros: window.location.href = 'dashboard.html';
        } else {
            showFeedback('login-feedback', 'Credenciales incorrectas. Verifique e intente de nuevo.', false);
        }
    });

    // --- MANEJO DE ENVÍO: REGISTRO ---
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm-password').value;

        if (!name || !email || !pass || !confirmPass) {
            return showFeedback('register-feedback', 'Por favor complete todos los campos.', false);
        }
        if (pass.length < 6) {
            return showFeedback('register-feedback', 'La contraseña debe tener mínimo 6 caracteres.', false);
        }
        if (pass !== confirmPass) {
            return showFeedback('register-feedback', 'Las contraseñas no coinciden.', false);
        }

        const users = getUsersFromStorage();
        if (users.some(u => u.email === email)) {
            return showFeedback('register-feedback', 'El correo ya se encuentra registrado.', false);
        }

        // Guardar nuevo registro
        users.push({ name, email, password: pass });
        localStorage.setItem('users', JSON.stringify(users));

        showFeedback('register-feedback', '¡Cuenta creada con éxito! Redirigiendo...', true);
        setTimeout(() => {
            document.getElementById('register-form').reset();
            switchView('login');
        }, 2000);
    });

    // --- MANEJO DE ENVÍO: RECUPERACIÓN ---
    document.getElementById('recover-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('recover-email').value.trim();

        if (!email) {
            return showFeedback('recover-feedback', 'Ingrese un correo electrónico.', false);
        }

        const users = getUsersFromStorage();
        const emailExists = users.some(u => u.email === email);

        if (emailExists) {
            showFeedback('recover-feedback', 'Se ha enviado un enlace de recuperación a su correo.', true);
            document.getElementById('recover-form').reset();
        } else {
            showFeedback('recover-feedback', 'El correo electrónico no está registrado en el sistema.', false);
        }
    });
});