
/*   */

/* BTDAY Header Scroll Control */
function initHeader() {

    // ① Header 요소 찾기
    const header = document.querySelector("header");

    // Header가 없으면 초기화 중단
    if (!header) return;

    // ② 스크롤 상태를 변경하는 함수
    function updateHeaderState() {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
    }

    // ③ 스크롤 이벤트 등록
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    // ④ 현재 스크롤 위치에 맞춰 초기 상태 적용
    updateHeaderState();
}



/*   */
