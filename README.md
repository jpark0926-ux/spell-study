# Spell & Study ✨

Harry Potter 마법 세계를 테마로 한 영어 단어 퀴즈 PWA (Progressive Web App)

![Harry Potter Theme](https://img.shields.io/badge/Theme-Harry%20Potter-9c1203?style=flat-square)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e?style=flat-square&logo=supabase)

## 🎮 주요 기능

- **⚔️ 보스전**: 말포이, 엄브릿지, 벨라트릭스, 스네이프, 볼드모트와의 대결
- **🧪 물약 상점**: 펠릭스 펠리시스, 원기회복제 등 다양한 마법 물약
- **🏆 스니치 잡기**: 랜덤으로 등장하는 황금 스니치
- **🍫 개구리 초콜릿**: 전설의 마법사 카드 수집
- **👻 피브스**: 예상치 못한 장난꾸러기 등장
- **🦌 패트로누스**: 특별한 수호 마법
- **🏅 업적 시스템**: 다양한 업적 달성
- **🏠 기숙사 선택**: 그리핀도르, 슬리데린, 래번클로, 후플푸프
- **🪄 지팡이 선택**: 각각 고유한 능력을 가진 마법 지팡이

## 🚀 Phase 1: Supabase 백엔드 연동 (완료)

### 추가된 기능

- **🔐 Google OAuth 로그인**: Supabase Auth를 통한 소셜 로그인
- **👤 게스트 모드**: 로그인 없이도 플레이 가능 (로컬 저장)
- **💾 진행상황 저장**: 코인, 업적, 카드, 처치한 빌런 등 자동 저장
- **🏆 명예의 전당**: 최고 점수 리더보드

## 📦 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd spell-study-app
```

### 2. 의존성 설치

```bash
npm install --legacy-peer-deps
```

### 3. Supabase 설정

#### 3.1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 Settings → API에서 URL과 anon key 복사

#### 3.2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용 추가:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3.3. 데이터베이스 스키마 생성

Supabase → SQL Editor에서 `supabase/schema.sql` 파일의 내용을 복사하여 실행

#### 3.4. Google OAuth 설정

1. Supabase → Authentication → Providers → Google
2. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
3. Authorized redirect URIs에 Supabase Callback URL 추가
4. Client ID와 Client Secret을 Supabase에 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 📁 프로젝트 구조

```
spell-study-app/
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # 인증 컴포넌트 (Google OAuth + 게스트)
│   │   └── Leaderboard.jsx    # 리더보드 컴포넌트
│   ├── lib/
│   │   ├── supabase.js        # Supabase 클라이언트 초기화
│   │   └── saveGame.js        # 진행상황 저장/로드 로직
│   ├── App.jsx                # 메인 앱 컴포넌트 (게임 로직)
│   └── main.jsx               # 엔트리 포인트
├── supabase/
│   └── schema.sql             # 데이터베이스 스키마
├── public/                    # 정적 파일 (아이콘, manifest 등)
├── .env.example               # 환경 변수 템플릿
└── README.md
```

## 🗄️ 데이터베이스 스키마

### `user_progress` 테이블

유저의 게임 진행상황을 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| user_id | uuid | 유저 ID (auth.users 참조) |
| unit | int | 현재 유닛 |
| coins | int | 보유 코인 |
| best_streak | int | 최고 연속 정답 |
| earned_ach | text[] | 획득한 업적 목록 |
| cards | text[] | 수집한 카드 목록 |
| killed_villains | text[] | 처치한 빌런 목록 |

### `leaderboard` 테이블

유저의 최고 점수를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| user_id | uuid | 유저 ID (auth.users 참조) |
| display_name | text | 표시 이름 |
| best_score | int | 최고 점수 |
| total_coins | int | 총 코인 개수 |

## 🎨 기술 스택

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **PWA**: vite-plugin-pwa
- **Audio**: Tone.js (마법 효과음)
- **Backend**: Supabase (Auth + PostgreSQL)
- **Deployment**: GitHub Pages

## 🔒 보안

- Row Level Security (RLS) 정책 적용
- 유저는 자신의 데이터만 읽기/쓰기 가능
- 리더보드는 공개 읽기, 개인 쓰기
- 환경 변수로 API 키 관리 (`.env` 파일은 `.gitignore`에 포함)

## 🎯 게임 방법

1. **기숙사 선택**: 그리핀도르, 슬리데린, 래번클로, 후플푸프 중 선택
2. **지팡이 선택**: 각 지팡이마다 고유한 능력 보유
3. **유닛 선택**: Unit 2, 3, 4 중 학습할 단어 세트 선택
4. **퀴즈 풀기**:
   - 객관식 (한글 → 영어)
   - 객관식 (영어 → 한글)
   - 타이핑 (영어 철자 입력)
   - 문장 완성 (빈칸 채우기)
5. **보스 처치**: 5문제마다 보스 등장, 정답 시 데미지
6. **물약 구매**: 코인으로 유용한 물약 구매
7. **업적 달성**: 다양한 조건 달성 시 업적 획득

## 📜 라이선스

MIT License

## 🤝 기여

Issue와 Pull Request는 언제나 환영합니다!

---

**Made with ⚡ by Harry Potter fans**
