const btnSignIn = document.getElementById("sign-in"),
      btnSignUp = document.getElementById("sign-up"),
      containerFormRegister = document.querySelector(".register"),
      containerFormLogin = document.querySelector(".login");

// Mostrar formulario de login
btnSignIn?.addEventListener("click", e => {
    containerFormRegister.classList.add("hide");
    containerFormLogin.classList.remove("hide");
    
// Limpiar mensajes
    document.getElementById("register-message").style.display = "none";
    document.getElementById("login-message").style.display = "none";
});

// Mostrar formulario de registro
btnSignUp?.addEventListener("click", e => {
    containerFormLogin.classList.add("hide");
    containerFormRegister.classList.remove("hide");
    
    document.getElementById("register-message").style.display = "none";
    document.getElementById("login-message").style.display = "none";
});