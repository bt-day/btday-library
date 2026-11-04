/*   */


// Gallery 제어 대상
const gallerySlides = document.querySelectorAll(".bt-gallery-bg__slide");
const progressButtons = document.querySelectorAll(".bt-slider-progress__item");
const heroCategory = document.querySelector(".bt-hero h3");
const heroTitle = document.querySelector(".bt-hero h1");
const heroDescription = document.querySelector(".bt-hero p");




const galleryData = [
    {
        image: "bt_assets/images/bt-hero-gallery01-2560x1200.jpg",
        category: "COMPONENT",
        title: "Build Better Components, Create Better Experiences.",
        description: "Reusable components designed with clear responsibility, consistent structure, and practical patterns for real-world web interfaces and modern digital experiences."
    },
    {
        image: "bt_assets/images/bt-hero-gallery02-2560x1200.jpg",
        category: "PATTERNS",
        title: "Smart UI Patterns, Seamless Interactions.",
        description: "Practical interaction patterns built with clear state management, intuitive behavior, and responsive design for consistent user experiences across modern websites."
    },
    {
        image: "bt_assets/images/bt-hero-gallery03-2560x1200.jpg",
        category: "FOUNDATION",
        title: "Strong Foundations, Consistent Design.",
        description: "A scalable design foundation built on reusable tokens, typography, spacing, and layout principles to create consistent and maintainable web interfaces."
    },
    {
        image: "bt_assets/images/bt-hero-gallery04-2560x1200.jpg",
        category: "PROJECTS",
        title: "Real Projects, Practical Solutions.",
        description: "Explore real-world projects that bring design, responsive layouts, reusable components, and interactive UI patterns together into complete web experiences."
    }
];



let currentSlide = 0;
// 현재 슬라이드 번호 (배열은 0부터 시작)
let activeLayer = 0;
let isTransitioning = false;

const slideDuration = 2000; // 5초
const progressBars = document.querySelectorAll(".bt-slider-progress__bar");
let autoRollingTimer = null;
let progressAnimation = null;


gallerySlides[0].style.backgroundImage =
    `url("${galleryData[0].image}")`;



function updateHeroContent(index) {
    const slide = galleryData[index];

    heroCategory.textContent = slide.category;
    heroTitle.textContent = slide.title;
    heroDescription.textContent = slide.description;
}


function showSlide(index) {
    // 같은 슬라이드이거나 전환 중이면 실행하지 않음
    if (index === currentSlide || isTransitioning) return;

    isTransitioning = true;

    // 현재 레이어와 다음 레이어 구분
    const currentLayer = gallerySlides[activeLayer];
    const nextLayer = gallerySlides[1 - activeLayer];

    nextLayer.style.backgroundImage =
        `url("${galleryData[index].image}")`;

    // 레이어 쌓임 순서 설정
    nextLayer.style.zIndex = "1";
    currentLayer.style.zIndex = "0";

    // 다음 레이어 표시
    nextLayer.classList.add("is-active");
    updateHeroContent(index);

    // 전환 완료 후 상태 정리
    const handleTransitionEnd = (event) => {
        if (event.target !== nextLayer) return;
        if (event.propertyName !== "opacity") return;

        currentLayer.classList.remove("is-active");

        // 현재 이미지와 레이어 상태 갱신
        currentSlide = index;
        activeLayer = 1 - activeLayer;

        isTransitioning = false;
        startAutoRolling();

        nextLayer.removeEventListener("transitionend", handleTransitionEnd);
    };

    nextLayer.addEventListener("transitionend", handleTransitionEnd);
}


function nextSlide() {
    const nextIndex = (currentSlide + 1) % galleryData.length;

    showSlide(nextIndex);
}

// 프로그레스 슬라이더
function startAutoRolling() {
    // 이전 자동 전환 예약 제거
    clearTimeout(autoRollingTimer);

    // 이전 진행 바 애니메이션 중지
    if (progressAnimation) {
        progressAnimation.cancel();
    }

    // 모든 진행 바 초기화 단계별 다 차고서 진행
    /*
    progressBars.forEach((bar, index) => {
        bar.style.transform = index < currentSlide
            ? "scaleX(1)"
            : "scaleX(0)";
    });
    */

    // 한단계씩 진행상황 표시
    progressBars.forEach((bar) => {
        bar.style.transform = "scaleX(0)";
    });

    // 현재 슬라이드 진행 바 실행
    const currentBar = progressBars[currentSlide];

    progressAnimation = currentBar.animate(
        [
            { transform: "scaleX(0)" },
            { transform: "scaleX(1)" }
        ],
        {
            duration: slideDuration,
            easing: "linear",
            fill: "forwards"
        }
    );

    // 5초 후 다음 슬라이드
    autoRollingTimer = setTimeout(() => {
        nextSlide();
    }, slideDuration);
}



// Progress 버튼 클릭 이벤트
progressButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        showSlide(index);
    });
});



startAutoRolling();




/*   */
