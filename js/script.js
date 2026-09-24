const btn = document.getElementById("btn-nav");
const menu = document.getElementById("nav-mobile");
btn.addEventListener("click", () => {
    btn.classList.toggle("fa-bars");
    btn.classList.toggle("fa-x");
    menu.classList.toggle("invisivel");
});

const nav = document.querySelector(".nav-container");
window.addEventListener("scroll", () => {
    nav.classList.toggle("rolado", window.scrollY > 50);
});

// CONTADOR
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