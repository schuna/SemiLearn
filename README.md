# SemiLearn

Tony R. Kuphaldt의 *Lessons In Electric Circuits, Volume III: Semiconductors*를 바탕으로 한 정적 학습 웹 앱입니다. 현재 Ch 1~3에 핵심 개념과 Canvas 실습이 있으며 Ch 4~13은 개요만 제공됩니다.

## 실행

프로젝트 폴더에서 정적 서버를 실행한 뒤 브라우저에서 `http://localhost:8000`을 엽니다.

```powershell
python -m http.server 8000
```

빌드 과정은 없습니다. Tailwind CSS, KaTeX, 글꼴은 CDN에서 가져오므로 해당 스타일과 수식 렌더링에는 인터넷 연결이 필요합니다.

## 검증

```powershell
node tests/phase1-smoke.cjs
node --check js/app.js
```

### Phase 1 화면 캡처

개발 환경 또는 브라우저 실행이 허용된 CI에서 다음을 실행합니다. Node.js와 npm이 필요하며, 첫 실행에 Playwright의 Chromium 설치가 필요합니다.

```powershell
npm ci
npx playwright install chromium
npm run capture:phase1
```

스크립트가 로컬 서버를 자동으로 시작하고 Ch 1~3의 주요 상태 및 320px 모바일 화면을 `artifacts/phase1/`에 PNG로 저장합니다. `playwright-report/`에는 실행 결과와 실패 추적 정보가 저장됩니다. 캡처 전에 챕터·조작 결과·가로 넘침·브라우저 오류를 검사합니다. 외부 PhET 실습은 링크 대상만 검사하므로 실제 실행은 별도 수동 확인이 필요합니다. CDN 접근이 차단된 환경에서는 스타일·수식 로드가 실패할 수 있습니다.

학습용 시뮬레이터는 명시된 단순화 모델을 사용합니다. Ch 3의 I-V 곡선은 25°C에서 기준 전류에 맞춘 쇼클리 식이고, 정류기 평활 파형은 고정 1 kΩ 부하와 1000 µF 커패시터의 RC 충·방전 모델입니다. 정밀 부품 설계에는 실제 부품 데이터시트와 회로 해석을 사용하세요.

개발 범위와 남은 검증 항목은 [개발 계획서](docs/development_plan.md)를 참고하세요.
