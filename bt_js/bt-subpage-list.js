/*   */


function renderList(items, totalCount = items.length) {
    const list = document.querySelector(".subpage-list-box");
    const count = document.querySelector("#subpage-count");

    count.textContent = totalCount;

    // 결과 수량
    count.textContent = items.length;

    // 검색 및 필터 결과가 없을 때
    if (items.length === 0) {
        list.innerHTML = `
        <li class="subpage-list-empty">
            <p>No results found.</p>
            <span>Try a different keyword or filter.</span>
        </li>
    `;
        return;
    }

    // 목록 출력
    list.innerHTML = items.map((item) => `
        <li>
            <a href="${item.url || '#none'}">
                <div class="subpage-list-icon
                ${item.sourceStatus === "ready" ? "is-ready" : ""}
                ${item.category === "portfolio" && item.thumbnail ? "is-thumbnail" : ""} ">
                    <img src="${item.thumbnail || 'bt_assets/1depth/device-desktop.svg'}" alt="" />
                </div>

                <div class="subpage-list-cont">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>

                <div class="subpage-list-meta">
                    <p>
                        ${item.version ? `v${item.version} · ` : ""}

                        ${item.status ?? ""}
                    </p>
                    <span>View Details</span>
                </div>
            </a>
        </li>
    `).join("");
}



