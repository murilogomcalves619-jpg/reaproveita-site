// ========================================
// ELEMENTOS
// ========================================

const form = document.getElementById("cadastroForm");

const emailInput =
    document.getElementById("email");

const senhaInput =
    document.getElementById("senha");

const confirmarSenhaInput =
    document.getElementById("confirmarSenha");

const mensagem =
    document.getElementById("message");


// ========================================
// MOSTRAR MENSAGEM
// ========================================

function mostrarMensagem(texto, sucesso = false) {

    mensagem.textContent = texto;

    mensagem.style.color =
        sucesso ? "#526b26" : "#c45c3c";

}


// ========================================
// MOSTRAR / ESCONDER SENHA
// ========================================

const mostrarSenha =
    document.getElementById("mostrarSenha");

mostrarSenha.addEventListener("click", () => {

    if (senhaInput.type === "password") {

        senhaInput.type = "text";

        mostrarSenha.textContent = "🙈";

    } else {

        senhaInput.type = "password";

        mostrarSenha.textContent = "👁";

    }

});


// ========================================
// MOSTRAR / ESCONDER CONFIRMAÇÃO
// ========================================

const mostrarConfirmarSenha =
    document.getElementById("mostrarConfirmarSenha");

mostrarConfirmarSenha.addEventListener("click", () => {

    if (confirmarSenhaInput.type === "password") {

        confirmarSenhaInput.type = "text";

        mostrarConfirmarSenha.textContent = "🙈";

    } else {

        confirmarSenhaInput.type = "password";

        mostrarConfirmarSenha.textContent = "👁";

    }

});


// ========================================
// CADASTRO
// ========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // ====================================
    // VERIFICAR CAMPOS VAZIOS
    // ====================================

    if (!emailInput.value.trim()) {

        emailInput.focus();

        emailInput.reportValidity();

        return;

    }


    if (!senhaInput.value.trim()) {

        senhaInput.focus();

        senhaInput.reportValidity();

        return;

    }


    if (!confirmarSenhaInput.value.trim()) {

        confirmarSenhaInput.focus();

        confirmarSenhaInput.reportValidity();

        return;

    }


    // ====================================
    // VERIFICAR E-MAIL
    // ====================================

    if (!emailInput.checkValidity()) {

        emailInput.focus();

        emailInput.reportValidity();

        return;

    }


    // ====================================
    // VERIFICAR SENHA
    // ====================================

    if (senhaInput.value.length < 6) {

        senhaInput.focus();

        senhaInput.setCustomValidity(
            "A senha precisa ter pelo menos 6 caracteres."
        );

        senhaInput.reportValidity();

        senhaInput.setCustomValidity("");

        return;

    }


    // ====================================
    // VERIFICAR SENHAS
    // ====================================

    if (
        senhaInput.value !==
        confirmarSenhaInput.value
    ) {

        mostrarMensagem(
            "As senhas não são iguais."
        );

        confirmarSenhaInput.focus();

        return;

    }


    // ====================================
    // PEGAR DADOS
    // ====================================

    const email =
        emailInput.value.trim().toLowerCase();

    const senha =
        senhaInput.value;


    // ====================================
    // PEGAR CONTAS EXISTENTES
    // ====================================

    let contas = JSON.parse(
        localStorage.getItem(
            "reaproveita_accounts"
        ) || "[]"
    );


    // ====================================
    // VERIFICAR SE E-MAIL JÁ EXISTE
    // ====================================

    const contaExiste = contas.some(
        conta => conta.email === email
    );


    if (contaExiste) {

        mostrarMensagem(
            "Este e-mail já está cadastrado."
        );

        emailInput.focus();

        return;

    }


    // ====================================
    // CRIAR NOVA CONTA
    // ====================================

    const novaConta = {

        email: email,

        password: senha

    };


    contas.push(novaConta);


    // ====================================
    // SALVAR CONTA
    // ====================================

    localStorage.setItem(
        "reaproveita_accounts",
        JSON.stringify(contas)
    );


    // ====================================
    // MENSAGEM DE SUCESSO
    // ====================================

    mostrarMensagem(
        "Conta criada com sucesso! Entrando no login...",
        true
    );


    // ====================================
    // IR PARA O LOGIN
    // ====================================

    setTimeout(() => {

        window.location.href =
            "paginaLogin.html";

    }, 1000);

});