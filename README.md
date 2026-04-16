# GlowList — 인플루언서 시술 공유 & 왓츠앱 예약

인플루언서가 받은 시술을 공유하고, 동일 시술을 왓츠앱으로 예약 연결해주는 뷰티 플랫폼의 **프론트엔드 전용** 프로젝트입니다.

- Next.js 14 App Router · React 18 · TypeScript
- styled-components v6 (SSR)
- i18n: `/ko`, `/en` path prefix + `Accept-Language` 자동 감지
- SEO: `Metadata API` + `hreflang` + `canonical` + `sitemap.ts` + `robots.ts` + JSON-LD
- 반응형 (모바일 퍼스트) + 다크 테마
- 퍼포먼스 마케팅: UTM/ref 자동 캡처, GA4·Meta Pixel 슬롯, dataLayer 이벤트

## 빠르게 실행

```bash
npm install
npm run dev
# http://localhost:3000 → 자동으로 /ko (또는 /en) 으로 리다이렉트
```

환경변수 `.env.local` (선택):

```
NEXT_PUBLIC_SITE_URL=https://glowlist.example
NEXT_PUBLIC_WHATSAPP_NUMBER=821012345678
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=0000000000000000
```

## 주요 플로우

### 인플루언서 링크 유입 → 예약

1. 인플루언서 인스타 DM 자동응답 / 링크트리에서 링크:
   ```
   https://glowlist.example/ko/book?ref=jiyeon&p=aqua-peel&utm_source=ig&utm_medium=dm&utm_campaign=spring24
   ```
2. `AttributionListener` 가 URL 파라미터(ref / p / utm_*)를 sessionStorage에 **first-touch** 로 저장
3. `/book` 에서 이름·전화만 입력 → `왓츠앱으로 전송` 버튼
4. 버튼 누르면 `wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=...` 로 바로 열림. 메시지엔 이름·번호·선택한 시술/인플루언서·utm_source/campaign 이 자동 삽입 → 매니저가 즉시 누가 어디서 왔는지 식별

### 페이지 맵

- `/` → `/ko` (또는 `/en`) 리다이렉트
- `/{locale}` 랜딩 (히어로 · 작동 원리 · 피처드 인플루언서 · 피처드 시술)
- `/{locale}/influencers` — 인플루언서 목록
- `/{locale}/influencers/[slug]` — **인플루언서 메인**: 이 사람이 받은 시술 모음 + 예약 상담 CTA
- `/{locale}/procedures` — 시술 목록
- `/{locale}/procedures/[slug]` — **시술 메인**: 이 시술을 받은 인플루언서 모음 + 예약 상담 CTA
- `/{locale}/book?ref=...&p=...` — 이름·전화번호 → 왓츠앱 핸드오프

## SEO 포인트

- 모든 라우트에 `canonical` + `alternates.languages` (hreflang + `x-default`) 자동
- `sitemap.ts` 에 인플루언서·시술 상세 페이지까지 언어별로 포함
- 랜딩에 `WebSite` JSON-LD. 상세 페이지에 `Article` / `Service` 타입 확장 용이
- `manifest.ts` + `icon.svg` 로 기본 PWA 메타 제공

## 구조

```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ robots.ts / sitemap.ts / manifest.ts / icon.svg
│  └─ [locale]/
│     ├─ layout.tsx            # Header/Footer + styled registry + GA/Pixel + Attribution
│     ├─ page.tsx              # 랜딩 (+ JSON-LD)
│     ├─ influencers/(page + [slug])
│     ├─ procedures/(page + [slug])
│     ├─ book/page.tsx
│     └─ not-found.tsx
├─ components/                 # Header, Footer, InfluencerCard, ProcedureCard,
│                              # BookingForm, AttributionListener, LanguageSwitcher …
├─ data/                       # influencers.ts, procedures.ts (mock)
├─ i18n/                       # config + dictionaries/{ko,en}.json
├─ lib/                        # seo, format, whatsapp, tracking
├─ styles/                     # theme, GlobalStyles, registry
└─ middleware.ts               # /<path> → /<locale><path>, UTM 보존
```

## 인플루언서 / 시술 추가

`src/data/influencers.ts` 와 `src/data/procedures.ts` 의 배열에 객체 하나만 추가하면 끝.
`sitemap.ts` 와 상세 페이지는 자동으로 해당 slug 를 포함합니다.

## 언어 추가

`src/i18n/config.ts` 의 `locales` 에 추가 → `src/i18n/dictionaries/xx.json` 생성 → `dictionaries.ts` 등록.
