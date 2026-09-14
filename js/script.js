const btn = document.getElementById("btn-nav");
const menu = document.getElementById("nav-mobile");
btn.addEventListener("click", () => {
    btn.classList.toggle("fa-bars");
    btn.classList.toggle("fa-x");
    menu.classList.toggle("invisivel");
});