async function loadSubpageList() {
    try {
        // ① JSON 요청
        const response = await fetch("bt_data/bt-library.json");

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        // ② JSON 파싱
        const data = await response.json();

        // ③ URL에서 분류 확인
        const params = new URLSearchParams(window.location.search);

        const category = params.get("category") || "components";
        const subcategory = params.get("subcategory") || "navigation";

        // ④ 해당 분류의 entries 선택
        const filteredEntries = data.entries.filter((item) => {
            return item.category === category &&
                item.subcategory === subcategory;
        });


        // ⑤ URL의 Subcategory 기준으로 타이틀 출력
        const selectedCategory = data.categories.find(
            (item) => item.id === category
        );

        const selectedSubcategory = selectedCategory?.children.find(
            (item) => item.id === subcategory
        );

        if (selectedSubcategory) {
            document.querySelector(
                ".sub-main-common-title h3"
            ).textContent = selectedSubcategory.label;
        }



        // ⑥ 현재 Subcategory 기준으로 키워드 버튼 생성
        const keywordList = document.querySelector(".sub-keyword");

        // 현재 카테고리에서 사용 중인 Variant만 선택
        const variants = [
            ...new Set(filteredEntries.map((item) => item.variant))
        ];



        // variant를 서브키워드명과 필터 식별값으로 함께 사용
        keywordList.innerHTML = `
    <li>
        <button type="button" data-variant="all">All</button>
    </li>
    ${variants.map((variant) => {
            return `
            <li>
                <button type="button" data-variant="${variant}">
                    ${variant}
                </button>
            </li>
        `;
        }).join("")}
`;

        /*
        keywordList.innerHTML = `
            <li>
                <button type="button" data-variant="all">All</button>
            </li>
            ${variants.map((variant) => {
            const item = filteredEntries.find(
                (entry) => entry.variant === variant
            );

            const label = item.title.replace(/ Navigation$/, "");

            return `
                    <li>
                        <button type="button" data-variant="${variant}">
                            ${label}
                        </button>
                    </li>
                `;
        }).join("")}
        `; */



        // ⑥ URL 기반 Variant + Search 제어
        const filterButtons = document.querySelectorAll(
            ".sub-keyword button"
        );

        const searchForm = document.querySelector(
            "#bt-list-search-form"
        );

        const searchInput = document.querySelector(
            "#bt-list-search-input"
        );

        // 검색어 초기화 버튼
        const clearButton = document.querySelector(
            "#bt-list-search-form .bt-search-clear"
        );




        // Sort 셀렉터
        const sortSelect = document.querySelector("#subpage-sort");

        // Pagination 상태
        let currentPage = 1;
        const itemsPerPage = 10; // QA용, 완료 후 변경


        // 현재 정렬 기준에 따라 목록 정렬
        function sortEntries(items) {
            const sortedItems = [...items];

            if (sortSelect.value === "title-asc") {
                sortedItems.sort((a, b) =>
                    a.title.localeCompare(b.title, "en")
                );
            }

            if (sortSelect.value === "title-desc") {
                sortedItems.sort((a, b) =>
                    b.title.localeCompare(a.title, "en")
                );
            }

            return sortedItems;
        }



        // Pagination 제어 대상
        const pagination = document.querySelector(".subpage-pagenation");
        const pageNumbers = document.querySelector(".subpage-pagenation-no");
        const prevButton = document.querySelector(".subpage-prev");
        const nextButton = document.querySelector(".subpage-next");

        // 페이지 번호와 버튼 상태 출력
        function renderPagination(totalCount) {
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            // 한 페이지 이하일 때 숨김
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
            prevButton.disabled = currentPage <= 1;
            nextButton.disabled = currentPage >= totalPages;
        }



        // 페이지 번호 클릭
        pageNumbers.addEventListener("click", (event) => {
            const button = event.target.closest("[data-page]");
            if (!button) return;

            currentPage = Number(button.dataset.page);
            restoreListFromURL();
        });

        // 이전 페이지
        prevButton.addEventListener("click", () => {
            if (currentPage <= 1) return;

            currentPage--;
            restoreListFromURL();
        });

        // 다음 페이지
        nextButton.addEventListener("click", () => {
            currentPage++;
            restoreListFromURL();
        });





        // URL의 필터와 검색어를 읽어 목록 갱신
        function restoreListFromURL() {
            const params = new URLSearchParams(
                window.location.search
            );

            const urlVariant = params.get("variant");
            const searchValue = params.get("search") || "";
            const keyword = searchValue.trim().toLowerCase();

            const validVariant = filteredEntries.some(
                (item) => item.variant === urlVariant
            );

            const activeVariant = validVariant
                ? urlVariant
                : "all";

            // 검색창에 URL 검색어 반영
            searchInput.value = searchValue;

            // 검색어가 있으면 X 버튼 표시
            clearButton.hidden = searchInput.value.length === 0;


            // 필터 버튼 활성 상태
            filterButtons.forEach((button) => {
                button.classList.toggle(
                    "is-active",
                    button.dataset.variant === activeVariant
                );
            });

            // 1차: Variant 필터 적용
            const variantEntries = activeVariant === "all"
                ? filteredEntries
                : filteredEntries.filter(
                    (item) => item.variant === activeVariant
                );

            // 2차: 검색어 적용
            const visibleEntries = variantEntries.filter((item) => {
                const title = item.title.toLowerCase();
                const description = item.description.toLowerCase();

                return title.includes(keyword) ||
                    description.includes(keyword);
            });



            // 검색 및 필터 결과 정렬
            const sortedEntries = sortEntries(visibleEntries);

            // 전체 페이지 수 계산
            const totalPages = Math.ceil(
                sortedEntries.length / itemsPerPage
            );

            // 현재 페이지가 범위를 벗어나지 않도록 보정
            currentPage = Math.max(
                1,
                Math.min(currentPage, totalPages)
            );

            // 현재 페이지 데이터 추출
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            const pageItems = sortedEntries.slice(startIndex, endIndex);

            // 목록 및 페이지네이션 출력
            renderList(pageItems, sortedEntries.length);
            renderPagination(sortedEntries.length);


        }


        // Sort 셀렉터 변경 시 목록 재출력
        sortSelect.addEventListener("change", () => {
            currentPage = 1; // 추가
            restoreListFromURL();
        });


        // Variant 버튼 클릭 이벤트
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const url = new URL(window.location.href);
                const selectedVariant = button.dataset.variant;

                if (selectedVariant === "all") {
                    url.searchParams.delete("variant");
                } else {
                    url.searchParams.set("variant", selectedVariant);
                }

                if (url.href !== window.location.href) {
                    history.pushState({}, "", url);
                }

                currentPage = 1; // 추가
                restoreListFromURL();
            });
        });

        // 입력 중 X 버튼 표시 상태 변경
        searchInput.addEventListener("input", () => {
            clearButton.hidden = searchInput.value.length === 0;
        });



        // 수정 검색 폼 제출 이벤트
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const keyword = searchInput.value.trim();
            const url = new URL(window.location.href);

            if (keyword) {
                url.searchParams.set("search", keyword);
            } else {
                url.searchParams.delete("search");
            }

            if (url.href !== window.location.href) {
                history.pushState({}, "", url);
            }

            currentPage = 1; // 추가
            restoreListFromURL();
        });

        // 검색어 초기화 버튼 클릭 이벤트 — 바깥으로 이동
        clearButton.addEventListener("click", () => {
            searchInput.value = "";

            const url = new URL(window.location.href);
            url.searchParams.delete("search");

            if (url.href !== window.location.href) {
                history.pushState({}, "", url);
            }

            currentPage = 1;
            restoreListFromURL();
            searchInput.focus();
        });


        // 최초 실행
        restoreListFromURL();

        // 뒤로 가기 / 앞으로 가기
        window.addEventListener("popstate", () => {
            currentPage = 1;
            restoreListFromURL();
        });



    } catch (error) {
        console.error("2Depth 데이터 로딩 실패:", error);
    }
}


// 최초 실행
loadSubpageList();



/*   */
