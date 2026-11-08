/* BTDAY Index Search UI v1.0 */

function initIndexSearch() {
    // ① 검색창과 X 버튼 찾기
    const searchInput = document.querySelector(".main-search input");
    const clearButton = document.querySelector(".main-search .bt-search-clear");

    // 해당 요소가 없는 페이지에서는 실행 중단
    if (!searchInput || !clearButton) return;

    // ② X 버튼 표시 상태 갱신
    function updateClearButton() {
        clearButton.hidden = searchInput.value.length === 0;
    }

    // ③ 입력값이 변경될 때
    searchInput.addEventListener("input", updateClearButton);

    // ④ X 버튼을 클릭했을 때
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        updateClearButton();
        searchInput.focus();
    });

    // ⑤ 최초 상태 확인
    updateClearButton();
}

initIndexSearch();




/*   */
