# PETNER Frontend

> 반려동물과 사람을 연결하는 입양 플랫폼

React + TypeScript + Vite 기반의 PETNER 프론트엔드 애플리케이션입니다.

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경변수 설정](#환경변수-설정)
- [사용 가능한 스크립트](#사용-가능한-스크립트)
- [주요 페이지](#주요-페이지)
- [개발 가이드](#개발-가이드)

## 프로젝트 소개

PETNER는 유기 동물 보호소와 입양을 희망하는 사람들을 연결하는 플랫폼입니다.
반려동물의 정보를 쉽게 검색하고, 커뮤니티를 통해 입양 관련 정보를 공유할 수 있습니다.

## 주요 기능

### 🐾 반려동물 관리
- 반려동물 목록 조회 및 검색
- 품종, 지역별 필터링
- 반려동물 상세 정보 확인
- 보호소 정보 연동

### 👥 커뮤니티
- 입양 후기 및 정보 공유
- 게시글 작성, 수정, 삭제
- 댓글 기능
- 게시글에서 직접 채팅방 생성

### 💬 실시간 채팅
- 보호소와 1:1 채팅
- 입양 문의 및 상담

### 🔐 사용자 인증
- 카카오 OAuth 소셜 로그인
- 프로필 관리
- 관심 동물 북마크

## 기술 스택

### Core
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버

### State Management & Data Fetching
- **TanStack Query (React Query)** - 서버 상태 관리
- **Axios** - HTTP 클라이언트

### UI & Styling
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 컴포넌트 라이브러리
- **Radix UI** - 접근성 높은 headless UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### Form & Validation
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 기반 유효성 검사

### Routing
- **React Router v6** - 클라이언트 사이드 라우팅

### Additional Libraries
- **date-fns** - 날짜 포맷팅
- **Embla Carousel** - 이미지 캐러셀
- **Sonner** - 토스트 알림
- **Recharts** - 차트 라이브러리

## 프로젝트 구조

```
PETNER-frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # shadcn/ui 기반 컴포넌트
│   │   ├── AuthGuard.tsx   # 인증 가드
│   │   ├── ChatButton.tsx  # 채팅 버튼
│   │   ├── Navbar.tsx      # 네비게이션 바
│   │   └── ...
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # 유틸리티 함수
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Index.tsx       # 메인 페이지
│   │   ├── Pets.tsx        # 반려동물 목록
│   │   ├── PetDetail.tsx   # 반려동물 상세
│   │   ├── Community.tsx   # 커뮤니티
│   │   ├── MyProfile.tsx   # 프로필
│   │   └── ...
│   ├── App.tsx             # 앱 진입점 및 라우팅
│   └── main.tsx            # React 진입점
├── public/                 # 정적 파일
├── .env                    # 환경변수 (로컬, git ignore)
├── package.json            # 프로젝트 의존성
├── tailwind.config.ts      # Tailwind 설정
├── tsconfig.json           # TypeScript 설정
└── vite.config.ts          # Vite 설정
```

## 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

1. 저장소 클론

```bash
git clone [repository-url]
cd PETNER-frontend
```

2. 의존성 설치

```bash
npm install
```

3. 환경변수 설정 (아래 섹션 참조)

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 확인

```
http://localhost:3000
```

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수를 설정해주세요:

```env
# API 설정
VITE_API_BASE_URL=http://localhost:8080

# 개발 환경 설정
VITE_NODE_ENV=development

# 카카오 OAuth 설정
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
```

### 환경변수 설명

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 | `http://localhost:8080` |
| `VITE_NODE_ENV` | 실행 환경 (development/production) | `development` |
| `VITE_KAKAO_CLIENT_ID` | 카카오 로그인 클라이언트 ID | - |

⚠️ **주의사항**
- `.env` 파일은 절대 Git에 커밋하지 마세요
- 실제 환경변수 값은 팀 내부에서 안전하게 관리하세요
- 새로운 환경변수 추가 시 팀원들에게 공유하세요

## 사용 가능한 스크립트

### `npm run dev`
- 개발 서버를 포트 3000에서 실행합니다
- Hot Module Replacement (HMR) 지원

### `npm run build`
- 프로덕션용 빌드를 생성합니다
- `dist/` 폴더에 최적화된 파일이 생성됩니다

### `npm run build:dev`
- 개발 모드로 빌드를 생성합니다
- 디버깅을 위한 소스맵 포함

### `npm run lint`
- ESLint를 실행하여 코드 품질을 검사합니다

### `npm run preview`
- 빌드된 프로덕션 앱을 로컬에서 미리보기합니다

## 주요 페이지

### 인증
| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/` | `Index` | 메인 페이지 | ❌ |
| `/auth/kakao/callback` | `KakaoCallback` | 카카오 로그인 콜백 | ❌ |
| `/about` | `About` | 서비스 소개 | ❌ |

### 반려동물
| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/pets` | `Pets` | 반려동물 목록 | ✅ |
| `/pet/:id` | `PetDetail` | 반려동물 상세 정보 | ✅ |
| `/register` | `RegisterPet` | 반려동물 등록 | ✅ |

### 커뮤니티
| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/community` | `Community` | 커뮤니티 메인 | ✅ |
| `/community/new` | `PostCreate` | 게시글 작성 | ✅ |
| `/post/:id` | `PostDetail` | 게시글 상세 | ✅ |

### 사용자
| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/profile` | `MyProfile` | 내 프로필 | ✅ |

## 개발 가이드

### 코드 스타일

- **TypeScript**: 타입을 명시적으로 정의하세요
- **컴포넌트**: 함수형 컴포넌트와 hooks를 사용하세요
- **스타일링**: Tailwind CSS 유틸리티 클래스를 우선 사용하세요
- **상태 관리**: 서버 상태는 React Query, 클라이언트 상태는 useState/useContext 사용

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무, 패키지 매니저 설정 등
```

### 새로운 컴포넌트 추가

1. **UI 컴포넌트**: `src/components/ui/` 에 추가
2. **기능 컴포넌트**: `src/components/` 에 추가
3. **페이지**: `src/pages/` 에 추가하고 `App.tsx`에 라우트 등록

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `dev`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치

---

**2025 Cursor AI 기반 VIBE CODING 실전활용 경진대회** 출품작

