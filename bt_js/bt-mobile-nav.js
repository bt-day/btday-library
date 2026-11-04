/* */

const mobileNav = document.querySelector(".bt-mobile-navi");
mobileNav.inert = true; // Drawer 초기 상태: 상호작용 차단
const accordionButtons = mobileNav.querySelectorAll(
    ":scope > ul > li > button[aria-controls]"
);


accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.getAttribute("aria-controls");
        const submenu = document.getElementById(targetId);

        if (!submenu) return;

        // ① 현재 열림 상태 확인
        const isOpen = button.getAttribute("aria-expanded") === "true";
        const nextOpen = !isOpen;

        // ② 현재 화면에 보이는 높이 측정
        const startHeight = submenu.getBoundingClientRect().height;

        // ③ 이전 애니메이션 중단
        submenu.getAnimations().forEach((animation) => {
            animation.cancel();
        });

        // ④ 펼쳐질 콘텐츠의 전체 높이 측정
        const targetHeight = submenu.scrollHeight;

        // ⑤ 다음 목표 높이 결정
        const endHeight = nextOpen ? targetHeight : 0;

        // 애니메이션 시작 전 현재 높이를 고정
        submenu.style.height = `${startHeight}px`;

        // ⑥ 버튼의 열림 상태 변경
        button.setAttribute("aria-expanded", String(nextOpen));

        // ⑦ 높이 애니메이션 실행
        const animation = submenu.animate(
            [
                { height: `${startHeight}px` },
                { height: `${endHeight}px` }
            ],
            {
                duration: 500,
                easing: "cubic-bezier(0.75, 0, 0.175, 1)"
            }
        );

        // ⑧ 애니메이션 종료 후 최종 높이 유지
        animation.onfinish = () => {
            submenu.style.height = nextOpen ? "auto" : "0px";
            animation.cancel();
        };
    });
});



// Drawer 제어 대상 찾기
const hamButton = document.querySelector(".ham-btn");
const drawerClose = document.querySelector(".bt-drawer-close");
const drawerOverlay = document.querySelector(".bt-drawer-overlay");

// Drawer 열기
function openDrawer() {
    drawerOverlay.hidden = false;
    mobileNav.inert = false;

    document.body.classList.add("bt-scroll-lock");

    mobileNav.classList.add("is-open");
    hamButton.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            drawerOverlay.classList.add("is-visible");
        });
    });

    // 추가: Drawer 내부 닫기 버튼으로 포커스 이동
    drawerClose.focus();
}

// Drawer 닫기
function closeDrawer() {
    mobileNav.classList.remove("is-open");
    hamButton.setAttribute("aria-expanded", "false");

    document.body.classList.remove("bt-scroll-lock");

    mobileNav.inert = true;
    drawerOverlay.classList.remove("is-visible");
}


// 이벤트 연결
hamButton.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

mobileNav.addEventListener("transitionend", (event) => {
    if (event.target !== mobileNav) return;
    if (event.propertyName !== "transform") return;

    if (!mobileNav.classList.contains("is-open")) {
        drawerOverlay.hidden = true;
    }
});


/* esc 닫기 지정  */
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!mobileNav.classList.contains("is-open")) return;

    closeDrawer();
    hamButton.focus();
});



// Drawer 내부 Focus Trap
mobileNav.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    if (!mobileNav.classList.contains("is-open")) return;

    const focusableElements = mobileNav.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const focusable = [...focusableElements].filter((element) => {
        return element.getClientRects().length > 0 &&
            !element.closest("[inert]");
    });

    if (focusable.length === 0) {
        event.preventDefault();
        return;
    }

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});


/*   */
