// ================================
// BARRA DE REAPROVEITAMENTO
// ================================

const opcoes = document.querySelectorAll(".opcao");

// ================================
// CLIQUE NAS OPÇÕES
// ================================

opcoes.forEach((opcao) => {

    opcao.addEventListener("click", (event) => {

        // Evita o clique caso o elemento não tenha destino
        const pagina = opcao.getAttribute("href");

        if (!pagina) {
            event.preventDefault();
            return;
        }

        // Efeito visual antes de mudar de página
        opcao.classList.add("selecionada");

    });

});


// ================================
// ANIMAÇÃO AO ENTRAR NA PÁGINA
// ================================

window.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 70);

    });

});