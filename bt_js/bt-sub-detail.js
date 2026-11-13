
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
    desktop: "1200px",
    tablet: "768px",
    mobile: "min(100%, 390px)"
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
