
/* BT Detail — Live Preview Device Switch v1.0 */

// 1. 필요한 요소 찾아오기
const deviceButtons = document.querySelectorAll(
    ".right-icon-group button[data-device]"
);

const previewFrame = document.querySelector(
    ".live-preview-inner-iframe iframe"
);

// 2. 디바이스별 iframe 너비
const deviceWidths = {
    desktop: "min(100%, 900px)",
    tablet: "min(100%, 768px)",
    mobile: "min(100%, 320px)"
};


// 3. 버튼 클릭 시 실행
if (previewFrame && deviceButtons.length) {
    deviceButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const selectedDevice = button.dataset.device;

            // iframe 너비 변경
            previewFrame.style.width = deviceWidths[selectedDevice];

            // 버튼 선택 상태 변경
            deviceButtons.forEach((item) => {
                item.setAttribute(
                    "aria-pressed",
                    String(item === button)
                );
            });

        });
    });
}



/* BT Detail — Source Code Button Switch v1.0 */

// 1. 코드 선택 버튼 찾아오기
const codeButtons = document.querySelectorAll(
    ".bt-code-edit-keyword-btn button[data-code]"
);

// 2. 에디터 상단 제목 찾아오기
const codeTitle = document.querySelector(
    ".bt-code-edit-board-title h3"
);

// 3. 선택한 버튼에 표시할 제목
const codeTitles = {
    html: "MARKUP(HTML)",
    css: "STYLESHEET(CSS)",
    js: "JAVASCRIPT(JS)",
    overview: "OVERVIEW"
};

const sourceCode = document.querySelector("#bt-source-code");


// STEP 03 — 실제 소스 파일 경로
const sourceFiles = {
    html: sourceCode?.dataset.html,
    css: sourceCode?.dataset.css,
    js: sourceCode?.dataset.js,
    overview: sourceCode?.dataset.overview
};


// 실제 Source Code 파일 요청
async function loadSource(type) {

    const filePath = sourceFiles[type];
    if (!filePath) return;

    sourceCode.textContent = `Loading ${type.toUpperCase()}...`;

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const sourceText = await response.text();

        // 다른 탭으로 이동했다면 이전 응답은 출력하지 않음
        const selectedCode = document.querySelector(
            '.bt-code-edit-keyword-btn button[aria-pressed="true"]'
        )?.dataset.code;

        if (selectedCode !== type) return;

        sourceCode.textContent = sourceText;

    } catch (error) {

        const selectedCode = document.querySelector(
            '.bt-code-edit-keyword-btn button[aria-pressed="true"]'
        )?.dataset.code;

        if (selectedCode !== type) return;

        console.error(`${type} 소스 로딩 실패:`, error);
        sourceCode.textContent = `${type.toUpperCase()} 파일을 불러오지 못했습니다.`;
    }
}



// 4. 버튼 클릭 이벤트
if (codeButtons.length && codeTitle && sourceCode) {

    loadSource("html");

    codeButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const selectedCode = button.dataset.code;

            // 선택된 버튼 상태 변경
            codeButtons.forEach((item) => {
                item.setAttribute(
                    "aria-pressed",
                    String(item === button)
                );
            });

            // 에디터 제목 변경
            codeTitle.textContent = codeTitles[selectedCode];

            if (sourceFiles[selectedCode]) {
                loadSource(selectedCode);
            }

        });
    });
}



/* BT Detail — Source Code Copy v1.0 */

// Copy 버튼과 오른쪽 상태 텍스트 찾아오기
const copyButton = document.querySelector(
    ".bt-code-edit-board-title-right button"
);

const copyLabel = document.querySelector(
    ".bt-code-edit-board-title-right p"
);

// 선택된 탭의 언어 표시
const codeLabels = {
    html: "HTML",
    css: "CSS",
    js: "JS",
    overview: "INFO"
};


let copyFeedbackTimer;

if (copyButton && copyLabel && sourceCode) {

    // 현재 선택된 탭 확인
    function getSelectedCode() {
        return document.querySelector(
            '.bt-code-edit-keyword-btn button[aria-pressed="true"]'
        )?.dataset.code || "html";
    }

    // 언어 표시 갱신
    function updateCopyLabel() {
        const selectedCode = getSelectedCode();
        copyLabel.textContent = codeLabels[selectedCode];
        copyButton.hidden = selectedCode === "overview";
    }

    // 탭 변경 시 언어 표시도 갱신
    codeButtons.forEach((button) => {
        button.addEventListener("click", updateCopyLabel);
    });

    clearTimeout(copyFeedbackTimer);

    // 최초 언어 표시
    updateCopyLabel();

    // Copy 버튼 클릭
    copyButton.addEventListener("click", async () => {
        const selectedCode = getSelectedCode();

        // Overview는 복사 대상에서 제외
        if (selectedCode === "overview") return;

        try {
            // 현재 화면의 코드 문자열 복사
            await navigator.clipboard.writeText(
                sourceCode.textContent
            );

            // 복사 성공 피드백
            copyLabel.textContent = "Copied!";

            clearTimeout(copyFeedbackTimer);
            copyFeedbackTimer = setTimeout(() => {
                updateCopyLabel();
            }, 1000);


        } catch (error) {
            console.error("코드 복사 실패:", error);
            copyLabel.textContent = "Copy failed";
        }
    });
}

