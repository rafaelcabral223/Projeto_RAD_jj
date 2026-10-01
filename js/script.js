// =========================================================
// MENU MOBILE
// =========================================================

const btn = document.getElementById("btn-nav");
const menu = document.getElementById("nav-mobile");

btn.addEventListener("click", () => {
    btn.classList.toggle("fa-bars");
    btn.classList.toggle("fa-x");
    menu.classList.toggle("invisivel");
});

// =========================================================
// BACKGROUND DO NAV AO ROLAR
// =========================================================

const nav = document.querySelector(".nav-container");

window.addEventListener("scroll", () => {
    nav.classList.toggle("rolado", window.scrollY > 50);
});

// =========================================================
// CONTADOR
// =========================================================

const contadores = document.querySelectorAll(".counter");
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatar(valor, el) {
    const prefixo = el.dataset.prefixo || "";
    const sufixo = el.dataset.sufixo || "";
    return prefixo + valor.toLocaleString("pt-BR") + sufixo;
}

function animarContador(el) {
    const alvo = Number(el.dataset.target) || 0;
    const duracao = 2000; // ms

    if (reduzirMovimento) {
        el.textContent = formatar(alvo, el);
        return;
    }

    const inicio = performance.now();

    function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3); // desacelera no final
        el.textContent = formatar(Math.floor(suavizado * alvo), el);

        if (progresso < 1) {
            requestAnimationFrame(passo);
        } else {
            el.textContent = formatar(alvo, el);
        }
    }

    requestAnimationFrame(passo);
}

const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            animarContador(entrada.target);
            obs.unobserve(entrada.target); // anima só uma vez
        }
    });
}, { threshold: 0.5 });

contadores.forEach((contador) => observador.observe(contador));

// =========================================================
// POLOS
// =========================================================

// Dados dos polos. Para editar, é só trocar os textos aqui.
// "turmas" segue a ordem: iniciante, juvenil, adolescente, adulto.
// Use null quando o polo NÃO oferece aquela turma.
const polos = [
    {
        nome: "Pavão-Pavãozinho e Cantagalo",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Seg · Qua]", horario: "[17h às 18h]" },
            { dias: "[Seg · Qua]", horario: "[18h às 19h]" },
            { dias: "[Ter · Qui]", horario: "[19h às 20h]" },
            { dias: "[Ter · Qui]", horario: "[20h às 21h30]" }
        ]
    },
    {
        nome: "[Nome do polo 02]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Ter · Qui]", horario: "[16h às 17h]" },
            { dias: "[Ter · Qui]", horario: "[17h às 18h]" },
            null,
            { dias: "[Seg · Qua · Sex]", horario: "[19h às 20h30]" }
        ]
    },
    {
        nome: "[Nome do polo 03]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "Turano",
        endereco: "R. Aureliano Portugal, 220 - Rio Comprido, Rio de Janeiro/RJ",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            null,
            { dias: "[Seg · Qua]", horario: "[17h às 18h]" },
            { dias: "[Seg · Qua]", horario: "[18h às 19h]" },
            { dias: "[Seg · Qua]", horario: "[19h às 20h30]" }
        ]
    },
    {
        nome: "[Nome do polo 05]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Seg · Qua]", horario: "[17h às 18h]" },
            { dias: "[Seg · Qua]", horario: "[18h às 19h]" },
            { dias: "[Ter · Qui]", horario: "[19h às 20h]" },
            { dias: "[Ter · Qui]", horario: "[20h às 21h30]" }
        ]
    },
    {
        nome: "[Nome do polo 06]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Ter · Qui]", horario: "[16h às 17h]" },
            { dias: "[Ter · Qui]", horario: "[17h às 18h]" },
            null,
            { dias: "[Seg · Qua · Sex]", horario: "[19h às 20h30]" }
        ]
    },
    {
        nome: "[Nome do polo 07]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "[Nome do polo 08]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            null,
            { dias: "[Seg · Qua]", horario: "[17h às 18h]" },
            { dias: "[Seg · Qua]", horario: "[18h às 19h]" },
            { dias: "[Seg · Qua]", horario: "[19h às 20h30]" }
        ]
    },
    {
        nome: "[Nome do polo 09]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Seg · Qua]", horario: "[17h às 18h]" },
            { dias: "[Seg · Qua]", horario: "[18h às 19h]" },
            { dias: "[Ter · Qui]", horario: "[19h às 20h]" },
            { dias: "[Ter · Qui]", horario: "[20h às 21h30]" }
        ]
    },
    {
        nome: "[Nome do polo 10]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Ter · Qui]", horario: "[16h às 17h]" },
            { dias: "[Ter · Qui]", horario: "[17h às 18h]" },
            null,
            { dias: "[Seg · Qua · Sex]", horario: "[19h às 20h30]" }
        ]
    },
    {
        nome: "[Nome do polo 11]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "[Nome do polo 12]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "[Nome do polo 12]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "[Nome do polo 12]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    },
    {
        nome: "[Nome do polo 15]",
        endereco: "[Rua, número — Bairro, Cidade/UF]",
        telefone: "[(21) 00000-0000]",
        mapa: "https://maps.google.com/?q=[endereço do polo]",
        turmas: [
            { dias: "[Sáb]", horario: "[9h às 10h]" },
            { dias: "[Sáb]", horario: "[10h às 11h]" },
            { dias: "[Sáb]", horario: "[11h às 12h]" },
            null
        ]
    }            
];

