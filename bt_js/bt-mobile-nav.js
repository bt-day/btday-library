const mobileNav = document.querySelector(".bt-mobile-navi");

const accordionButtons = mobileNav.querySelectorAll(
    ":scope > ul > li > button[aria-controls]"
);

accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.getAttribute("aria-controls");
        const submenu = document.getElementById(targetId);

        if (!submenu) return;

        const isOpen = button.getAttribute("aria-expanded") === "true";
        const nextOpen = !isOpen;

        button.setAttribute("aria-expanded", String(nextOpen));

    });
});
