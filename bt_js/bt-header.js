
/*   */


const header = document.querySelector("header");

function updateHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });

updateHeaderState();



/*   */
