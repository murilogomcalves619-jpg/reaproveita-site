// ======================================================
// CONFIGURAÇÃO
// ======================================================

const API_URL = "http://localhost:3000/api";

// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const cards = document.querySelectorAll(".ingredient-card");
const placeholder = document.getElementById("placeholder");
const recipesContent = document.getElementById("recipesContent");
const selectedIngredient = document.getElementById("selectedIngredient");
const recipeList = document.getElementById("recipeList");
const closeRecipes = document.getElementById("closeRecipes");
const contador = document.getElementById("contador");

// ======================================================
// CONTADOR DE INGREDIENTES
// ======================================================

if (contador) {
    contador.textContent = `${cards.length} alimentos`;
}

// ======================================================
// FORMATAR MODO DE PREPARO
// ======================================================

function formatarModoPreparo(modoPreparo) {

    if (!modoPreparo) {
        return `
            <p class="preparo-vazio">
                Modo de preparo não informado.
            </p>
        `;
    }

    let passos = [];

    // Se a API já mandar como array
    if (Array.isArray(modoPreparo)) {

        passos = modoPreparo
            .map(passo => String(passo).trim())
            .filter(passo => passo !== "");

    } else {

        let texto = String(modoPreparo)
            .replace(/\r/g, "")
            .trim();

        // Primeiro tenta separar pelas quebras de linha
        let porLinha = texto
            .split(/\n+/)
            .map(passo => passo.trim())
            .filter(passo => passo !== "");

        // Se tudo veio em uma única linha,
        // separa pelos números: 1. ... 2. ... 3. ...
        if (porLinha.length <= 1) {

            porLinha = texto
                .split(/\s*(?=\d+\.\s*)/)
                .map(passo => passo.trim())
                .filter(passo => passo !== "");
        }

        passos = porLinha;
    }

    // Remove a numeração que já veio do banco
    // para não ficar "1. 1. Refogue..."
    passos = passos.map(passo =>
        passo
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .trim()
    );

    if (passos.length === 0) {
        return `
            <p class="preparo-vazio">
                Modo de preparo não informado.
            </p>
        `;
    }

    // Cria cada passo separado
    return passos.map((passo, index) => `
        <div class="passo-receita">

            <span class="numero-passo">
                ${index + 1}
            </span>

            <p>
                ${passo}
            </p>

        </div>
    `).join("");
}

// ======================================================
// CLIQUE NOS INGREDIENTES
// ======================================================

cards.forEach(card => {

    card.addEventListener("click", () => {

        // Remove seleção dos outros cards
        cards.forEach(item => {
            item.classList.remove("selected");
        });

        // Seleciona o card clicado
        card.classList.add("selected");

        // Pega os dados do HTML
        const nome = card.dataset.name;
        const ingredienteId = card.dataset.id;

        console.log("================================");
        console.log("Ingrediente clicado:", nome);
        console.log("ID do ingrediente:", ingredienteId);
        console.log("================================");

        buscarReceitas(ingredienteId, nome);
    });

});

// ======================================================
// BUSCAR RECEITAS DO INGREDIENTE
// ======================================================

// ======================================================
// BUSCAR RECEITAS DO INGREDIENTE
// ======================================================

