# Weather App

OpenWeatherMap API를 활용한 날씨 정보 조회 웹 애플리케이션입니다.  
현재 위치 기반 날씨 확인, 지역 검색, 즐겨찾기 관리 기능을 제공합니다.


## 프로젝트 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 작성합니다.

```env
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/3.0/onecall
```

- `VITE_WEATHER_API_KEY`: [OpenWeatherMap](https://openweathermap.org/api)에서 발급받은 API 키
- `VITE_WEATHER_API_BASE_URL`: One Call API 3.0 엔드포인트

> One Call API 3.0은 별도 구독이 필요합니다. OpenWeatherMap 대시보드에서 구독 후 사용 가능합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 구현 기능

### 현재 위치 날씨

- 브라우저 Geolocation API를 통한 자동 위치 감지
- 위치 권한 요청 UI 및 에러 처리
- 역지오코딩(좌표 → 주소 변환)으로 현재 위치명 표시
- 현재 기온, 체감 온도, 최저/최고 기온, 습도, 강수확률 표시

### 시간대별 예보

- 1시간 단위로 24시간 예보 제공
- 가로 스크롤 + 마우스 드래그 스크롤 지원
- 날짜가 바뀌는 시점에 "내일" 라벨 표시
- 시간별 기온, 날씨 아이콘, 강수확률 표시

### 지역 검색

- 한국 행정구역 검색
- 초성 검색 지원 (예: "ㅅㅇ" → "서울")
- 검색 매칭 점수 기반 결과 정렬
- 검색 키워드 하이라이트
- 검색 결과 선택 시 날씨 상세 페이지로 이동

### 즐겨찾기 관리

- 최대 6개 즐겨찾기 등록
- localStorage 기반 영구 저장
- 표시 이름 편집 기능
- 즐겨찾기 카드에 실시간 날씨 정보 표시

### 날씨 상세 페이지

- 선택한 지역의 상세 날씨 정보
- 현재 날씨 카드 (기온, 체감, 최저/최고, 습도, 강수확률)
- 24시간 시간대별 예보 스크롤
- 즐겨찾기 추가/제거 버튼

### 에러 처리

- Global Error Boundary로 예상치 못한 런타임 에러 시 흰 화면 방지
- 에러 발생 시 fallback UI 표시 (에러 메시지, 다시 시도, 홈으로 이동)
- 위치 권한 거부, API 실패, 네트워크 에러 등 상황별 에러 UI 제공
- React Query 기반 자동 재시도 (2회)

## 기술적 의사결정

### Feature-Sliced Design (FSD) 아키텍처

```
src/
├── app/          # 앱 진입점, 프로바이더, 글로벌 스타일
├── pages/        # 라우트별 페이지 컴포넌트
├── widgets/      # 여러 feature를 조합한 독립적 UI 블록
├── features/     # 사용자 인터랙션 단위 기능
├── entities/     # 도메인 모델, 비즈니스 로직, API
├── shared/       # 공용 유틸, 훅, 설정
└── data/         # 정적 데이터 (행정구역 JSON)
```

레이어 간 의존 방향이 `app → pages → widgets → features → entities → shared`로 단방향이라 모듈 간 결합도를 낮추고, 기능 단위로 코드를 찾고 수정하기 쉽도록 FSD 구조를 적용했습니다.

### Zustand + React Query 조합

- **Zustand**: 즐겨찾기처럼 로컬에서 관리하는 클라이언트 상태에 사용. `persist` 미들웨어로 localStorage 자동 동기화를 처리하고, Redux 대비 보일러플레이트가 적어 선택했습니다.
- **React Query**: 날씨 API 같은 서버 상태에 사용. 캐싱(5분 staleTime), 자동 재시도, 로딩/에러 상태 관리를 선언적으로 처리할 수 있어 서버 상태 관리에 적합합니다.

### OpenWeatherMap One Call API 3.0

OpenWeatherMap의 One Call API 3.0을 선택한 이유:

- **단일 요청**: current + hourly + daily 데이터를 한 번의 API 호출로 가져와 네트워크 요청 수를 줄임
- **1시간 단위 예보**: 기존 3시간 단위에서 1시간 단위(48시간)로 더 세밀한 시간대별 예보 제공
- **일별 최저/최고 기온**: `daily[0].temp.min/max`로 정확한 당일 최저/최고 기온 제공

### 검색 최적화

- 초성 추출 기반 검색으로 빠른 입력 지원
- 매칭 점수 시스템(정확 일치 > 시작 일치 > 포함 일치 > 초성 일치)으로 관련도 높은 결과를 상위에 노출
- 지오코딩 시 주소 정규화 및 다단계 폴백 전략(전체 주소 → 정규화 → 마지막 세그먼트)으로 좌표 변환 성공률 향상



## 기술 스택

| 분류             | 기술                                           |
| ---------------- | ---------------------------------------------- |
| Framework        | React 19, TypeScript                           |
| Build Tool       | Vite 7                                         |
| Styling          | Tailwind CSS 4                                 |
| State Management | Zustand, TanStack React Query                  |
| Routing          | React Router DOM                               |
| Icons            | Lucide React                                   |
| API              | OpenWeatherMap One Call API 3.0, Geocoding API |
