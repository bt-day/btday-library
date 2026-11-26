const marquee = document.querySelector(".bt-marquee");

// Marquee 내부의 모든 Track 찾아오기
const tracks = marquee.querySelectorAll(".bt-marquee__track");

// 각 Track에 독립적으로 롤링 기능 적용
tracks.forEach((track) => {

    // 현재 Track에 속한 원본 카드 탐색
    const items = track.querySelectorAll(".bt-marquee__item");

    // 원본 카드 그룹을 2번 복제
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

    // 현재 Track의 이동 거리 계산
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

});
