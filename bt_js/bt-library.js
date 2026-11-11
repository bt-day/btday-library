/*   */



function renderLibrary(items, emptyType = "category", currentPage = 1, itemsPerPage = 6) {
    const list = document.querySelector(".subpage-subpd-box");

    if (!list) return;

    // ① 결과가 없는 경우
    if (items.length === 0) {
        const isSearch = emptyType === "search";

        list.innerHTML = `
            <li class="bt-empty-state">
                <div class="bt-empty-state__icon" aria-hidden="true">
                    ${isSearch ? "⌕" : "◇"}
                </div>
                <h3>
                    ${isSearch ? "No results found" : "Coming Soon"}
                </h3>
                <p>
                    ${isSearch
                ? "Try a different keyword or explore another category."
                : "New resources will be added to this category soon."}
                </p>
            </li>
        `;

    } else {
        // 현재 정렬 기준 확인
        const sortSelect = document.querySelector("#subpage-sort");
        const sortType = sortSelect ? sortSelect.value : "default";

        // 원본 배열 보호
        const sortedItems = [...items];

        if (sortType === "title-asc") {
            sortedItems.sort((a, b) =>
                a.title.localeCompare(b.title, "en")
            );
        }

        if (sortType === "title-desc") {
            sortedItems.sort((a, b) =>
                b.title.localeCompare(a.title, "en")
            );
        }

        // Pagination: 현재 페이지의 데이터 추출
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const pageItems = sortedItems.slice(startIndex, endIndex);

        // 카드 출력 + 2Depth 링크 연결
        list.innerHTML = pageItems.map((item) => `
            <li>
                ${item.url ? `
                    <a
                        class="bt-card-hitarea"
                        href="${item.url}"
                        aria-label="${item.title} 목록 보기"
                    ></a>
                ` : ""}

                <div class="subpd-box">
                    <div class="subpd-box-innerbx"></div>
                    <div class="subpd-boxinnertx"></div>
                    <div class="subpd-boxinnertx"></div>
                </div>
                <h3>${item.title}</h3>
            </li>
        `).join("");
    }


    // ③ 실제 결과 수 갱신
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
            aicreation: "Explore design AI Creation",
            projects: "Explore our web projects",
            portfolio: "Discover creative works"
        };

        // Pagination 상태
        let currentPage = 1;
        const itemsPerPage = 12;

        console.log("BTDAY Library 데이터:", data);
        console.log("카테고리:", data.categories);
        console.log("카드 목록:", data.items);

        // JSON 데이터를 카드 HTML로 출력
        renderLibrary(data.items);

        const buttons = document.querySelectorAll(".sub-keyword button");
        const searchForm = document.querySelector(".sub-search");
        const searchInput = document.querySelector("#search");
        const clearButton = document.querySelector(".bt-search-clear");

        // 현재 화면의 데이터 상태
        let currentItems = data.items;
        let currentEmptyType = "category";


        // 현재 페이지 데이터 렌더링
        function renderCurrentPage() {
            renderLibrary(
                currentItems,
                currentEmptyType,
                currentPage,
                itemsPerPage
            );
            renderPagination();
        }


        // Pagination 페이지 번호 출력
        function renderPagination() {
            const pagination = document.querySelector(".subpage-pagenation");
            const pageNumbers = document.querySelector(".subpage-pagenation-no");
            const prevButton = document.querySelector(".subpage-prev");
            const nextButton = document.querySelector(".subpage-next");

            const totalPages = Math.ceil(currentItems.length / itemsPerPage);

            // 한 페이지 이하라면 페이지네이션 숨김
            pagination.hidden = totalPages <= 1;

            // 페이지 번호 생성
            pageNumbers.innerHTML = Array.from(
                { length: totalPages },
                (_, index) => {
                    const page = index + 1;

                    return `
                <button
                    type="button"
                    data-page="${page}"
                    ${page === currentPage ? 'aria-current="page"' : ""}
                >
                    ${page}
                </button>
            `;
                }
            ).join("");

            // 이전 / 다음 버튼 상태
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }


        const pageNumbers = document.querySelector(".subpage-pagenation-no");
        const prevButton = document.querySelector(".subpage-prev");
        const nextButton = document.querySelector(".subpage-next");

        // 페이지 번호 클릭
        pageNumbers.addEventListener("click", (event) => {
            const button = event.target.closest("[data-page]");
            if (!button) return;

            currentPage = Number(button.dataset.page);
            renderCurrentPage();
        });

        // 이전 페이지
        prevButton.addEventListener("click", () => {
            if (currentPage <= 1) return;

            currentPage--;
            renderCurrentPage();
        });

        // 다음 페이지
        nextButton.addEventListener("click", () => {
            const totalPages = Math.ceil(currentItems.length / itemsPerPage);

            if (currentPage >= totalPages) return;

            currentPage++;
            renderCurrentPage();
        });



        // ① 카테고리 화면 처리: URL은 변경하지 않음
        function showCategory(category) {
            searchInput.value = "";
            updateClearButton();

            const filteredItems = category === "all"
                ? data.items
                : data.items.filter((item) => item.category === category);

            // 현재 목록 상태 갱신
            currentItems = filteredItems;
            currentEmptyType = "category";
            currentPage = 1;

            // 현재 페이지 출력
            renderCurrentPage();


            buttons.forEach((button) => {
                button.classList.toggle(
                    "is-active",
                    button.dataset.category === category
                );
            });

            if (category === "all") {
                renderPageTitle("Explore Library", "Browse all resources");
            } else {
                const selectedCategory = data.categories.find(
                    (item) => item.id === category
                );

                if (selectedCategory) {
                    renderPageTitle(
                        selectedCategory.label,
                        categorySubtitles[category]
                    );
                }
            }
        }

        // ② 실제 카테고리 클릭: URL 변경 + 화면 처리
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const category = button.dataset.category;
                const url = new URL(window.location.href);

                if (category === "all") {
                    url.searchParams.delete("category");
                } else {
                    url.searchParams.set("category", category);
                }

                url.searchParams.delete("search");

                history.pushState({}, "", url);

                showCategory(category);
            });
        });



        function searchLibrary() {
            const keyword = searchInput.value.trim().toLowerCase();

            const searchedItems = data.items.filter((item) => {
                return item.title.toLowerCase().includes(keyword);
            });

            // 현재 검색 결과 상태 갱신
            currentItems = searchedItems;
            currentEmptyType = "search";
            currentPage = 1;

            // 현재 페이지 출력
            renderCurrentPage();

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

            const keyword = searchInput.value.trim();
            const url = new URL(window.location.href);

            url.searchParams.delete("category");

            if (keyword) {
                url.searchParams.set("search", keyword);
            } else {
                url.searchParams.delete("search");
            }

            history.pushState({}, "", url);

            searchLibrary();
        });


        // 검색어 유무에 따라 X 버튼 표시
        function updateClearButton() {
            clearButton.hidden = searchInput.value.length === 0;
        }

        // 입력값 변경 감지
        searchInput.addEventListener("input", updateClearButton);

        // X 버튼 클릭
        clearButton.addEventListener("click", () => {
            searchInput.value = "";

            const url = new URL(window.location.href);

            url.searchParams.delete("search");
            url.searchParams.delete("category");

            history.pushState({}, "", url);

            updateClearButton();
            searchLibrary();
            searchInput.focus();
        });

        // 최초 페이지 진입 시 버튼 상태 확인
        updateClearButton();



        // 검색어를 모두 지웠을 때 URL과 화면 초기화
        searchInput.addEventListener("input", () => {
            if (searchInput.value === "") {

                const url = new URL(window.location.href);

                url.searchParams.delete("search");
                url.searchParams.delete("category");

                if (url.href !== window.location.href) {
                    history.pushState({}, "", url);
                }

                searchLibrary();
            }
        });



        // ③ 현재 URL을 읽어서 화면 상태 복원
        function restoreFromURL() {
            const params = new URLSearchParams(window.location.search);

            const urlKeyword = params.get("search");
            const urlCategory = params.get("category");

            if (urlKeyword !== null) {
                searchInput.value = urlKeyword;
                updateClearButton();
                searchLibrary();

            } else {
                const validCategory = data.categories.some(
                    (item) => item.id === urlCategory
                );

                const category = validCategory ? urlCategory : "all";

                showCategory(category);
            }
        }


        // Sort 셀렉터 상태 변경
        const sortSelect = document.querySelector("#subpage-sort");

        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                restoreFromURL();
            });
        }


        // 최초 페이지 진입
        restoreFromURL();

        // 브라우저 뒤로 가기 / 앞으로 가기
        window.addEventListener("popstate", restoreFromURL);



    } catch (error) {
        console.error("라이브러리 데이터 로딩 실패:", error);
    }
}

loadLibrary();




/*   */