async function buscarReceitas(ingredienteId, nome) {

    if (!ingredienteId) {
        console.error("Ingrediente sem ID.");
        return;
    }

    // Esconde o placeholder
    if (placeholder) {
        placeholder.style.display = "none";
    }

    // Mostra o painel de receitas
    if (recipesContent) {
        recipesContent.classList.add("active");
        recipesContent.style.display = "";
    }

    // Mostra o nome do ingrediente
    if (selectedIngredient) {
        selectedIngredient.textContent = nome;
    }

    // Loading
    if (recipeList) {

        recipeList.innerHTML = `
            <div class="loading">

                <div class="loading-spinner"></div>

                <p>
                    Buscando receitas...
                </p>

            </div>
        `;
    }

    // RESTANTE DO SEU CÓDIGO CONTINUA IGUAL...

    try {

        const url = `${API_URL}/receitas/${ingredienteId}`;

        console.log("Buscando receitas em:");
        console.log(url);

        const resposta = await fetch(url);

        console.log("Status da API:", resposta.status);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log("Dados recebidos da API:");
        console.log(dados);

        if (!Array.isArray(dados) || dados.length === 0) {

            mostrarSemReceitas();

            return;
        }

        mostrarReceitas(dados);

    } catch (erro) {

        console.error("Erro ao buscar receitas:", erro);

        if (recipeList) {

            recipeList.innerHTML = `
                <div class="no-recipes">

                    <h3>
                        Não foi possível carregar as receitas.
                    </h3>

                    <p>
                        Verifique se a API está funcionando.
                    </p>

                </div>
            `;
        }
    }
}

// ======================================================
// CORRIGIR CAMINHO DAS IMAGENS
// ======================================================

function corrigirImagem(caminho) {

    if (!caminho) {
        return "/imagens/logoicone.png";
    }

    caminho = String(caminho).trim();

    // URL completa
    if (
        caminho.startsWith("http://") ||
        caminho.startsWith("https://") ||
        caminho.startsWith("data:image/")
    ) {
        return caminho;
    }

    // Banco manda:
    // imagens/receitas/foto.jpg
    if (caminho.startsWith("imagens/")) {
        return "/" + caminho;
    }

    // Já começa com:
    // /imagens/receitas/foto.jpg
    if (caminho.startsWith("/imagens/")) {
        return caminho;
    }

    // Caso o banco mande somente:
    // foto.jpg
    return "/imagens/receitas/" + caminho;
}

// ======================================================
// MOSTRAR LISTA DE RECEITAS
// ======================================================

function mostrarReceitas(receitas) {

    if (!recipeList) {
        return;
    }

    recipeList.innerHTML = "";

    receitas.forEach(receita => {

        // Imagem
        let imagem = corrigirImagem(receita.imagem);

        console.log(
            "Imagem recebida do banco:",
            receita.imagem
        );

        console.log(
            "Imagem usada pelo site:",
            imagem
        );

        const card = document.createElement("article");

        card.className = "recipe-card";

        card.innerHTML = `

            <img
                class="recipe-image"
                src="${imagem}"
                alt="${receita.nome || "Receita"}"
                onerror="this.src='/imagens/logoicone.png'"
            >

            <div class="recipe-info">

                <h3>
                    ${receita.nome || "Receita sem nome"}
                </h3>

                <button
                    class="recipe-button"
                    type="button"
                >
                    Ver modo de preparo
                </button>

            </div>

        `;

        // Botão de abrir receita
        const botao = card.querySelector(".recipe-button");

        botao.addEventListener("click", () => {

            if (receita.id) {

                verReceita(receita.id);

            } else {

                mostrarDetalhes(receita);

            }

        });

        recipeList.appendChild(card);
    });
}

// ======================================================
// BUSCAR RECEITA COMPLETA
// ======================================================

