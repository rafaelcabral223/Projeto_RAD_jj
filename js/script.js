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

// Turmas padrão (divisões que o Mestre Rad informou no formulário).
// Cada polo usa uma lista com as turmas que oferece.
function turmaGeral(dias, horario) {
    return { nome: "Turma geral", idade: "A partir de 5 anos", dias, horario };
}
function turmaUnica(dias, horario) {
    return { nome: "Treino", idade: "Turma única", dias, horario };
}
function turmaKids(idade, dias, horario) {
    return { nome: "Kids", idade, dias, horario };
}
function turmaAdolescentes(dias, horario) {
    return { nome: "Juvenil", idade: "11 a 15 anos", dias, horario };
}
function turmaAdultos(dias, horario) {
    return { nome: "Adultos", idade: "A partir de 16 anos", dias, horario };
}

// Dados dos polos (respostas do formulário de 11/11/2026).
// mapa: coordenadas "lat,lng" para o pin ficar no lugar certo.
//       Sem coordenadas, o mapa busca pelo endereço.
// O que o Mestre Rad não informou aparece no site como "A confirmar".
// Quando o site tiver banco de dados, ele mesmo vai poder ajustar.
const polos = [
    // ---------- Rio de Janeiro ----------
    {
        nome: "PPG – Pavão-Pavãozinho",
        endereco: "R. Saint Roman, 76 (acesso pela Rua Papagaio) – Copacabana, Rio de Janeiro/RJ – CEP 22071-060",
        referencia: "Beco da Tintinha, na Segundinha",
        mapa: "-22.9809053,-43.1939797",
        professor: "Mestre Rad (Rogério Guedes)",
        whatsapp: "5521982121315",
        turmas: [
            turmaKids("5 a 10 anos", "Seg · Qua · Sex", "18h"),
            turmaAdolescentes("Seg · Qua · Sex", "19h"),
            turmaAdultos("Seg · Qua · Sex", "20h")
        ]
    },
    {
        nome: "Rocinha",
        endereco: "Quadra da Rua 1 – Rocinha, Rio de Janeiro/RJ – CEP 22451-971",
        referencia: "Na quadra da comunidade",
        mapa: "-22.9906911,-43.2458365", // pin aproximado (Rua Um)
        professor: "Fabio Bino",
        whatsapp: "5521997085082",
        turmas: [
            turmaGeral("Ter · Qui", "19h")
        ]
    },
    {
        nome: "Bola de Neve",
        endereco: "R. Assunção, 119 – Botafogo, Rio de Janeiro/RJ – CEP 22251-030",
        referencia: "Dentro da Igreja Bola de Neve",
        mapa: "-22.9444742,-43.1863265",
        professor: "Mestre Rad (Rogério Guedes)",
        whatsapp: "5521982121315",
        turmas: [
            turmaGeral("Qua", "20h")
        ]
    },
    {
        nome: "Ultra Botafogo",
        endereco: "R. São Clemente, 159 – Botafogo, Rio de Janeiro/RJ – CEP 22260-003",
        referencia: "Na academia",
        mapa: "-22.9504832,-43.1870939",
        professor: "Mestre Rad (Rogério Guedes)",
        whatsapp: "5521982121315",
        // Divisão não informada (nem no formulário, nem nas mensagens): turma única
        turmas: [
            turmaUnica("Seg", "9h"),
            turmaUnica("Ter · Qui", "21h"),
            turmaUnica("Qua · Sex", "5h30")
        ]
    },
    {
        nome: "Turano",
        endereco: "R. Aureliano Portugal, 220 – Rio Comprido, Rio de Janeiro/RJ – CEP 20261-004",
        referencia: "Dentro da ONG Fazendo Arte",
        mapa: "-22.9250419,-43.2142951",
        professor: "Léo Mendes",
        whatsapp: "5521983268448",
        turmas: [
            turmaGeral("Ter · Qui", "18h") // horário da mensagem de setembro
        ]
    },
    {
        nome: "Andaraí (Sede)",
        endereco: "R. Leopoldo, 71 – Andaraí, Rio de Janeiro/RJ – CEP 20541-170",
        referencia: "Dentro da Primeira Igreja Batista do Andaraí",
        mapa: "-22.9259096,-43.2504032",
        professor: "Rodrigo Figueiredo",
        whatsapp: "5521964450143",
        // Horários das mensagens de setembro ("seg a sex, 18h, 19h e 20h"),
        // no mesmo padrão do PPG (18h kids, 19h juvenil, 20h adultos).
        turmas: [
            turmaKids("5 a 10 anos", "Seg a Sex", "18h"),
            turmaAdolescentes("Seg a Sex", "19h"),
            turmaAdultos("Seg a Sex", "20h")
        ]
    },
    {
        nome: "Formiga",
        endereco: "R. Camaiore, 23 – Tijuca, Rio de Janeiro/RJ – CEP 20530-170",
        referencia: "Quadra da associação de moradores",
        mapa: "-22.9410274,-43.2437691",
        professor: "Roney Galvão",
        whatsapp: "5531994987656",
        // Marcou 2 turmas, mas só informou "20h"
        turmas: [
            turmaKids("5 a 15 anos", "Ter · Qui", "A confirmar"),
            turmaAdultos("Ter · Qui", "20h")
        ]
    },
    {
        nome: "Vila Isabel",
        endereco: "R. Barão de São Francisco, 295 – Andaraí, Rio de Janeiro/RJ – CEP 20541-371",
        referencia: "Na academia",
        mapa: "-22.9189367,-43.2511106",
        professor: "Guilherme Mompa",
        whatsapp: "5521994380493",
        turmas: [
            turmaGeral("Seg a Sex", "20h") // dias da mensagem de setembro
        ]
    },
    {
        nome: "Araruama",
        endereco: "Rua E-A, 75 – Residencial Victória, Morro Grande, Araruama/RJ – CEP 28986-468",
        referencia: "Dentro do condomínio, perto da padaria Favorita de Paracatu (antigo Casal 20)",
        mapa: "-22.8206549,-42.369331", // pin no Residencial Victória
        professor: "Maximilian Max",
        whatsapp: "5521994614901",
        turmas: [
            turmaKids("5 a 15 anos", "Seg a Qui", "18h"),
            turmaAdultos("Seg a Qui", "20h")
        ]
    },

    // ---------- Bahia ----------
    {
        nome: "Ibirataia",
        endereco: "R. Bom Jesus, s/n – Ibirataia/BA – CEP 45580-000",
        referencia: "Em cima da sorveteria da praça",
        mapa: "-14.0688813,-39.6385435",
        professor: "Gilmar de Souza",
        whatsapp: "5573999989587",
        turmas: [
            turmaKids("5 a 15 anos", "Ter · Qua · Qui", "18h"),
            turmaAdultos("Ter · Qua · Qui", "19h30")
        ]
    },
    {
        nome: "Nova Ibirataia",
        endereco: "Rua do Alto, 26 – Nova Ibirataia, Ibirataia/BA – CEP 45580-000",
        referencia: "Acima da rodoviária",
        mapa: "", // não encontramos no Google: o mapa busca pelo endereço
        professor: "Laerte e Laecyo Souza",
        whatsapp: "5573999698603",
        turmas: [
            turmaGeral("Ter · Qui", "19h")
        ]
    },
    {
        nome: "Algodão",
        endereco: "R. José Muniz Ferreira, s/n – Algodão, Ibirataia/BA – CEP 45580-000",
        referencia: "Dentro da escola",
        mapa: "-13.9309808,-39.6244055",
        professor: "Wellington Gegel",
        whatsapp: "5573999825763",
        turmas: [
            turmaKids("5 a 15 anos", "Ter · Qui", "19h"),
            turmaAdultos("Ter · Qui", "20h")
        ]
    },
    {
        nome: "Ipiaú",
        endereco: "R. Esperança, 46 – Euclides Neto, Ipiaú/BA – CEP 45570-000",
        referencia: "",
        mapa: "-14.1262911,-39.7393288",
        professor: "Fátima Gonçalves",
        whatsapp: "5573998256236",
        // Ele escreveu "19h e 29h": entendemos 19h e 20h
        turmas: [
            turmaKids("5 a 15 anos", "Seg · Qua · Sex", "19h"),
            turmaAdultos("Seg · Qua · Sex", "20h")
        ]
    }
];

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
mostrarPolo(0);

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
    .apoie-card
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