const selectPolo = document.getElementById("polo-select");
const cardsTurma = document.querySelectorAll(".polo-turma");
const buscaPolo = document.getElementById("polo-busca");
const cardsPolo = document.getElementById("polos-cards");

// Transforma 0 em "01", 1 em "02"...
function numeroPolo(indice) {
    return String(indice + 1).padStart(2, "0");
}

// Mostra na tela os dados do polo escolhido
function mostrarPolo(indice) {
    const polo = polos[indice];

    document.getElementById("polo-numero").textContent = "Polo " + numeroPolo(indice);
    document.getElementById("polo-nome").textContent = polo.nome;
    document.getElementById("polo-endereco").textContent = polo.endereco;
    document.getElementById("polo-telefone").textContent = polo.telefone;
    document.getElementById("polo-link").href = polo.mapa;

    // Preenche os horários de cada turma
    let disponiveis = 0;

    cardsTurma.forEach((card, i) => {
        const turma = polo.turmas[i];

        if (turma) {
            card.classList.remove("indisponivel");
            card.querySelector(".polo-dias").textContent = turma.dias;
            card.querySelector(".polo-horario").textContent = turma.horario;
            disponiveis++;
        } else {
            card.classList.add("indisponivel");
        }
    });

    document.getElementById("polo-qtd").textContent = disponiveis + " turmas";

    // Mantém o select e o card selecionado sincronizados
    selectPolo.value = indice;

    document.querySelectorAll(".polo-card").forEach((card) => {
        card.classList.toggle("selecionado", Number(card.dataset.indice) === indice);
    });
}

// Cria as opções do select mobile.
polos.forEach((polo, indice) => {
    const opcao = document.createElement("option");
    opcao.value = indice;
    opcao.textContent = numeroPolo(indice) + " · " + polo.nome;
    selectPolo.appendChild(opcao);
});

// Mostra os cards da busca desktop.
function mostrarCardsPolo() {
    const termo = buscaPolo.value.toLocaleLowerCase("pt-BR").trim();

    const polosFiltrados = polos.filter((polo) => {
        return (polo.nome + " " + polo.endereco)
            .toLocaleLowerCase("pt-BR")
            .includes(termo);
    });

    cardsPolo.innerHTML = "";

    polosFiltrados.forEach((polo) => {
        const indice = polos.indexOf(polo);
        const card = document.createElement("article");

        card.className = "polo-card";
        card.dataset.indice = indice;
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.innerHTML = `
            <span class="polo-card-numero">POLO ${numeroPolo(indice)}</span>
            <h3>${polo.nome}</h3>
            <p><i class="fa-solid fa-location-dot"></i> ${polo.endereco}</p>
            <span class="polo-card-link">Ver detalhes <i class="fa-solid fa-arrow-right"></i></span>
        `;

        card.addEventListener("click", () => {
            mostrarPolo(indice);

            // Leva até o detalhe sem esconder o cabeçalho fixo.
            const detalhe = document.querySelector(".polo-detalhe");
            const posicao = detalhe.getBoundingClientRect().top + window.scrollY - 80;

            window.scrollTo({
                top: posicao,
                behavior: "smooth"
            });
        });

        card.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                card.click();
            }
        });

        cardsPolo.appendChild(card);
    });
}

selectPolo.addEventListener("change", () => {
    mostrarPolo(Number(selectPolo.value));
});

buscaPolo.addEventListener("input", mostrarCardsPolo);

// Começa mostrando o primeiro polo
mostrarCardsPolo();
mostrarPolo(0);

// IMAGENS