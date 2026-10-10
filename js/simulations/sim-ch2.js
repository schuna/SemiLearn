/**
 * sim-ch2.js
 * Chapter 2: 에너지 밴드갭(Band Gap) & P-N 접합 공핍층 동적 시뮬레이터
 */

window.SimulatorCh2 = {
  canvas: null,
  ctx: null,
  animId: null,
  mode: 'pn-junction', // 'pn-junction' or 'band-gap'
  
  // P-N 접합 상태
  biasVoltage: 0.0, // -3.0V ~ +0.8V
  dopingLevel: 1.0, // 1x ~ 3x
  particles: [],
  
  // 밴드갭 모드 상태
  material: 'semiconductor', // 'conductor', 'semiconductor', 'insulator'
  temperature: 300, // Kelvin (0K ~ 500K)
  bandParticles: [],

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl text-white">
        <!-- 뷰 모드 탭 전환 -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-base font-bold text-emerald-400">반도체 물성 인터랙티브 랩</span>
          </div>
          <div class="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button id="ch2-tab-pn" class="px-3 py-1.5 rounded-md font-medium transition-all ${this.mode === 'pn-junction' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              P-N 접합 & 공핍층 뷰
            </button>
            <button id="ch2-tab-band" class="px-3 py-1.5 rounded-md font-medium transition-all ${this.mode === 'band-gap' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              에너지 밴드 이론 뷰
            </button>
          </div>
        </div>

        <!-- 캔버스 영역 -->
        <div class="relative w-full aspect-[16/9] max-h-[350px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
          <canvas id="ch2-canvas" class="w-full h-full block"></canvas>
          <div id="ch2-overlay-info" class="absolute bottom-2 left-3 text-xs bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-700/60 font-mono text-slate-300 pointer-events-none"></div>
        </div>

        <!-- 동적 컨트롤 패널 -->
        <div id="ch2-controls" class="mt-4 pt-2"></div>
      </div>
    `;

    this.canvas = document.getElementById('ch2-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.initParticles();
    this.bindEvents();
    this.renderControls();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.startLoop();
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio || 600;
    this.canvas.height = rect.height * window.devicePixelRatio || 340;
  },

  initParticles() {
    // P-N 접합용 캐리어 (전자: 파란색, 정공: 붉은색)
    this.particles = [];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        type: i < 45 ? 'hole' : 'electron',
        x: i < 45 ? Math.random() * 0.45 : 0.55 + Math.random() * 0.45,
        y: 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003
      });
    }

    // 밴드용 전자 파티클
    this.bandParticles = [];
    for (let i = 0; i < 60; i++) {
      this.bandParticles.push({
        x: 0.15 + Math.random() * 0.7,
        state: 'valence', // 'valence' or 'conduction'
        vy: 0,
        y: 0.75 + (Math.random() - 0.5) * 0.08
      });
    }
  },

  bindEvents() {
    const tabPn = document.getElementById('ch2-tab-pn');
    const tabBand = document.getElementById('ch2-tab-band');

    tabPn?.addEventListener('click', () => {
      this.mode = 'pn-junction';
      tabPn.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-emerald-600 text-white shadow';
      tabBand.className = 'px-3 py-1.5 rounded-md font-medium transition-all text-slate-400 hover:text-white';
      this.renderControls();
    });

    tabBand?.addEventListener('click', () => {
      this.mode = 'band-gap';
      tabBand.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-emerald-600 text-white shadow';
      tabPn.className = 'px-3 py-1.5 rounded-md font-medium transition-all text-slate-400 hover:text-white';
      this.renderControls();
    });
  },

  renderControls() {
    const panel = document.getElementById('ch2-controls');
    if (!panel) return;

    if (this.mode === 'pn-junction') {
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>바이어스 전압 (V_bias):</span>
              <span id="ch2-val-bias" class="font-mono text-emerald-400 font-bold">${this.biasVoltage > 0 ? '+' : ''}${this.biasVoltage.toFixed(2)} V</span>
            </div>
            <input id="ch2-slider-bias" type="range" min="-3.0" max="0.75" step="0.05" value="${this.biasVoltage}" class="w-full accent-emerald-500 cursor-pointer">
            <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>-3.0V (강한 역방향)</span>
              <span>0V (평형)</span>
              <span>+0.7V (순방향 도통)</span>
            </div>
          </div>

          <div class="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 flex flex-col justify-center">
            <div class="flex items-center justify-between text-slate-300">
              <span class="font-medium">접합 상태:</span>
              <span id="ch2-status-bias" class="font-mono font-bold text-emerald-400">
                ${this.biasVoltage < -0.1 ? '역방향 바이어스 (차단)' : this.biasVoltage >= 0.65 ? '순방향 도통 (전류 급증)' : '열평형 / 미세 도통'}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">
              공핍층 폭: <span id="ch2-dep-width" class="font-mono text-white">중간 (기본)</span>
            </div>
          </div>
        </div>
      `;

      const sBias = document.getElementById('ch2-slider-bias');
      sBias?.addEventListener('input', (e) => {
        this.biasVoltage = parseFloat(e.target.value);
        const vText = (this.biasVoltage > 0 ? '+' : '') + this.biasVoltage.toFixed(2) + ' V';
        document.getElementById('ch2-val-bias').textContent = vText;
        
        const statusEl = document.getElementById('ch2-status-bias');
        const depEl = document.getElementById('ch2-dep-width');
        if (this.biasVoltage < -0.2) {
          statusEl.textContent = '역방향 바이어스 (전류 차단)';
          statusEl.className = 'font-mono font-bold text-rose-400';
          depEl.textContent = '확장됨 (절연체 상태)';
        } else if (this.biasVoltage >= 0.65) {
          statusEl.textContent = '순방향 도통 (0.7V 초과, 대전류 흐름)';
          statusEl.className = 'font-mono font-bold text-amber-400 animate-pulse';
          depEl.textContent = '완전 축소 (붕괴)';
        } else {
          statusEl.textContent = '평형 / 부분 바이어스';
          statusEl.className = 'font-mono font-bold text-emerald-400';
          depEl.textContent = '표준 두께 (Si ~0.7V 장벽)';
        }
      });
    } else {
      // 밴드갭 컨트롤
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-slate-300 block mb-1">물질 유형 선택:</span>
            <div class="grid grid-cols-3 gap-2">
              <button id="ch2-btn-cond" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.material === 'conductor' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}">도체 (금속)</button>
              <button id="ch2-btn-semi" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.material === 'semiconductor' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}">반도체 (Si)</button>
              <button id="ch2-btn-insu" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.material === 'insulator' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}">부도체 (유리)</button>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>절대온도 (Temperature):</span>
              <span id="ch2-val-temp" class="font-mono text-emerald-400 font-bold">${this.temperature} K</span>
            </div>
            <input id="ch2-slider-temp" type="range" min="0" max="600" step="25" value="${this.temperature}" class="w-full accent-emerald-500 cursor-pointer">
            <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0 K (절대영도)</span>
              <span>300 K (상온)</span>
              <span>600 K (고온 열여기)</span>
            </div>
          </div>
        </div>
      `;

      ['cond', 'semi', 'insu'].forEach(type => {
        const mat = type === 'cond' ? 'conductor' : type === 'semi' ? 'semiconductor' : 'insulator';
        document.getElementById(`ch2-btn-${type}`)?.addEventListener('click', () => {
          this.material = mat;
          this.renderControls();
        });
      });

      document.getElementById('ch2-slider-temp')?.addEventListener('input', (e) => {
        this.temperature = parseInt(e.target.value, 10);
        document.getElementById('ch2-val-temp').textContent = `${this.temperature} K`;
      });
    }
  },

  startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    render();
  },

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  },

  draw() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (this.mode === 'pn-junction') {
      this.drawPNJunction(w, h);
    } else {
      this.drawBandGap(w, h);
    }
  },

  drawPNJunction(w, h) {
    const { ctx } = this;
    const midX = w / 2;

    // 공핍층 폭 계산: 역방향이면 넓어지고(-), 순방향이면 좁아짐(+)
    // 기본 반경: w * 0.1
    let depHalfWidth = w * (0.1 - this.biasVoltage * 0.05);
    if (depHalfWidth < w * 0.015) depHalfWidth = w * 0.015;
    if (depHalfWidth > w * 0.28) depHalfWidth = w * 0.28;

    // 1. P 영역 배경 (적색 기운)
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(0, 0, midX, h);
    
    // 2. N 영역 배경 (청색 기운)
    ctx.fillStyle = '#0f2438';
    ctx.fillRect(midX, 0, midX, h);

    // 3. 공핍층 영역 배경 (회색/무전하)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(midX - depHalfWidth, 0, depHalfWidth * 2, h);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX - depHalfWidth, 0); ctx.lineTo(midX - depHalfWidth, h);
    ctx.moveTo(midX + depHalfWidth, 0); ctx.lineTo(midX + depHalfWidth, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // 영역 라벨
    ctx.font = `bold ${Math.max(14, Math.floor(w * 0.024))}px sans-serif`;
    ctx.fillStyle = '#f87171';
    ctx.fillText('P형 (Hole 多)', w * 0.12, 32);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('N형 (Electron 多)', w * 0.7, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.font = `${Math.max(11, Math.floor(w * 0.018))}px sans-serif`;
    ctx.fillText('공핍층 (Depletion Region)', midX - (w * 0.08), h - 18);

    // 고정 공간 전하 이온 (P측: 음이온 -, N측: 양이온 +)
    ctx.font = 'bold 13px monospace';
    const numIons = 5;
    for (let i = 1; i <= numIons; i++) {
      const iy = (h / (numIons + 1)) * i;
      // P측 음이온 (-)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(midX - depHalfWidth * 0.5, iy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('⊖', midX - depHalfWidth * 0.5 - 6, iy + 4);

      // N측 양이온 (+)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(midX + depHalfWidth * 0.5, iy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.fillText('⊕', midX + depHalfWidth * 0.5 - 6, iy + 4);
    }

    // 내부 전계 화살표 (N -> P 방향)
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
    ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
    ctx.lineWidth = 1.5;
    const arrY = h * 0.5;
    ctx.beginPath();
    ctx.moveTo(midX + depHalfWidth * 0.7, arrY);
    ctx.lineTo(midX - depHalfWidth * 0.7, arrY);
    ctx.stroke();
    // 화살촉
    ctx.beginPath();
    ctx.moveTo(midX - depHalfWidth * 0.7, arrY);
    ctx.lineTo(midX - depHalfWidth * 0.7 + 8, arrY - 4);
    ctx.lineTo(midX - depHalfWidth * 0.7 + 8, arrY + 4);
    ctx.fill();
    ctx.font = '11px sans-serif';
    ctx.fillText('내부 전계 (E-Field)', midX - 45, arrY - 8);

    // 이동 캐리어 파티클 시뮬레이션
    const isForwardConduction = this.biasVoltage >= 0.65;
    this.particles.forEach(p => {
      // 위치 업데이트
      if (isForwardConduction) {
        // 순방향 도통 시: 전자(N->P) 왼쪽 이동, 정공(P->N) 오른쪽 이동
        if (p.type === 'electron') {
          p.x -= 0.005;
          if (p.x < 0.05) p.x = 0.95;
        } else {
          p.x += 0.005;
          if (p.x > 0.95) p.x = 0.05;
        }
      } else {
        // 평형 또는 역방향: 공핍층 경계에서 튕김
        const px = p.x * w;
        if (p.type === 'hole' && px > midX - depHalfWidth) {
          p.vx = -Math.abs(p.vx);
        } else if (p.type === 'electron' && px < midX + depHalfWidth) {
          p.vx = Math.abs(p.vx);
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
        if (p.y < 0.1 || p.y > 0.9) p.vy *= -1;
      }

      // 그리기
      const drawX = p.x * w;
      const drawY = p.y * h;
      ctx.beginPath();
      ctx.arc(drawX, drawY, 4, 0, Math.PI * 2);
      if (p.type === 'hole') {
        ctx.fillStyle = '#ef4444'; // 정공: 빨강
        ctx.shadowColor = '#ef4444';
      } else {
        ctx.fillStyle = '#38bdf8'; // 전자: 파랑
        ctx.shadowColor = '#38bdf8';
      }
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  },

  drawBandGap(w, h) {
    const { ctx } = this;
    const midX = w / 2;

    // 밴드 위치 계산
    let conductionY = h * 0.25;
    let valenceY = h * 0.7;
    let gapLabel = '1.12 eV (실리콘 반도체)';

    if (this.material === 'conductor') {
      conductionY = h * 0.42;
      valenceY = h * 0.48; // 거의 중첩
      gapLabel = '0 eV (밴드 중첩, 자유로운 전도)';
    } else if (this.material === 'insulator') {
      conductionY = h * 0.15;
      valenceY = h * 0.8;
      gapLabel = '> 5.0 eV (넓은 밴드갭, 전도 불가)';
    }

    // 1. 전도대 (Conduction Band)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(w * 0.15, conductionY - 45, w * 0.7, 45);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.15, conductionY - 45, w * 0.7, 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('전도대 (Conduction Band - 비어있거나 부분 점유)', w * 0.17, conductionY - 20);

    // 2. 밴드갭 영역 (Energy Gap Eg)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`에너지 밴드갭 Eg: ${gapLabel}`, w * 0.25, (conductionY + valenceY) / 2);

    // 밴드갭 화살표
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, conductionY);
    ctx.lineTo(w * 0.22, valenceY);
    ctx.stroke();

    // 3. 원자가대 (Valence Band)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(w * 0.15, valenceY, w * 0.7, 45);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.15, valenceY, w * 0.7, 45);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('원자가대 (Valence Band - 전자로 채워진 바닥 준위)', w * 0.17, valenceY + 28);

    // 온도에 따른 전자 여기 확률
    const exciteProb = (this.temperature / 600) * (this.material === 'conductor' ? 0.9 : this.material === 'semiconductor' ? 0.4 : 0.02);

    this.bandParticles.forEach(p => {
      if (Math.random() < 0.02) {
        if (Math.random() < exciteProb) {
          p.state = 'conduction';
        } else {
          p.state = 'valence';
        }
      }

      const targetY = p.state === 'conduction' ? conductionY - 22 : valenceY + 22;
      p.y += (targetY - p.y) * 0.1;

      const px = p.x * w;
      ctx.beginPath();
      ctx.arc(px, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = p.state === 'conduction' ? '#38bdf8' : '#fbbf24';
      ctx.shadowColor = p.state === 'conduction' ? '#38bdf8' : '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }
};
