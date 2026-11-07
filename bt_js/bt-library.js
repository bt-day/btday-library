/*   */



function renderLibrary(items) {
    const list = document.querySelector(".subpage-subpd-box");

    if (!list) return;

    list.innerHTML = items.map((item) => `
    <li>
      <div class="subpd-box">
        <div class="subpd-box-innerbx"></div>
        <div class="subpd-boxinnertx"></div>
        <div class="subpd-boxinnertx"></div>
      </div>
      <h3>${item.title}</h3>
    </li>
  `).join("");

    // 결과 수 갱신
    const count = document.querySelector("#subpage-count");

    if (count) {
        count.textContent = items.length;
    }
}


// 타이틀 출력함수 추가
function renderPageTitle(title, subtitle) {
    const titleElement = document.querySelector(
        ".sub-main-common-title h3"
    );

    const subtitleElement = document.querySelector(
        ".sub-main-common-title p"
    );

    if (!titleElement || !subtitleElement) return;

    titleElement.textContent = title;
    subtitleElement.textContent = subtitle;
}


async function loadLibrary() {
    try {
        const response = await fetch("bt_data/bt-library.json");

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();
        const categorySubtitles = {
            components: "Explore reusable UI components",
            patterns: "Discover interface patterns",
            foundation: "Explore design foundations",
            guides: "Browse practical guides",
            projects: "Explore our web projects",
            portfolio: "Discover creative works"
        };

        console.log("BTDAY Library 데이터:", data);
        console.log("카테고리:", data.categories);
        console.log("카드 목록:", data.items);

        // JSON 데이터를 카드 HTML로 출력
        renderLibrary(data.items);

        const buttons = document.querySelectorAll(".sub-keyword button");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {

                const category = button.dataset.category;

                const filteredItems = category === "all"
                    ? data.items
                    : data.items.filter((item) => item.category === category);

                renderLibrary(filteredItems);

                buttons.forEach((btn) => {
                    btn.classList.remove("is-active");
                });

                button.classList.add("is-active");

                if (category === "all") {
                    renderPageTitle("Explore Library", "Browse all resources");
                } else {
                    const selectedCategory = data.categories.find(
                        (item) => item.id === category
                    );

                    renderPageTitle(
                        selectedCategory.label,
                        categorySubtitles[category]
                    );
                }

            });
        });


        // 검색 폼과 입력창 가져오기
        const searchForm = document.querySelector(".sub-search");
        const searchInput = document.querySelector("#search");


        function searchLibrary() {
            const keyword = searchInput.value.trim().toLowerCase();

            const searchedItems = data.items.filter((item) => {
                return item.title.toLowerCase().includes(keyword);
            });

            renderLibrary(searchedItems);

            if (keyword) {
                renderPageTitle(
                    "Search Results",
                    `Results for "${searchInput.value.trim()}"`
                );
            } else {
                renderPageTitle("Explore Library", "Browse all resources");
            }

            buttons.forEach((button) => {
                button.classList.remove("is-active");
            });

            document
                .querySelector('[data-category="all"]')
                .classList.add("is-active");
        }

        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            searchLibrary();
        });

        const params = new URLSearchParams(window.location.search);
        const urlKeyword = params.get("search");

        if (urlKeyword !== null) {
            searchInput.value = urlKeyword;
            searchLibrary();
        }


    } catch (error) {
        console.error("라이브러리 데이터 로딩 실패:", error);
    }
}

loadLibrary();




/*   */
