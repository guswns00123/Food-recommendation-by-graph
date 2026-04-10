# Food Recommendation by Graph

레시피 데이터를 그래프 구조로 변환하여 재료 기반 음식 추천을 제공하는 웹 애플리케이션입니다.  
홍콩중문대(CUHK) 졸업 프로젝트 (2인 팀, 2023.09 ~ 2024.04)

## Demo

> 그래프 시각화 웹 앱에서 재료를 검색하면 유사 레시피 Top 5를 추천합니다.

![Graph Visualization](./src/Overall_UI.png)

## Architecture

```
food.com
  │
  └─ crawlers/ (Scrapy + Selenium)
       │  레시피명, 재료, 영양정보 수집
       ▼
  foods.json (원본 데이터)
       │
       └─ Transform (Python)
            │  수식어 제거, 재료명 정규화
            │  3,240 → 2,670개 통합 (17.6% 중복 제거)
            ▼
       NetworkX Graph → Gephi → final.gexf
                                     │
                                     ▼
                          React + Sigma.js (웹 앱)
```

## Tech Stack

| 역할 | 기술 |
|------|------|
| 데이터 수집 | Scrapy 2.11, Selenium 4.26 |
| 데이터 처리 | Python, Pandas |
| 그래프 변환 | NetworkX, Gephi |
| 프론트엔드 | React, TypeScript, Vite |
| 그래프 렌더링 | Sigma.js (GEXF 포맷) |
| 패키지 관리 | Poetry (Python), npm (JS) |
| 컨테이너화 | Docker, Docker Compose |

## Project Structure

```
food-recommendation-by-graph/
├── food_crawl/                # Scrapy 크롤러
│   ├── food_crawl/
│   │   ├── spiders/
│   │   │   └── crawl.py       # 메인 크롤러 (Scrapy + Selenium)
│   │   ├── items.py
│   │   ├── pipelines.py       # 배치 저장 파이프라인 (50건 단위)
│   │   └── settings.py
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pyproject.toml
├── graph/                     # 그래프 데이터 (노드 수별)
│   ├── final_100.gexf
│   ├── final_200.gexf
│   ├── final_507.gexf
│   └── final_1007.gexf
├── src/                       # React 웹 애플리케이션
│   ├── main.tsx               # 메인 그래프 시각화
│   ├── NodeDetail.tsx         # 레시피 상세 페이지
│   └── RecipeDetail.tsx
└── data/
    └── foods.json             # 수집된 레시피 원본 데이터
```

## Setup & Run

### 1. 크롤러 실행

```bash
cd food_crawl
docker-compose up --build
```

또는 로컬 실행:

```bash
cd food_crawl
poetry install
poetry run scrapy crawl food_crawl
```

### 2. 웹 앱 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## Key Implementation

### 재료명 정규화 알고리즘

동일한 재료의 다양한 표현을 통합합니다.

```
"fresh garlic" → "garlic"
"minced onions" → "onion"
"large eggs" → "egg"
```

- 수식어 제거 (fresh, minced, large, chopped 등)
- 복수형 → 단수형 통일
- **결과**: 3,240개 → 2,670개 재료 (17.6% 중복 제거)

### 그래프 구조

- **노드**: 레시피, 재료, 요리 유형, 요리 스타일
- **엣지**: 레시피-재료 연결 관계
- **추천 알고리즘**: Random Walk 기반 유사도 + K-Core 핵심 네트워크 추출

### 크롤링 전략

- Scrapy: 메타데이터 (레시피명, 재료) 수집 — 정적 HTML 파싱
- Selenium: 영양정보 모달 수집 — JavaScript 렌더링 필요
- 배치 처리: 50건 단위로 JSON 저장 (메모리 효율화)

## Results

| 그래프 크기 | 노드 수 | 활용 |
|------------|--------|------|
| small | 100 | 테스트용 |
| medium | 200 | 데모용 |
| large | 507 | 기본 배포 |
| full | 1,007 | 전체 데이터 |

## Improvements (Known Limitations)

- 증분 수집 미구현 — 현재 전체 재수집 방식
- 스케줄링 자동화 없음 — Airflow 연동 미적용
- CSV 저장 한계 — RDBMS 적재로 개선 여지
