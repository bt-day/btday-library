/* */


/* BTDAY AJAX Include v1.0 */

// ① 공통 HTML을 불러와 삽입하는 함수
async function loadInclude(selector, url) {

    // HTML을 삽입할 위치 찾기
    const placeholder = document.querySelector(selector);

    if (!placeholder) return false;

    try {
        // ② HTML 파일 요청
        const response = await fetch(url);

        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`Include 요청 실패: ${response.status}`);
        }

        // ③ 응답 데이터를 HTML 문자열로 변환
        const html = await response.text();

        // ④ HTML 삽입
        placeholder.insertAdjacentHTML("beforebegin", html);

        // 임시 요소 제거
        placeholder.remove();

        return true;

    } catch (error) {
        console.error(`[BTDAY Include] ${url}`, error);
        return false;
    }
}


// ⑤ Include 실행 순서 제어
async function initIncludes() {

    // Header HTML 삽입 완료까지 기다리기
    const headerLoaded = await loadInclude(
        "#bt-header-include",
        "bt_includes/bt-header.html"
    );

    // Header 삽입에 성공했을 때만 초기화
    if (headerLoaded) {
        initHeader();
        initMobileNav();

    }

    // Footer HTML 삽입
    await loadInclude(
        "#bt-footer-include",
        "bt_includes/bt_footer.html"
    );
}


// ⑥ AJAX Include 시작
initIncludes();



/*.  */
