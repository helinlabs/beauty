# Beauty 프로젝트 셋업 가이드

Git이나 개발 환경이 처음인 분들을 위한 단계별 설치 가이드입니다.

## 1단계: 필수 프로그램 설치

### 1-1. Node.js 설치
1. https://nodejs.org 접속
2. **LTS** 버전 다운로드 (초록색 버튼)
3. 설치 파일 실행하고 "다음" 계속 클릭

### 1-2. Git 설치
1. https://git-scm.com/downloads 접속
2. 본인 운영체제 선택 (Mac/Windows)
3. 설치 파일 다운로드 후 실행
4. 모든 옵션 기본값으로 "Next" 계속 클릭

### 1-3. VS Code 설치 (권장)
1. https://code.visualstudio.com 접속
2. 다운로드 후 설치

### 1-4. Claude Code 설치
터미널(Mac) 또는 명령 프롬프트(Windows)를 열고:
```bash
npm install -g @anthropic-ai/claude-code
```

## 2단계: GitHub 계정 설정

### 2-1. GitHub 계정 만들기
1. https://github.com 접속
2. "Sign up" 클릭하여 계정 생성

### 2-2. 팀에 초대받기
- 팀장에게 GitHub 아이디 알려주기
- helinlabs 조직에 초대받으면 이메일로 초대장 옴
- 초대 수락하기

## 3단계: 프로젝트 다운로드

터미널을 열고 아래 명령어 순서대로 입력:

```bash
# 1. 작업 폴더로 이동 (원하는 위치로 변경 가능)
cd ~/Desktop

# 2. 프로젝트 다운로드
git clone https://github.com/helinlabs/beauty.git

# 3. 프로젝트 폴더로 이동
cd beauty

# 4. 필요한 패키지 설치 (시간이 좀 걸립니다)
npm install
```

## 4단계: 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 확인:
- 메인 사이트: http://localhost:3000/ko
- 어드민: http://localhost:3000/ko/admin

## 5단계: Claude Code 사용하기

```bash
# 프로젝트 폴더에서 Claude Code 실행
claude
```

이제 Claude에게 원하는 작업을 요청하면 됩니다.
예시:
- "메인 페이지 헤더 색상 바꿔줘"
- "어드민 대시보드에 새 카드 추가해줘"
- "한국어 번역 수정해줘"

## 자주 묻는 질문

### Q: 터미널이 뭔가요?
- **Mac**: Spotlight(Cmd+Space)에서 "터미널" 검색
- **Windows**: 시작 메뉴에서 "명령 프롬프트" 또는 "PowerShell" 검색

### Q: 에러가 나요
Claude Code에 에러 메시지를 그대로 복사해서 보여주세요. Claude가 해결해줍니다.

### Q: 작업 내용이 안 올라갔어요
Claude에게 "커밋하고 푸시해줘"라고 말하면 됩니다.

## 주의사항

- 작업이 끝나면 반드시 Claude에게 "커밋해줘"라고 말해주세요
- Claude가 알아서 테스트하고 GitHub에 올려줍니다
- main 브랜치에 올리면 자동으로 서버에 배포됩니다