async function verReceita(id) {

    if (!id) {

        console.error(
            "ID da receita não informado."
        );

        return;
    }

    recipeList.innerHTML = `

        <div class="loading">

            <div class="loading-spinner"></div>

            <p>
                Carregando receita...
            </p>

        </div>

    `;

    try {

        const url = `${API_URL}/receita/${id}`;

        console.log("Buscando receita:");
        console.log(url);

        const resposta = await fetch(url);

        console.log(
            "Status da receita:",
            resposta.status
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const receita = await resposta.json();

        console.log(
            "Receita recebida:"
        );

        console.log(receita);

        if (!receita) {
            throw new Error(
                "Receita não encontrada."
            );
        }

        mostrarDetalhes(receita);

    } catch (erro) {

        console.error(
            "Erro ao buscar receita:",
            erro
        );

        recipeList.innerHTML = `

            <div class="no-recipes">

                <h3>
                    Erro ao carregar a receita.
                </h3>

                <p>
                    Não foi possível carregar
                    o modo de preparo.
                </p>

                <button
                    class="recipe-button"
                    type="button"
                    onclick="voltarParaReceitas()"
                >
                    Voltar para receitas
                </button>

            </div>

        `;
    }
}

// ======================================================
// MOSTRAR DETALHES DA RECEITA
// ======================================================

function mostrarDetalhes(receita) {

    // ==================================================
    // IMAGEM
    // ==================================================

    let imagem = corrigirImagem(
        receita.imagem
    );

    // ==================================================
    // INGREDIENTES
    // ==================================================

    let ingredientes = [];

    // API nova
    if (Array.isArray(receita.ingredientes)) {

        ingredientes = receita.ingredientes;

    }

    // Ingredientes como texto
    else if (
        typeof receita.ingredientes === "string"
    ) {

        ingredientes = receita.ingredientes
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(item => item !== "");

    }

    // API antiga
    else if (
        Array.isArray(receita.ingrediente)
    ) {

        ingredientes = receita.ingrediente;

    }

    else if (
        typeof receita.ingrediente === "string"
    ) {

        ingredientes = receita.ingrediente
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(item => item !== "");

    }

    // ==================================================
    // MODO DE PREPARO
    // ==================================================

    let modoPreparo = receita.modoPreparo;

    // Caso a API use snake_case
    if (!modoPreparo) {
        modoPreparo = receita.modo_preparo;
    }

    // ==================================================
    // HTML DOS INGREDIENTES
    // ==================================================

    let ingredientesHTML = "";

    if (ingredientes.length > 0) {

        ingredientesHTML = ingredientes
            .map(ingrediente => `

                <li>
                    ${ingrediente}
                </li>

            `)
            .join("");

    } else {

        ingredientesHTML = `

            <li>
                Ingredientes não informados.
            </li>

        `;
    }

    // ==================================================
    // HTML DO MODO DE PREPARO
    // ==================================================

    const preparoHTML =
        formatarModoPreparo(
            modoPreparo
        );

    // ==================================================
    // MOSTRAR NA TELA
    // ==================================================

    recipeList.innerHTML = `

        <div class="recipe-detail">

            <button
                class="back-button"
                type="button"
                onclick="voltarParaReceitas()"
            >
                ← Voltar para receitas
            </button>

            <img
                class="recipe-detail-image"
                src="${imagem}"
                alt="${receita.nome || "Receita"}"
                onerror="this.src='/imagens/logoicone.png'"
            >

            <h2>
                ${receita.nome || "Receita"}
            </h2>

            <!-- INGREDIENTES -->

            <section class="recipe-section">

                <h3>
                    Ingredientes
                </h3>

                <ul>
                    ${ingredientesHTML}
                </ul>

            </section>

            <!-- MODO DE PREPARO -->

            <section class="recipe-section">

                <h3>
                    Modo de preparo
                </h3>

                <div class="lista-passos">

                    ${preparoHTML}

                </div>

            </section>

        </div>

    `;
}

// ======================================================
// VOLTAR PARA LISTA DE RECEITAS
// ======================================================

function voltarParaReceitas() {

    const cardSelecionado =
        document.querySelector(
            ".ingredient-card.selected"
        );

    if (!cardSelecionado) {
        return;
    }

    const id =
        cardSelecionado.dataset.id;

    const nome =
        cardSelecionado.dataset.name;

    buscarReceitas(id, nome);
}

// ======================================================
// FECHAR PAINEL
// ======================================================

if (closeRecipes) {

    closeRecipes.addEventListener(
        "click",
        () => {

            if (recipesContent) {

                recipesContent.classList.remove(
                    "active"
                );

                recipesContent.style.display =
                    "none";
            }

            if (placeholder) {

                placeholder.style.display =
                    "block";
            }

            cards.forEach(card => {

                card.classList.remove(
                    "selected"
                );

            });

        }
    );
}

// ======================================================
// SEM RECEITAS
// ======================================================

function mostrarSemReceitas() {

    if (!recipeList) {
        return;
    }

    recipeList.innerHTML = `

        <div class="no-recipes">

            <h3>
                Nenhuma receita encontrada
            </h3>

            <p>
                Ainda não temos receitas
                cadastradas para este ingrediente.
            </p>

        </div>

    `;
}

// ======================================================
// INTEGRAÇÃO COM O EPICURE
// ======================================================

(() => {

    const cards = document.querySelectorAll(".ingredient-card");

    const btnGerarReceita = document.getElementById("btnGerarReceita");

    const selectedCount = document.getElementById("selectedCount");

    const epicureResult = document.getElementById("epicureResult");

    const epicureStatus = document.getElementById("epicureStatus");

    const epicureText = document.getElementById("epicureText");

    const placeholder = document.getElementById("placeholder");

    const recipesContent = document.getElementById("recipesContent");

    const alimentosSelecionados = new Set();


    // ==================================================
    // SELECIONAR E DESSELECIONAR ALIMENTOS
    // ==================================================

    cards.forEach(card => {

        card.addEventListener("click", (event) => {

            // Impede que o clique seja tratado pelo
            // sistema antigo de receitas individuais.
            event.preventDefault();
            event.stopImmediatePropagation();

            const nome = card.dataset.name;

            if (!nome) {
                return;
            }

            if (alimentosSelecionados.has(nome)) {

                alimentosSelecionados.delete(nome);

                card.classList.remove("epicure-selected");

                card.setAttribute("aria-pressed", "false");

            } else {

                alimentosSelecionados.add(nome);

                card.classList.add("epicure-selected");

                card.setAttribute("aria-pressed", "true");

            }

            atualizarContador();

        }, true);

    });


    // ==================================================
    // ATUALIZAR CONTADOR
    // ==================================================

    function atualizarContador() {

        const quantidade = alimentosSelecionados.size;

        if (quantidade === 0) {

            selectedCount.textContent =
                "Nenhum alimento selecionado";

        } else if (quantidade === 1) {

            selectedCount.textContent =
                "1 alimento selecionado";

        } else {

            selectedCount.textContent =
                `${quantidade} alimentos selecionados`;

        }

    }


// ==================================================
// CONSULTAR O GEMINI E GERAR RECEITA
// ==================================================

btnGerarReceita.addEventListener("click", async () => {

    // Verificar se algum alimento foi selecionado
    if (alimentosSelecionados.size === 0) {
        alert("Selecione pelo menos um alimento.");
        return;
    }

    // Obter os alimentos selecionados
    const ingredientes = Array.from(alimentosSelecionados);

    // Preparar o botão
    btnGerarReceita.disabled = true;
    btnGerarReceita.textContent = "Gerando receita...";

    // Mostrar a área de resultado
    epicureResult.hidden = false;

    epicureStatus.textContent =
        "Preparando sua receita com inteligência artificial...";

    epicureText.textContent = "";

    if (placeholder) {
        placeholder.style.display = "none";
    }

    if (recipesContent) {
        recipesContent.style.display = "none";
    }

    try {

        // ==========================================
        // 1. PREPARAR A REQUISIÇÃO
        // ==========================================

        const parametros = new URLSearchParams({
            ingredientes: ingredientes.join(",")
        });

        const url =
            `${API_URL}/epicure/combinar?${parametros.toString()}`;

        console.log("==================================");
        console.log("Consultando API do Reaproveita.ai");
        console.log("Ingredientes:", ingredientes);
        console.log("URL:", url);

        // ==========================================
        // 2. CHAMAR A API
        // ==========================================

        const resposta = await fetch(url);

        console.log("Status HTTP:", resposta.status);

        // Ler a resposta como texto antes de converter
        const textoResposta = await resposta.text();

        let dados;

        try {

            dados = JSON.parse(textoResposta);

        } catch (erroJSON) {

            console.error(
                "A API não retornou JSON válido:",
                textoResposta
            );

            throw new Error(
                "O servidor retornou uma página HTML em vez de JSON. " +
                "Verifique a URL da API e se o servidor está funcionando."
            );
        }

        // ==========================================
        // 3. VERIFICAR SE A API RETORNOU UM ERRO
        // ==========================================

        if (!resposta.ok || dados.sucesso === false) {

            throw new Error(
                dados.detalhes ||
                dados.erro ||
                `Erro HTTP ${resposta.status}`
            );
        }

        // ==========================================
        // 4. OBTER A RECEITA
        // ==========================================

        const receita = dados.receita;

        if (
            !receita ||
            typeof receita.nome !== "string" ||
            !receita.nome.trim()
        ) {
            console.error("Resposta recebida:", dados);

            throw new Error(
                "A API respondeu, mas não retornou uma receita válida."
            );
        }

        console.log("Receita recebida:", receita);

        // ==========================================
        // 5. FORMATAR OS INGREDIENTES DISPONÍVEIS
        // ==========================================

        const ingredientesReceita =
            Array.isArray(receita.ingredientes) &&
            receita.ingredientes.length > 0

                ? receita.ingredientes.map(item => {

                    if (typeof item === "string") {
                        return `• ${item}`;
                    }

                    return `• ${item.nome || "Ingrediente"}: ${
                        item.quantidade || "Quantidade não informada"
                    }`;

                }).join("\n")

                : "Ingredientes não informados.";

        // ==========================================
        // 6. FORMATAR OS INGREDIENTES ADICIONAIS
        // ==========================================

        const ingredientesAdicionais =
            Array.isArray(receita.ingredientes_adicionais) &&
            receita.ingredientes_adicionais.length > 0

                ? receita.ingredientes_adicionais.map(item => {

                    if (typeof item === "string") {
                        return `• ${item}`;
                    }

                    return `• ${item.nome || "Ingrediente"}: ${
                        item.quantidade || "Quantidade não informada"
                    }`;

                }).join("\n")

                : "Nenhum ingrediente adicional informado.";

        // ==========================================
        // 7. FORMATAR O MODO DE PREPARO
        // ==========================================

        const modoPreparo =
            Array.isArray(receita.modo_preparo) &&
            receita.modo_preparo.length > 0

                ? receita.modo_preparo.map((passo, indice) => {

                    return `${indice + 1}. ${passo}`;

                }).join("\n")

                : "Modo de preparo não informado.";

        // ==========================================
        // 8. MONTAR O RESULTADO
        // ==========================================

        const textoFinal = `
${receita.nome}

${receita.descricao || "Uma receita preparada com os alimentos selecionados."}

TEMPO DE PREPARO:
${receita.tempo_preparo || "Não informado"}

PORÇÕES:
${receita.porcoes || "Não informado"}

INGREDIENTES DISPONÍVEIS:
${ingredientesReceita}

INGREDIENTES ADICIONAIS:
${ingredientesAdicionais}

MODO DE PREPARO:
${modoPreparo}

DICA DE APROVEITAMENTO:
${receita.aproveitamento || "Aproveite os alimentos que ainda estão próprios para consumo."}
        `.trim();

        // ==========================================
        // 9. EXIBIR A RECEITA NA PÁGINA
        // ==========================================

        epicureStatus.textContent =
            `Receita gerada com os alimentos: ${ingredientes.join(", ")}`;

        epicureText.textContent = textoFinal;

        console.log("Receita exibida com sucesso:", receita.nome);
        console.log("==================================");

    } catch (erro) {

        // ==========================================
        // 10. TRATAR ERROS
        // ==========================================

        console.error("Erro ao gerar receita:", erro);

        epicureStatus.textContent =
            "Não foi possível gerar a receita.";

        epicureText.textContent =
            erro.message ||
            "Ocorreu um erro inesperado. Tente novamente.";

    } finally {

        // ==========================================
        // 11. RESTAURAR O BOTÃO
        // ==========================================

        btnGerarReceita.disabled = false;

        btnGerarReceita.textContent =
            "Sugerir combinação de alimentos";
    }

});

})();