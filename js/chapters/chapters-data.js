/**
 * chapters-data.js
 * Tony R. Kuphaldt의 'Lessons In Electric Circuits Vol. III - Semiconductors' 교재 기반 데이터베이스
 */

window.CHAPTERS_DATA = [
  {
    id: 1,
    slug: 'ch1-amplifiers',
    phase: 1,
    status: 'active',
    titleKo: '증폭기와 능동 소자',
    titleEn: 'Amplifiers and Active Devices',
    pages: 'pp. 1 ~ 26',
    desc: '전기 회로에서 전자 회로로의 진화, 능동 소자의 본질(작은 전력으로 큰 전력 제어), 에너지 보존 법칙과 증폭, 데시벨(dB)의 원리와 감쇠기 회로 분석.',
    tags: ['능동/수동 소자', '증폭의 본질', '데시벨(dB)', '감쇠기(Attenuator)'],
    keyTakeaways: [
      {
        title: '전기(Electric) vs 전자(Electronic)의 경계',
        desc: '전기 회로는 스위치나 가변저항 등 기계적/물리적 힘으로 전자의 흐름을 제어하지만, 전자 회로는 전기 신호(전압 또는 전류)가 또 다른 전기 흐름을 제어합니다 ("Electricity controlling electricity").'
      },
      {
        title: '능동 소자(Active Device)와 에너지 보존 법칙',
        desc: '증폭기는 에너지를 무에서 창조하는 것이 아닙니다. 외부 직류 전원(DC Battery)의 에너지를 입력 신호의 형태에 맞춰 모양(Shape)을 복제·가공하여 더 큰 출력 파형을 만드는 장치입니다.'
      },
      {
        title: '이득(Gain)과 데시벨(dB) 표기법',
        desc: '인간의 청각 및 물리적 인지 감각은 로그(Logarithmic) 척도를 따릅니다. 여러 증폭단을 직렬 연결(Cascaded)할 때 곱셈 대신 덧셈으로 전체 이득을 쉽게 계산하기 위해 벨(Bel)과 데시벨(dB)을 사용합니다.'
      },
      {
        title: '감쇠기(Attenuator)와 임피던스 매칭',
        desc: '신호 레벨을 감쇠시키면서 입출력 임피던스(예: RF 50Ω, 오디오 600Ω)를 일정하게 유지하기 위해 T형, Π형, L형 저항 네트워크를 설계합니다.'
      }
    ],
    formulas: [
      { name: '전력 이득 (dB)', latex: 'A_{P(\\text{dB})} = 10 \\log_{10} \\left( \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\right)' },
      { name: '전압 이득 (dB, 임피던스 동일 조건)', latex: 'A_{V(\\text{dB})} = 20 \\log_{10} \\left( \\frac{V_{\\text{out}}}{V_{\\text{in}}} \\right)' },
      { name: '다단 증폭기 총합 데시벨', latex: 'A_{\\text{total(dB)}} = A_{1(\\text{dB})} + A_{2(\\text{dB})} + \\dots + A_{n(\\text{dB})}' },
      { name: 'dBm 절대 전력 척도', latex: 'P_{(\\text{dBm})} = 10 \\log_{10} \\left( \\frac{P}{1\\text{ mW}} \\right) \\quad (600\\Omega \\text{ 기준 } 0\\text{dBm} \\approx 0.7746\\text{V})' }
    ],
    deepDiveHtml: `
      <div class="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        <h4 class="text-lg font-bold text-slate-900 dark:text-white">1. 왜 증폭기는 영구기관(Perpetual Motion)이 아닌가?</h4>
        <p>교재에서는 증폭기를 <strong>자동차의 파워 스티어링(Power Steering)</strong>에 비유합니다. 운전자가 스티어링 휠을 돌리는 작은 힘은 유압 밸브(능동 소자)를 제어할 뿐이고, 실제로 바퀴를 돌리는 강력한 에너지는 자동차 엔진(외부 직류 전원)에서 공급됩니다. 엔진이 꺼지면 파워 스티어링이 작동하지 않듯, 외부 DC 공급원 없는 증폭기는 존재할 수 없습니다.</p>
        
        <h4 class="text-lg font-bold text-slate-900 dark:text-white">2. 전압/전류 데시벨에 '20'이 곱해지는 이유</h4>
        <p>줄의 법칙($P = \\frac{V^2}{R} = I^2 R$)에 따라 전력은 전압 또는 전류의 제곱에 비례합니다. 부하 임피던스가 일정할 때 전압비의 제곱이 로그 안으로 들어가면서 지수법칙에 의해 로그 앞의 계수 10과 곱해져 <strong>$20 \\log_{10}(V_{out}/V_{in})$</strong>가 됩니다.</p>
        
        <h4 class="text-lg font-bold text-slate-900 dark:text-white">3. T형 및 Π형 감쇠기(Attenuator)의 양방향 대칭성</h4>
        <p>신호원 임피던스($Z_I$)와 부하 임피던스($Z_O$)가 같은 시스템(예: 50Ω RF 계측기)에서는 입출력을 뒤집어도 반사 손실 없이 동일한 감쇠량(dB)을 제공하도록 저항 네트워크를 설계합니다. 계측기 입력단 보호를 위해 필수적인 요소입니다.</p>
      </div>
    `,
    resources: [
      {
        title: 'Falstad Circuit: 다단 증폭기 및 신호 감쇠 시뮬레이션',
        url: 'https://www.falstad.com/circuit/circuitjs.html',
        type: 'Simulation',
        desc: '브라우저에서 실시간으로 신호원 전압과 저항 감쇠기 회로를 조작하고 오실로스코프로 파형을 관찰할 수 있는 인터랙티브 시뮬레이터입니다.'
      },
      {
        title: 'AllAboutCircuits: Volume III Chapter 1 원문 강좌',
        url: 'https://www.allaboutcircuits.com/textbook/semiconductors/chpt-1/electric-to-electronic/',
        type: 'Reading',
        desc: 'Tony R. Kuphaldt 교재 원문 웹 버전 및 커뮤니티 토론 문서.'
      },
      {
        title: 'Khan Academy: 데시벨(dB)과 로그 척도의 직관적 이해',
        url: 'https://www.khanacademy.org/science/physics/mechanical-waves-and-sound/sound-topic/v/sound-properties-amplitude-period-frequency-wavelength',
        type: 'Lecture',
        desc: '음향 전력 및 전압 비례에 따른 데시벨 공식의 유도와 물리적 의미 설명.'
      }
    ],
    simulationId: 'sim-ch1'
  },
  {
    id: 2,
    slug: 'ch2-solid-state',
    phase: 1,
    status: 'active',
    titleKo: '고체 소자 이론 (반도체 물성)',
    titleEn: 'Solid-State Device Theory',
    pages: 'pp. 27 ~ 96',
    desc: '고전 물리학의 한계와 양자역학의 도입, 보어 원자 모형에서 드브로이 물질파 및 확률 파동함수로의 도약, 에너지 밴드 이론(도체/반도체/절연체), 도핑(N형/P형)과 P-N 접합, 공핍층 및 내부 전계 형성 메커니즘.',
    tags: ['양자 물리학', '에너지 밴드 이론', '진성 반도체', '도핑(N형/P형)', 'P-N 접합', '공핍층(Depletion Region)'],
    keyTakeaways: [
      {
        title: '전자는 궤도를 도는 당구공이 아닌 확률 구름(Wavefunction)',
        desc: '러더퍼드의 태양계 원자 모형에 따르면 가속 운동하는 전자는 전자기파를 방출하며 핵으로 추락해야 합니다. 양자역학에 의해 전자는 정상파(Standing Wave)이자 확률 분포 구름으로 존재하며 오직 불연속적인 허용 준위만 가집니다.'
      },
      {
        title: '에너지 밴드와 밴드갭 (Band Theory)',
        desc: '수많은 원자가 모이면 원자 오비탈들이 중첩되어 에너지 밴드(Band)를 형성합니다. 도체는 전도대와 원자가대가 겹치고, 절연체는 밴드갭($E_g$)이 매우 넓으며(>5eV), 반도체는 적당한 크기($\\approx 1.1\\text{eV}$ for Si)를 가져 열에너지로 전자가 전도대로 여기(Excite)될 수 있습니다.'
      },
      {
        title: '도핑(Doping): 1천만 개 중 1개의 마법',
        desc: '순수 진성 실리콘에 5가 원소(인, 비소)를 도핑하면 여분의 전자가 생겨 N형 반도체가 되고, 3가 원소(붕소)를 도핑하면 전자가 빈 자리인 정공(Hole)이 다수 캐리어가 되는 P형 반도체가 됩니다.'
      },
      {
        title: 'P-N 접합과 자발적 공핍층 형성',
        desc: 'P형과 N형이 만나면 접합면 근처에서 전자와 정공이 확산되어 재결합합니다. 그 결과 고정된 이온(P측의 음이온, N측의 양이온)만 남아 전하가 고갈된 공핍층(Depletion Region)과 내부 전위 장벽(Si 기준 약 0.6~0.7V)이 자발적으로 형성됩니다.'
      }
    ],
    formulas: [
      { name: '에너지 밴드 에너지 단위', latex: '1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}' },
      { name: '실리콘(Si) 및 게르마늄(Ge) 밴드갭', latex: 'E_{g(\\text{Si})} \\approx 1.12\\text{ eV}, \\quad E_{g(\\text{Ge})} \\approx 0.67\\text{ eV}' },
      { name: '드브로이 물질파 파장', latex: '\\lambda = \\frac{h}{p} = \\frac{h}{m v}' },
      { name: '주양자수별 최대 전자 수', latex: 'N_{\\text{max}} = 2n^2 \\quad (n=1, 2, 3, 4 \\dots \\rightarrow 2, 8, 18, 32)' }
    ],
    deepDiveHtml: `
      <div class="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        <h4 class="text-lg font-bold text-slate-900 dark:text-white">1. 파이프 안의 구슬 비유: 정공(Hole)의 이동이란?</h4>
        <p>전도대의 전자는 텅 빈 파이프에 들어간 구슬처럼 자유롭게 굴러갑니다. 반면 원자가대의 정공 이동은 <strong>구슬로 가득 찬 파이프에서 구슬 하나를 뺐을 때의 빈자리 이동</strong>과 같습니다. 전자가 오른쪽으로 한 칸 이동하면 빈자리는 왼쪽으로 한 칸 이동하는 것처럼 보이며, 외부에서는 양(+)전하를 가진 가상의 입자가 움직이는 것처럼 관측됩니다.</p>

        <h4 class="text-lg font-bold text-slate-900 dark:text-white">2. 열폭주(Thermal Generation)와 반도체의 음의 온도계수</h4>
        <p>금속은 온도가 올라가면 격자 진동이 심해져 전자의 충돌이 증가하여 저항이 커집니다(양의 온도계수). 반면 순수 반도체는 온도가 상승하면 열에너지에 의해 가전자대에서 전도대로 뛰어넘는 전자-정공 쌍(EHP)이 기하급수적으로 늘어나 저항이 급격히 감소합니다(음의 온도계수).</p>

        <h4 class="text-lg font-bold text-slate-900 dark:text-white">3. 양자 터널링(Quantum Tunneling)과 미래 소자</h4>
        <p>고전역학에서는 장벽보다 에너지가 작으면 결코 벽을 넘을 수 없지만, 양자역학에서는 입자의 파동함수가 장벽 너머로 침투할 확률이 존재합니다. 장벽 폭이 나노미터 수준으로 얇아지면 전자가 벽을 뚫고 지나가는 터널링 현상이 일어나며, 이는 에사키 터널 다이오드(Tunnel Diode), 플래시 메모리, 주사터널현미경(STM)의 핵심 원리입니다.</p>
      </div>
    `,
    resources: [
      {
        title: 'PhET 대화형 시뮬레이션: 반도체 및 에너지 밴드 (University of Colorado)',
        url: 'https://phet.colorado.edu/en/simulations/semiconductor',
        type: 'Interactive',
        desc: '도체, 절연체, 반도체의 도핑 수준에 따른 페르미 준위와 전도 특성을 실시간으로 조작해볼 수 있는 세계적 시뮬레이터입니다.'
      },
      {
        title: 'HyperPhysics: 고체 물리 및 반도체 밴드 이론',
        url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/Solids/band.html',
        type: 'Reference',
        desc: '조지아 주립대의 명쾌한 개념 맵 기반 반도체 물리 아카이브.'
      },
      {
        title: 'Veritasium: 트랜지스터와 P-N 접합의 동작 원리 (YouTube)',
        url: 'https://www.youtube.com/watch?v=IcrBqCFLHIY',
        type: 'Video',
        desc: '반도체 결정 구조와 도핑, 전자/정공의 이동을 고품질 3D 그래픽으로 시각화한 해설 영상.'
      }
    ],
    simulationId: 'sim-ch2'
  },
  {
    id: 3,
    slug: 'ch3-diodes',
    phase: 1,
    status: 'active',
    titleKo: '다이오드 및 정류 회로',
    titleEn: 'Diodes and Rectifiers',
    pages: 'pp. 97 ~ 172',
    desc: '다이오드의 단방향 도통 특성(체크 밸브 비유), 쇼클리 다이오드 방정식과 열전압(Vt), 반파 및 전파 브리지 정류 회로, 리플 전압, 피크 검출기/클리퍼/클램퍼/배전기, 유도성 킥백 보호(Flyback), 제너 다이오드 및 특수 다이오드(LED, 광다이오드, 쇼트키 등).',
    tags: ['체크 밸브', '쇼클리 방정식', '전파 브리지 정류', '클리퍼/클램퍼', '제너 레귤레이터', '유도성 킥백(스너버)'],
    keyTakeaways: [
      {
        title: '체크 밸브(Check Valve)와 다이오드 기호의 화살표',
        desc: '다이오드는 유체의 역류를 막는 체크 밸브와 같습니다. 기호의 삼각형 화살표는 기술적 전통인 정전하(Conventional Current, +에서 -)의 이동 방향을 나타내며, 실제 전자(Electron) 흐름은 화살표 반대 방향입니다.'
      },
      {
        title: '순방향 전압 강하($V_F$)와 쇼클리 다이오드 방정식',
        desc: '실리콘 다이오드는 문턱전압 약 0.7V, 게르마늄은 약 0.3V, 쇼트키는 약 0.2~0.4V입니다. 0.7V를 넘어서면 전류는 전압에 대해 기하급수적(Exponential)으로 폭증하므로 회로 해석 시 정전압원으로 모델링합니다.'
      },
      {
        title: '정류 회로(Rectification)와 전파 브리지의 이점',
        desc: '반파 정류기는 AC 사이클의 절반만 통과시켜 리플이 크고 비효율적이지만, 4개의 다이오드로 구성된 브리지 정류기는 양의 반주기와 음의 반주기 모두 부하에 항상 동일한 방향의 전류를 공급합니다.'
      },
      {
        title: '제너 다이오드(Zener Diode)와 역방향 항복의 활용',
        desc: '일반 다이오드는 역방향 항복(Breakdown) 시 파괴되지만, 제너 다이오드는 정밀하게 제어된 항복 전압($V_Z$)에서 전류가 급증해도 전압을 일정하게 유지하므로 기준 전압원 및 전압 레귤레이터로 사용됩니다.'
      }
    ],
    formulas: [
      { name: '쇼클리 다이오드 방정식', latex: 'I_D = I_S \\left( e^{\\frac{V_D}{n V_T}} - 1 \\right)' },
      { name: '열전압 (상온 300K 기준)', latex: 'V_T = \\frac{k T}{q} \\approx 25.86\\text{ mV} \\approx 26\\text{ mV}' },
      { name: '전파 브리지 정류기 출력 피크 전압', latex: 'V_{\\text{peak(out)}} = V_{\\text{peak(in)}} - 2 V_F \\approx V_{\\text{peak(in)}} - 1.4\\text{V (Si)}' },
      { name: '코일 유도성 기전력 (패러데이 법칙)', latex: 'e = -L \\frac{di}{dt} \\quad (\\text{플라이휠 다이오드로 역기전력 방전})' }
    ],
    deepDiveHtml: `
      <div class="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        <h4 class="text-lg font-bold text-slate-900 dark:text-white">1. 전파 브리지 회로를 쉽게 외우는 법</h4>
        <p>교재에서는 다이오드 4개가 마름모꼴로 그려져 있어 초보자가 헷갈리기 쉽다고 지적합니다. 다이오드 4개를 모두 수평으로 오른쪽을 향하도록 나란히 배치하고 중간 브리지를 연결하면 전류가 항상 한쪽 방향으로만 흘러나가는 구조를 훨씬 직관적으로 이해할 수 있습니다.</p>

        <h4 class="text-lg font-bold text-slate-900 dark:text-white">2. 유도성 킥백(Inductive Kickback)과 프리휠링 다이오드</h4>
        <p>릴레이나 모터 같은 인덕터 코일에 흐르던 전류를 스위치로 끊으면, 자기장이 급격히 붕괴하면서 $\\frac{di}{dt}$가 무한대에 가까워져 수백~수천 볼트의 고압 스파이크가 발생합니다. 코일과 역방향으로 병렬 다이오드(Flyback/Commutating Diode)를 달아두면 축적된 에너지가 다이오드를 통해 안전하게 순환 방전됩니다.</p>

        <h4 class="text-lg font-bold text-slate-900 dark:text-white">3. 클리퍼(Clipper)와 클램퍼(Clamper)의 결정적 차이</h4>
        <p><strong>클리퍼</strong>는 파형의 특정 전압 이상/이하를 잘라내어 진폭을 제한하는 회로(저항+다이오드)이며, <strong>클램퍼</strong>는 커패시터에 전하를 충전시켜 파형의 전체 형태는 유지한 채 DC 오프셋 레벨만 위아래로 평행 이동(DC 복원)시키는 회로입니다.</p>
      </div>
    `,
    resources: [
      {
        title: 'Falstad: 전파 브리지 정류기 실시간 대화형 시뮬레이션',
        url: 'https://www.falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsAoAUwFco8QAWKq7kAbhz7k+Q6qKjChvIdIihS00bIC6UuQFsGqQSEK0gA',
        type: 'Simulation',
        desc: 'AC 전압과 4개 다이오드의 턴온 상태를 실시간 전자 점선 흐름 애니메이션으로 직접 확인해보세요.'
      },
      {
        title: 'PhET: 다이오드와 반도체 소자 전도 실험',
        url: 'https://phet.colorado.edu/',
        type: 'Interactive',
        desc: '다이오드의 순방향 및 역방향 바이어스 인가 시 공핍층의 두께 변화를 확인하는 시뮬레이션.'
      },
      {
        title: 'AllAboutCircuits: Diodes & Rectifiers 챕터 가이드',
        url: 'https://www.allaboutcircuits.com/textbook/semiconductors/chpt-3/introduction-to-diodes-and-rectifiers/',
        type: 'Reading',
        desc: '제너 다이오드 조정 및 SPICE 모델링 상세 분석.'
      }
    ],
    simulationId: 'sim-ch3'
  },
  {
    id: 4,
    slug: 'ch4-bjt',
    phase: 2,
    status: 'upcoming',
    titleKo: '바이폴라 접합 트랜지스터 (BJT)',
    titleEn: 'Bipolar Junction Transistors',
    pages: 'pp. 173 ~ 278',
    desc: 'NPN/PNP 샌드위치 구조, 얇은 베이스 층의 비밀, 전류 제어 전류원, 3대 증폭기(CE, CC, CB), 직류 부하선 및 바이어스 회로, 밀러 효과와 고주파 한계.',
    tags: ['NPN/PNP', '베타(Beta)', 'CE/CC/CB 증폭기', '부하선(Load Line)', '전류 거울']
  },
  {
    id: 5,
    slug: 'ch5-jfet',
    phase: 2,
    status: 'upcoming',
    titleKo: '접합 전계효과 트랜지스터 (JFET)',
    titleEn: 'Junction Field-Effect Transistors',
    pages: 'pp. 279 ~ 298',
    desc: '단극성 소자, 전압 제어 전류 소자, 게이트 역바이어스에 의한 핀치오프(Pinch-off), 옴 영역 vs 포화 영역, 트랜스컨덕턴스 g_fs.',
    tags: ['단극성', '핀치오프(Vp)', '트랜스컨덕턴스', '전압 제어 저항']
  },
  {
    id: 6,
    slug: 'ch6-mosfet',
    phase: 2,
    status: 'upcoming',
    titleKo: '절연 게이트 전계효과 트랜지스터 (MOSFET)',
    titleEn: 'Insulated-Gate Field-Effect Transistors',
    pages: 'pp. 299 ~ 314',
    desc: '공핍형(D-MOS) 및 증강형(E-MOS), 실리콘 산화막 절연, 채널 반전층 형성, 전력 VMOS/UMOS, IGBT 소자 원리.',
    tags: ['MOSFET', '반전층', '게이트 절연막', 'IGBT']
  },
  {
    id: 7,
    slug: 'ch7-thyristors',
    phase: 3,
    status: 'upcoming',
    titleKo: '사이리스터 (Thyristors)',
    titleEn: 'Thyristors',
    pages: 'pp. 315 ~ 352',
    desc: '전기적 히스테리시스, 래칭 동작, 쇼클리 다이오드, DIAC, SCR 위상 제어, TRIAC, UJT/PUT 이완 발진기, GTO/MCT.',
    tags: ['히스테리시스', 'SCR', 'TRIAC', '위상 제어', 'UJT']
  },
  {
    id: 8,
    slug: 'ch8-opamp',
    phase: 3,
    status: 'upcoming',
    titleKo: '연산 증폭기 (Op-Amp)',
    titleEn: 'Operational Amplifiers',
    pages: 'pp. 353 ~ 412',
    desc: '이상적 연산증폭기, 부귀환과 가상 접지, 반전/비반전 증폭기(지렛대 비유), 가산기, 미분기/적분기, 계측 증폭기, 정귀환 슈미트 트리거.',
    tags: ['가상 접지', '지렛대 모델', '계측 증폭기', '미분기/적분기', 'CMRR']
  },
  {
    id: 9,
    slug: 'ch9-practical-circuits',
    phase: 4,
    status: 'upcoming',
    titleKo: '실제 아날로그 반도체 회로',
    titleEn: 'Practical Analog Semiconductor Circuits',
    pages: 'pp. 413 ~ 468',
    desc: 'ESD 정전기 방전 보호, 리니어 vs 스위칭 전원 회로, 아날로그 연산 회로(아날로그 컴퓨터의 미적분 시뮬레이션), 광석 라디오.',
    tags: ['ESD 방전 보호', '전원 회로(SMPS)', '아날로그 컴퓨터']
  },
  {
    id: 10,
    slug: 'ch10-active-filters',
    phase: 4,
    status: 'upcoming',
    titleKo: '능동 필터 (Active Filters)',
    titleEn: 'Active Filters',
    pages: 'pp. 469 ~ 470',
    desc: '2극 능동 저역통과/고역통과 필터, 버터워스(Butterworth) 응답 및 위상 선형성.',
    tags: ['능동 필터', 'Bode Plot', '버터워스']
  },
  {
    id: 11,
    slug: 'ch11-motor-drives',
    phase: 4,
    status: 'upcoming',
    titleKo: 'DC 모터 드라이브 (Motor Drives)',
    titleEn: 'DC Motor Drives',
    pages: 'pp. 471 ~ 474',
    desc: 'PWM(펄스 폭 변조) 전력 제어, H-브리지 모터 정/역회전 제어, 슛스루(Shoot-through) 방지 메커니즘.',
    tags: ['PWM', 'H-브리지', '슛스루 방지']
  },
  {
    id: 12,
    slug: 'ch12-inverters',
    phase: 4,
    status: 'upcoming',
    titleKo: '인버터 및 AC 드라이브',
    titleEn: 'Inverters and AC Motor Drives',
    pages: 'pp. 475 ~ 476',
    desc: 'DC 전원을 AC로 변환하는 인버터 기술 및 정현파 펄스 폭 변조(SPWM) 기초.',
    tags: ['인버터', 'SPWM', 'AC 모터']
  },
  {
    id: 13,
    slug: 'ch13-electron-tubes',
    phase: 4,
    status: 'upcoming',
    titleKo: '진공관 (Electron Tubes)',
    titleEn: 'Electron Tubes',
    pages: 'pp. 477 ~ 504',
    desc: '에디슨 효과, 3극관(Triode), 4극관(Tetrode), 5극관(Pentode)과 억제 그리드, 브라운관(CRT), 마그네트론, 진공관 vs 반도체 왜곡 특성 비교.',
    tags: ['진공관', '열전자 방출', '3극관/5극관', '고조파 왜곡']
  }
];
