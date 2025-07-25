
//Este es el modulo de autenticación para EduConnect
//Maneja el registro, login y sesión de usuarios

// Este seria el uusuario por defecto para ingresar
const defaultUser = {
    username: "Estudiante_123",
    password: "IALI-2015",
    name: "Estudiante Demo"
};

// Inicializar usuarios en localStorage si no existen
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([defaultUser]));
}

// Obtener usuarios registrados
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Registrar nuevo usuario
function registerUser(name, username, password) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (users.some(u => u.username === username)) {
        return { success: false, message: "Este nombre de usuario ya está registrado" };
    }
    
    // Crear nuevo usuario
    const newUser = { name, username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: "Registro exitoso" };
}

// Iniciar sesión
function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => 
        u.username === username && 
        u.password === password
    );
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    
    return { success: false, message: "Usuario o contraseña incorrectos" };
}

// Cerrar sesión
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Verificar sesión activa al cargar la página de inicio
function checkSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && window.location.pathname.endsWith('Inicio.html')) {
        window.location.href = 'index.html';
    }
}

// Mostrar mensaje en los formularios
function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = isSuccess ? 'message success' : 'message error';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Manejadores de eventos para los formularios (solo si existen en la página)
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    const result = registerUser(name, username, password);
    
    if (result.success) {
        showMessage('register-message', 'Registro exitoso. Redirigiendo...', true);
        setTimeout(() => {
            document.querySelector('.register').classList.add('hide');
            document.querySelector('.login').classList.remove('hide');
            document.getElementById('register-form').reset();
        }, 1500);
    } else {
        showMessage('register-message', result.message, false);
    }
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const result = loginUser(username, password);
    
    if (result.success) {
        showMessage('login-message', 'Inicio de sesión exitoso', true);
        setTimeout(() => {
            window.location.href = 'Inicio.html';
        }, 1000);
    } else {
        showMessage('login-message', result.message, false);
    }
});

// Función para cerrar sesión (disponible en Inicio.html)
window.cerrarSesion = function() {
    logoutUser();
};

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', checkSession);