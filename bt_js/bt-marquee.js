
const marquee = document.querySelector(".bt-marquee");
const track = marquee.querySelector(".bt-marquee__track");

// AJAX 준비 전 롤링 정지
track.style.animationPlayState = "paused";

// 1. JSON 데이터 요청
async function loadMarquee() {
    try {
        const response = await fetch("bt_data/bt-marquee-data.json");

        if (!response.ok) {
            throw new Error(`JSON 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        // 2. JSON 데이터로 원본 카드 생성
        data.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "bt-marquee__item";

            const link = document.createElement("a");
            link.className = "bt-marquee__link";
            link.href = item.url;

            const image = document.createElement("img");
            image.className = "bt-marquee__media";
            image.src = item.image;
            image.alt = item.title;

            const contents = document.createElement("div");
            contents.className = "bt-marquee__conts";

            const title = document.createElement("h3");
            title.textContent = item.title;

            const description = document.createElement("p");
            description.textContent = item.description;

            contents.append(title, description);
            link.append(image, contents);
            card.append(link);
            track.append(card);
        });

        // 3. 원본 카드 렌더링 후 롤링 초기화
        initMarquee();

    } catch (error) {
        console.error("Marquee 데이터 로딩 실패:", error);
    }
}

// 4. 기존 Marquee 동작 초기화
function initMarquee() {
    const items = track.querySelectorAll(".bt-marquee__item");

    if (items.length === 0) return;

    // 원본 카드를 2번 복제
    for (let i = 0; i < 2; i++) {
        items.forEach((item) => {
            const clone = item.cloneNode(true);

            clone.setAttribute("aria-hidden", "true");

            clone.querySelectorAll("a").forEach((link) => {
                link.setAttribute("tabindex", "-1");
            });

            track.append(clone);
        });
    }

    // 원본 그룹 한 주기의 실제 이동 거리 계산
    function updateMarqueeDistance() {
        const distance =
            track.children[items.length].offsetLeft -
            track.children[0].offsetLeft;

        track.style.setProperty(
            "--bt-marquee-distance",
            `${distance}px`
        );
    }

    updateMarqueeDistance();

    window.addEventListener("resize", updateMarqueeDistance);

    // 준비 완료 후 롤링 시작
    track.style.removeProperty("animation-play-state");
}

// AJAX 실행
loadMarquee();


