# PETNER Frontend

React + TypeScript + Vite 기반의 PETNER 프론트엔드 애플리케이션입니다.

개발 환경 설정

1. 환경변수 설정

환경변수 파일을 생성하여 백엔드 API 주소 등의 설정을 진행해주세요.

# .env.example을 복사하여 .env 파일 생성
cp .env.example .env

.env 파일을 열고 실제 값으로 수정해주세요:

# API 설정
VITE_API_BASE_URL=http://localhost:8080
# 개발 환경 설정
VITE_NODE_ENV=development
# 카카오 OAuth 설정
VITE_KAKAO_CLIENT_ID=fb420e3988b645097a00cf4275cffbeb

2. 프로젝트 실행

아래 명령어를 통해 개발 서버를 실행할 수 있습니다:

npm install
npm run dev

3. 접속 확인

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080

주의사항

⚠️ '.env' 파일은 절대 Git에 커밋하지 마세요!

- 실제 환경변수 값은 팀 노션 페이지에서 관리
- '.env.example' 파일만 Git에 포함됨
- 새로운 환경변수 추가 시 '.env.example'도 함께 업데이트

개발 가이드

기술 스택

- React 18
- TypeScript
- Vite

