const marquee = document.querySelector(".bt-marquee");
const track = marquee.querySelector(".bt-marquee__track");
const items = track.querySelectorAll(".bt-marquee__item");

// 원본 카드 6개를 2번 복제
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




