const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
        menuToggle.innerHTML =
            '<img src="./assets/icons/d10-white.svg" alt="Cerrar menú" width="30" height="30" />';
    } else {
        menuToggle.innerHTML =
            '<img src="./assets/icons/d20-white.svg" alt="Abrir menú" width="30" height="30" />';
    }
});
