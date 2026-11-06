document.addEventListener("DOMContentLoaded", () => {

    const opcoes =
        document.querySelectorAll(".opcao");

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();


    /* =========================
       IDENTIFICAR PÁGINA ATUAL
    ========================= */

    opcoes.forEach((opcao) => {

        const destino =
            opcao.getAttribute("href");

        if (destino === paginaAtual) {

            opcao.classList.add("ativa");

        }


        /* Animação ao clicar */

        opcao.addEventListener("click", () => {

            opcao.classList.add("selecionada");

        });

    });


    /* =========================
       ANIMAÇÃO DOS CARDS
    ========================= */

    const cards =
        document.querySelectorAll(".card");


    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(15px)";


        setTimeout(() => {

            card.style.transition =
                "opacity .45s ease, transform .45s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 70);

    });

});