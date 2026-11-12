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

function fecharMenu() {
    menu.classList.add("invisivel");
    btn.classList.add("fa-bars");
    btn.classList.remove("fa-x");
}

// Fecha o menu ao clicar em uma opção
menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
});

// Fecha o menu ao clicar fora dele
document.addEventListener("click", (evento) => {
    const clicouNoMenu = menu.contains(evento.target) || btn.contains(evento.target);

    if (!clicouNoMenu) {
        fecharMenu();
    }
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
// CONTATOS GERAIS
// =========================================================

// WhatsApp geral da RAD (Mestre Rad). Trocando aqui, muda em todos os botões.
const WHATSAPP_RAD = "5521982121315";

// Monta o link do WhatsApp já com uma mensagem pronta
function linkWhatsApp(numero, mensagem) {
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem);
}

// Botões com data-whatsapp="mensagem" viram links para o WhatsApp geral
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = linkWhatsApp(WHATSAPP_RAD, link.dataset.whatsapp);
    link.target = "_blank";
    link.rel = "noopener";
});

// =========================================================
// POLOS
// =========================================================

// Polos cadastrados no painel (/admin). O Django coloca os dados na página
// em <script id="polos-dados">, e aqui só lemos.
const elementoPolos = document.getElementById("polos-dados");
const polos = elementoPolos ? JSON.parse(elementoPolos.textContent) : [];

const selectPolo = document.getElementById("polo-select");
const listaTurmas = document.getElementById("polo-lista-turmas");
const buscaPolo = document.getElementById("polo-busca");
const cardsPolo = document.getElementById("polos-cards");

// Quantidade de polos no seletor e no contador
document.querySelectorAll(".polos-total").forEach((el) => {
    el.textContent = polos.length;
});

// Transforma 0 em "01", 1 em "02"...
function numeroPolo(indice) {
    return String(indice + 1).padStart(2, "0");
}

// (21) 98212-1315 a partir de "5521982121315"
function formatarTelefone(numero) {
    const n = numero.replace(/^55/, "");
    return "(" + n.slice(0, 2) + ") " + n.slice(2, n.length - 4) + "-" + n.slice(-4);
}

// Cria o card de uma turma
function criarTurma(turma) {
    const card = document.createElement("div");
    card.className = "polo-turma";
    card.innerHTML = `
        <div class="polo-turma-topo">
            <span class="polo-idade"></span>
            <h4></h4>
        </div>
        <div class="polo-disponivel">
            <p><i class="fa-regular fa-calendar"></i> <span class="polo-dias"></span></p>
            <p><i class="fa-regular fa-clock"></i> <span class="polo-horario"></span></p>
        </div>
    `;
    card.querySelector(".polo-idade").textContent = turma.idade;
    card.querySelector("h4").textContent = turma.nome;
    card.querySelector(".polo-dias").textContent = turma.dias;
    card.querySelector(".polo-horario").textContent = turma.horario;
    return card;
}

// Mostra na tela os dados do polo escolhido
function mostrarPolo(indice) {
    const polo = polos[indice];
    const local = encodeURIComponent(polo.mapa || polo.endereco);

    document.getElementById("polo-numero").textContent = "Polo " + numeroPolo(indice);
    document.getElementById("polo-nome").textContent = polo.nome;
    document.getElementById("polo-endereco").textContent = polo.endereco;
    document.getElementById("polo-professor").textContent = "Professor: " + polo.professor;
    document.getElementById("polo-mapa-frame").src = "https://www.google.com/maps?q=" + local + "&output=embed";
    document.getElementById("polo-link").href = "https://www.google.com/maps/dir/?api=1&destination=" + local;

    const referencia = document.getElementById("polo-referencia");
    referencia.textContent = polo.referencia;
    referencia.parentElement.hidden = !polo.referencia;

    const whats = document.getElementById("polo-whatsapp");
    whats.textContent = formatarTelefone(polo.whatsapp);
    whats.href = linkWhatsApp(polo.whatsapp, "Olá! Vi o site da RAD Jiu Jitsu e tenho interesse no polo " + polo.nome + ".");

    // "Quero me inscrever" já leva o nome do polo escolhido na mensagem
    document.getElementById("polo-inscrever").href = linkWhatsApp(
        WHATSAPP_RAD,
        "Olá! Vi o site da RAD Jiu Jitsu e quero me inscrever no polo " + polo.nome + "."
    );

    // Turmas do polo
    listaTurmas.innerHTML = "";
    polo.turmas.forEach((turma) => listaTurmas.appendChild(criarTurma(turma)));

    const qtd = polo.turmas.length;
    document.getElementById("polo-qtd").textContent = qtd + (qtd === 1 ? " horário" : " horários");

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
if (polos.length) {
    mostrarPolo(0);
}

// =========================================================
// GALERIA - FOTO AMPLIADA
// =========================================================

const fotosGaleria = document.querySelectorAll(".galeria-fotos img");
const modal = document.getElementById("galeria-modal");
const modalImg = document.getElementById("galeria-modal-img");
const btnFechar = document.getElementById("galeria-fechar");

function abrirFoto(foto) {
    modalImg.src = foto.src;
    modalImg.alt = foto.alt;
    modal.classList.remove("invisivel");
    document.body.style.overflow = "hidden"; // trava a rolagem da página
}

function fecharFoto() {
    modal.classList.add("invisivel");
    document.body.style.overflow = ""; // libera a rolagem
}

// Abre ao clicar em qualquer foto da galeria
fotosGaleria.forEach((foto) => {
    foto.addEventListener("click", () => abrirFoto(foto));
});

// Fecha no X
btnFechar.addEventListener("click", fecharFoto);

// Fecha ao clicar no fundo escuro (fora da foto)
modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        fecharFoto();
    }
});

// Fecha com a tecla Esc
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        fecharFoto();
    }
});
// =========================================================
// ELEMENTOS APARECENDO AO ROLAR
// =========================================================

// Lista do que deve aparecer com efeito. Para incluir algo novo,
// é só acrescentar o seletor aqui.
const elementosRevelar = document.querySelectorAll(`
    .counter-box,
    .historia-img,
    .historia-txt,
    .timeline-item,
    .valores-txt,
    .valores-faixa,
    .polos-cabecalho,
    .polos-busca,
    .polo-detalhe,
    .galeria-container h2,
    .galeria-fotos,
    .btn-galeria,
    .apoie-cabecalho,
    .apoie-card,
    .destaque-conteudo
`);

if (!reduzirMovimento) {
    elementosRevelar.forEach((elemento) => {
        elemento.classList.add("revelar");

        // Itens lado a lado (cards, timeline) aparecem um depois do outro
        const irmaos = Array.from(elemento.parentElement.children);
        const posicao = irmaos.indexOf(elemento);
        elemento.style.transitionDelay = Math.min(posicao * 0.12, 0.48) + "s";
    });

    const observadorRevelar = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                obs.unobserve(entrada.target); // anima só uma vez
            }
        });
    }, { threshold: 0.15 });

    elementosRevelar.forEach((elemento) => observadorRevelar.observe(elemento));
}
