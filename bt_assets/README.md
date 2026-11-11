# BTDAY Category Icon Set v1.0

총 27개 SVG: 1Depth 6개 (All 포함), 2Depth 21개.

## 폴더 규칙
- `1depth/`: 전체 검색 필터의 대분류 아이콘
- `2depth/`: GNB PC/Mobile 2Depth 메뉴와 1Depth 카드 제목에 공통 활용할 서브카테고리 아이콘
- 파일명은 JSON의 카테고리 `id` / `subcategory` 값과 일치시켰습니다.

## 디자인 속성
- 24 × 24 viewBox / 라인 1.8px / round cap 및 join
- `stroke="currentColor"`: inline SVG일 경우 부모 CSS color를 상속합니다.
- `<img src="...">` 방식으로 로드하면 외부 CSS `color`로 SVG 선 색상 변경은 불가능합니다. 이 경우 SVG의 `currentColor`를 원하는 고정 색상으로 교체하거나 CSS `filter`/`mask` 사용을 검토하세요.
- 모든 파일은 외부 폰트, 라이브러리, 이미지 의존성이 없는 독립 SVG입니다.

## 권장 위치
- `bt_assets/icon-svg/1depth/`
- `bt_assets/icon-svg/2depth/`

## 매핑 (JSON / 링크 이름)

### 1depth
- `all` → `1depth/all.svg`
- `components` → `1depth/components.svg`
- `patterns` → `1depth/patterns.svg`
- `aicreation` → `1depth/aicreation.svg`
- `projects` → `1depth/projects.svg`
- `portfolio` → `1depth/portfolio.svg`

### 2depth
- `navigation` → `2depth/navigation.svg`
- `button` → `2depth/button.svg`
- `form-input` → `2depth/form-input.svg`
- `modal-popup` → `2depth/modal-popup.svg`
- `table-board` → `2depth/table-board.svg`
- `card` → `2depth/card.svg`
- `header-footer` → `2depth/header-footer.svg`
- `search-filter` → `2depth/search-filter.svg`
- `gallery-slider` → `2depth/gallery-slider.svg`
- `pagination` → `2depth/pagination.svg`
- `responsive-ui` → `2depth/responsive-ui.svg`
- `shorts-video` → `2depth/shorts-video.svg`
- `product-composite` → `2depth/product-composite.svg`
- `product-detail-page` → `2depth/product-detail-page.svg`
- `diva-page` → `2depth/diva-page.svg`
- `mjm-modern-web` → `2depth/mjm-modern-web.svg`
- `btday-showcase` → `2depth/btday-showcase.svg`
- `banner` → `2depth/banner.svg`
- `detail` → `2depth/detail.svg`
- `website` → `2depth/website.svg`
- `photo` → `2depth/photo.svg`

## 예시
```html
<img src="bt_assets/icon-svg/2depth/navigation.svg" width="20" height="20" alt="" aria-hidden="true">
```

지금은 **SVG 자산만 제공**합니다. HTML·JS·JSON에 대한 실제 적용은 기존 소스 확인 후 단계별로 진행하세요.
