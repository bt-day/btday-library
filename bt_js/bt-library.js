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
                        aria-label="${item.title} ${item.isEntry ? '상세 보기' : '목록 보기'}"
                    ></a>
                ` : ""}

                <div class="subpd-box">
                    <div class="subpd-box-innerbx">
                        <div class="subpd-box-innerbx-no ${item.sourceStatus === "ready" ? "is-ready" : ""}">
                            ${item.symbol ?? "N"}
                        </div>

                        <div class="subpd-box-innerbx-title">
                            <h3>${item.cardHeading ?? "네비게이션 모음"}</h3>
                            <p>${item.description ?? "1depth, 2depth..."}</p>
                        </div>
                    </div>

                    <div class="subpd-boxinnertx">
                        <h3>${item.year ?? "2026"}</h3>
                        <p>${item.field ?? "웹개발 구성"}</p>
                    </div>
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





        // 통합검색 결과를 2Depth 목록 UI로 출력
        function renderSearchList() {
            const list = document.querySelector(".subpage-list-box");
            const count = document.querySelector("#subpage-count");
            const sortSelect = document.querySelector("#subpage-sort");

            // ① 원본 배열을 보호하면서 정렬
            const sortedItems = [...currentItems];

            if (sortSelect?.value === "title-asc") {
                sortedItems.sort((a, b) =>
                    a.title.localeCompare(b.title, "en")
                );
            }

            if (sortSelect?.value === "title-desc") {
                sortedItems.sort((a, b) =>
                    b.title.localeCompare(a.title, "en")
                );
            }

            // ② 현재 페이지에 출력할 데이터 추출
            const startIndex = (currentPage - 1) * itemsPerPage;
            const pageItems = sortedItems.slice(
                startIndex,
                startIndex + itemsPerPage
            );

            // ③ 전체 검색 결과 개수
            count.textContent = currentItems.length;

            // ④ 검색 결과가 없는 경우
            if (currentItems.length === 0) {
                list.innerHTML = `
                    <li class="subpage-list-empty">
                        <p>No results found.</p>
                        <span>Try a different keyword.</span>
                    </li>
                `;
                return;
            }

            // ⑤ 기존 2Depth 목록 구조 재사용
            list.innerHTML = pageItems.map((item) => `
                <li>
                    <a href="${item.url}">
                        <div class="subpage-list-icon
                            ${item.sourceStatus === "ready" ? "is-ready" : ""}
                            ${item.category === "portfolio" && item.thumbnail ? "is-thumbnail" : ""}">
                            <img
                                src="${item.thumbnail || 'bt_assets/1depth/device-desktop.svg'}"
                                alt=""
                            />
                        </div>

                        <div class="subpage-list-cont">
                            <h3>${item.title}</h3>
                            <p>${item.description ?? ""}</p>
                        </div>

                        <div class="subpage-list-meta">
                            <p>${item.isEntry
                    ? (item.version
                        ? `v${item.version} · ${item.status ?? ""}`
                        : item.status ?? "")
                    : "Category"}</p>
                            <span>View Details</span>
                        </div>
                    </a>
                </li>
            `).join("");
        }




        function renderCurrentPage() {
            // ① 출력 영역 찾기
            const categoryList = document.querySelector(".subpage-subpd-box");
            const searchList = document.querySelector(".subpage-list-box");

            // ② 현재 화면이 검색 상태인지 확인
            const isSearch = currentEmptyType === "search" &&
                searchInput.value.trim() !== "";

            // ③ 검색 상태에 따라 출력 영역 전환
            categoryList.hidden = isSearch;
            searchList.hidden = !isSearch;

            if (isSearch) {
                // 통합검색: 2Depth 목록 UI
                renderSearchList();
            } else {
                // 일반 탐색: 기존 1Depth 카드 UI
                renderLibrary(
                    currentItems,
                    currentEmptyType,
                    currentPage,
                    itemsPerPage
                );
            }

            // ④ 페이지네이션은 공통 사용
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

            // 검색어가 없다면 기존 전체 카테고리 화면으로 복귀
            if (!keyword) {
                showCategory("all");
                return;
            }

            // ① 기존 1Depth·2Depth 카테고리 카드 검색
            const searchedItems = data.items.filter((item) => {
                const searchText = [
                    item.title,
                    item.cardHeading,
                    item.description
                ].filter(Boolean).join(" ").toLowerCase();

                return searchText.includes(keyword);
            });

            // ② 개별 컴포넌트·포트폴리오 검색
            const searchedEntries = data.entries
                .filter((entry) => {
                    // 이동할 상세페이지가 없는 자료는 제외
                    if (!entry.url) return false;

                    const category = data.categories.find(
                        (item) => item.id === entry.category
                    );

                    const subcategory = category?.children?.find(
                        (item) => item.id === entry.subcategory
                    );

                    const searchText = [
                        entry.title,
                        entry.description,
                        category?.label,
                        subcategory?.label
                    ].filter(Boolean).join(" ").toLowerCase();

                    return searchText.includes(keyword);
                })
                .map((entry) => {
                    const category = data.categories.find(
                        (item) => item.id === entry.category
                    );

                    const subcategory = category?.children?.find(
                        (item) => item.id === entry.subcategory
                    );

                    // 기존 renderLibrary() 카드 형식에 맞추기
                    return {
                        ...entry,
                        isEntry: true,
                        cardHeading: [
                            category?.label,
                            subcategory?.label
                        ].filter(Boolean).join(" · "),
                        symbol: entry.title.charAt(0).toUpperCase(),
                        year: /^\d{4}$/.test(entry.status)
                            ? entry.status
                            : "2026",
                        field: "Library Entry"
                    };
                });

            // ③ 두 검색 결과를 하나로 합치기
            currentItems = [...searchedItems, ...searchedEntries];
            currentEmptyType = "search";
            currentPage = 1;

            // ④ 기존 렌더링·페이지네이션 재사용
            renderCurrentPage();

            renderPageTitle(
                "Search Results",
                `Results for "${searchInput.value.trim()}"`
            );

            // ⑤ 기존 카테고리 버튼 상태 유지
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
