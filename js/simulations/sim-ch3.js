/**
 * sim-ch3.js
 * Chapter 3: 다이오드 I-V 곡선 & 전파 브리지 정류기 실시간 회로 시뮬레이터
 */

window.SimulatorCh3 = {
  canvas: null,
  ctx: null,
  animId: null,
  time: 0,
  mode: 'bridge', // 'bridge' or 'iv-curve'

  // 브리지 정류기 상태
  acFrequency: 1.0,
  acVoltage: 10.0,
  hasFilterCap: false,
  filterCapVal: 100, // uF

  // I-V 곡선 상태
  diodeVoltage: 0.65, // V
  diodeType: 'silicon', // 'silicon' (0.7V), 'germanium' (0.3V), 'schottky' (0.25V)

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl text-white">
        <!-- 뷰 모드 탭 전환 -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span class="text-base font-bold text-amber-400">다이오드 회로 인터랙티브 랩</span>
          </div>
          <div class="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button id="ch3-tab-bridge" class="px-3 py-1.5 rounded-md font-medium transition-all ${this.mode === 'bridge' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              전파 브리지 정류기 뷰
            </button>
            <button id="ch3-tab-iv" class="px-3 py-1.5 rounded-md font-medium transition-all ${this.mode === 'iv-curve' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              다이오드 I-V 특성 곡선 뷰
            </button>
          </div>
        </div>

        <!-- 캔버스 영역 -->
        <div class="relative w-full aspect-[16/9] max-h-[360px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
          <canvas id="ch3-canvas" class="w-full h-full block"></canvas>
        </div>

        <!-- 동적 컨트롤 패널 -->
        <div id="ch3-controls" class="mt-4 pt-2"></div>
      </div>
    `;

    this.canvas = document.getElementById('ch3-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

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

  bindEvents() {
    const tabBridge = document.getElementById('ch3-tab-bridge');
    const tabIv = document.getElementById('ch3-tab-iv');

    tabBridge?.addEventListener('click', () => {
      this.mode = 'bridge';
      tabBridge.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-amber-600 text-white shadow';
      tabIv.className = 'px-3 py-1.5 rounded-md font-medium transition-all text-slate-400 hover:text-white';
      this.renderControls();
    });

    tabIv?.addEventListener('click', () => {
      this.mode = 'iv-curve';
      tabIv.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-amber-600 text-white shadow';
      tabBridge.className = 'px-3 py-1.5 rounded-md font-medium transition-all text-slate-400 hover:text-white';
      this.renderControls();
    });
  },

  renderControls() {
    const panel = document.getElementById('ch3-controls');
    if (!panel) return;

    if (this.mode === 'bridge') {
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>AC 입력 전압 (V_peak):</span>
              <span id="ch3-val-acv" class="font-mono text-amber-400 font-bold">${this.acVoltage.toFixed(1)} V</span>
            </div>
            <input id="ch3-slider-acv" type="range" min="3.0" max="15.0" step="0.5" value="${this.acVoltage}" class="w-full accent-amber-500 cursor-pointer">
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>교류 주파수 (Frequency):</span>
              <span id="ch3-val-freq" class="font-mono text-sky-400 font-bold">${this.acFrequency.toFixed(1)} Hz</span>
            </div>
            <input id="ch3-slider-freq" type="range" min="0.5" max="3.0" step="0.5" value="${this.acFrequency}" class="w-full accent-sky-500 cursor-pointer">
          </div>

          <div class="flex items-center justify-between bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div>
              <span class="font-medium text-slate-200 block">평활 커패시터 (Filter C)</span>
              <span class="text-[10px] text-slate-400">출력 리플(Ripple) 전압 완화</span>
            </div>
            <button id="ch3-btn-cap" class="px-3 py-1.5 rounded text-xs font-semibold transition-all ${this.hasFilterCap ? 'bg-emerald-600 text-white shadow' : 'bg-slate-700 text-slate-300'}">
              ${this.hasFilterCap ? 'ON (필터 작동)' : 'OFF (맥류)'}
            </button>
          </div>
        </div>
      `;

      document.getElementById('ch3-slider-acv')?.addEventListener('input', (e) => {
        this.acVoltage = parseFloat(e.target.value);
        document.getElementById('ch3-val-acv').textContent = this.acVoltage.toFixed(1) + ' V';
      });

      document.getElementById('ch3-slider-freq')?.addEventListener('input', (e) => {
        this.acFrequency = parseFloat(e.target.value);
        document.getElementById('ch3-val-freq').textContent = this.acFrequency.toFixed(1) + ' Hz';
      });

      document.getElementById('ch3-btn-cap')?.addEventListener('click', () => {
        this.hasFilterCap = !this.hasFilterCap;
        this.renderControls();
      });
    } else {
      // I-V 곡선 컨트롤
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>인가 다이오드 전압 (V_D):</span>
              <span id="ch3-val-vd" class="font-mono text-amber-400 font-bold">${this.diodeVoltage.toFixed(2)} V</span>
            </div>
            <input id="ch3-slider-vd" type="range" min="-2.0" max="0.85" step="0.01" value="${this.diodeVoltage}" class="w-full accent-amber-500 cursor-pointer">
            <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>-2.0V (역방향)</span>
              <span>0V</span>
              <span>+0.85V (급격한 도통)</span>
            </div>
          </div>

          <div>
            <span class="text-slate-300 block mb-1">반도체 재질 (문턱 전압 Vf):</span>
            <div class="grid grid-cols-3 gap-2">
              <button id="ch3-btn-si" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.diodeType === 'silicon' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}">실리콘 (0.7V)</button>
              <button id="ch3-btn-ge" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.diodeType === 'germanium' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}">게르마늄 (0.3V)</button>
              <button id="ch3-btn-sch" class="px-2.5 py-1.5 rounded border border-slate-700 ${this.diodeType === 'schottky' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}">쇼트키 (0.25V)</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('ch3-slider-vd')?.addEventListener('input', (e) => {
        this.diodeVoltage = parseFloat(e.target.value);
        document.getElementById('ch3-val-vd').textContent = this.diodeVoltage.toFixed(2) + ' V';
      });

      ['si', 'ge', 'sch'].forEach(type => {
        const mat = type === 'si' ? 'silicon' : type === 'ge' ? 'germanium' : 'schottky';
        document.getElementById(`ch3-btn-${type}`)?.addEventListener('click', () => {
          this.diodeType = mat;
          this.renderControls();
        });
      });
    }
  },

  startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const render = () => {
      this.draw();
      this.time += 0.03 * this.acFrequency;
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

    if (this.mode === 'bridge') {
      this.drawBridgeCircuit(w, h);
    } else {
      this.drawIVCurve(w, h);
    }
  },

  drawBridgeCircuit(w, h) {
    const { ctx } = this;
    
    // 현재 입력 AC 순시 전압
    const instantaneousVin = this.acVoltage * Math.sin(this.time * 2);
    const isPositiveHalf = instantaneousVin >= 0;
    const vDrop = 1.4; // 2개 다이오드 전압 강하 (실리콘 0.7V x 2)
    const isConducting = Math.abs(instantaneousVin) > vDrop;

    // 좌측: 브리지 회로 다이어그램 (40% 너비)
    const circW = w * 0.44;
    const cx = circW * 0.45;
    const cy = h * 0.5;
    const size = Math.min(circW, h) * 0.28;

    // 브리지 4개 노드 (마름모: 상(A), 우(B), 하(C), 좌(D))
    const topNode = { x: cx, y: cy - size };
    const rightNode = { x: cx + size * 1.1, y: cy };
    const botNode = { x: cx, y: cy + size };
    const leftNode = { x: cx - size * 1.1, y: cy };

    // 회로 전선 그리기
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    // 마름모 브리지
    ctx.moveTo(topNode.x, topNode.y); ctx.lineTo(rightNode.x, rightNode.y);
    ctx.lineTo(botNode.x, botNode.y); ctx.lineTo(leftNode.x, leftNode.y);
    ctx.closePath();
    ctx.stroke();

    // 부하 저항 (오른쪽으로 나와서 연결)
    const loadX = rightNode.x + size * 0.6;
    ctx.beginPath();
    ctx.moveTo(rightNode.x, rightNode.y);
    ctx.lineTo(loadX, rightNode.y);
    ctx.lineTo(loadX, botNode.y);
    ctx.lineTo(botNode.x, botNode.y);
    ctx.stroke();

    // 부하 저항 기호 표시
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(loadX - 8, cy - 20, 16, 40);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(loadX - 8, cy - 20, 16, 40);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText('R_L', loadX + 12, cy + 4);

    // 4개 다이오드 상태 및 심볼 그리기
    // D1 (좌 -> 상): 양의 반주기 도통
    // D2 (하 -> 좌): 음의 반주기 도통
    // D3 (하 -> 우): 양의 반주기 도통
    // D4 (우 -> 상): 음의 반주기 도통
    const d1Active = isPositiveHalf && isConducting;
    const d3Active = isPositiveHalf && isConducting;
    const d2Active = !isPositiveHalf && isConducting;
    const d4Active = !isPositiveHalf && isConducting;

    const drawDiodeSymbol = (x, y, active, label) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = active ? 'rgba(34, 197, 94, 0.3)' : 'rgba(30, 41, 59, 0.8)';
      ctx.fill();
      ctx.strokeStyle = active ? '#22c55e' : '#64748b';
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.stroke();

      ctx.fillStyle = active ? '#4ade80' : '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(label, x - 6, y + 3);
      ctx.restore();
    };

    drawDiodeSymbol((leftNode.x + topNode.x) / 2, (leftNode.y + topNode.y) / 2, d1Active, 'D1');
    drawDiodeSymbol((botNode.x + rightNode.x) / 2, (botNode.y + rightNode.y) / 2, d3Active, 'D3');
    drawDiodeSymbol((leftNode.x + botNode.x) / 2, (leftNode.y + botNode.y) / 2, d2Active, 'D2');
    drawDiodeSymbol((rightNode.x + topNode.x) / 2, (rightNode.y + topNode.y) / 2, d4Active, 'D4');

    // 부하 전류 방향 화살표 (언제나 위 -> 아래)
    if (isConducting) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(loadX, cy - 5);
      ctx.lineTo(loadX - 5, cy - 14);
      ctx.lineTo(loadX + 5, cy - 14);
      ctx.fill();
    }

    // 우측: 오실로스코프 파형 뷰 (55% 너비)
    const scopeX = w * 0.48;
    const scopeW = w * 0.49;
    const scopeH = h * 0.84;
    const scopeY = h * 0.08;

    // 스코프 배경
    ctx.fillStyle = '#020617';
    ctx.fillRect(scopeX, scopeY, scopeW, scopeH);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(scopeX, scopeY, scopeW, scopeH);

    // 스코프 중심선 (0V)
    const scopeMidY = scopeY + scopeH * 0.5;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.beginPath();
    ctx.moveTo(scopeX, scopeMidY);
    ctx.lineTo(scopeX + scopeW, scopeMidY);
    ctx.stroke();

    const vScale = (scopeH * 0.38) / 16.0;

    // 1. 입력 AC 사인파 (점선 회색)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < scopeW; x++) {
      const t = this.time * 2 + (x / scopeW) * Math.PI * 4;
      const vin = this.acVoltage * Math.sin(t);
      const y = scopeMidY - vin * vScale;
      if (x === 0) ctx.moveTo(scopeX + x, y);
      else ctx.lineTo(scopeX + x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. 정류된 출력 DC 맥류 파형 (호박색 실선)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < scopeW; x++) {
      const t = this.time * 2 + (x / scopeW) * Math.PI * 4;
      const rawVin = Math.abs(this.acVoltage * Math.sin(t));
      let vout = Math.max(0, rawVin - vDrop);

      // 커패시터 평활화 필터 흉내
      if (this.hasFilterCap) {
        const peakV = this.acVoltage - vDrop;
        const rippleFactor = 0.2;
        vout = peakV * (1 - rippleFactor * (1 - Math.cos(t * 2) * 0.3));
      }

      const y = scopeMidY - vout * vScale;
      if (x === 0) ctx.moveTo(scopeX + x, y);
      else ctx.lineTo(scopeX + x, y);
    }
    ctx.stroke();

    // 스코프 라벨
    ctx.fillStyle = '#facc15';
    ctx.font = '10px monospace';
    ctx.fillText('입력 AC (Vin)', scopeX + 8, scopeY + 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`출력 DC (${this.hasFilterCap ? '평활 필터 적용' : '맥류'})`, scopeX + 8, scopeY + 30);
  },

  drawIVCurve(w, h) {
    const { ctx } = this;
    const margin = 40;
    const originX = w * 0.35;
    const originY = h * 0.75;

    // 축 그리기
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin, originY); ctx.lineTo(w - margin, originY); // V축
    ctx.moveTo(originX, margin); ctx.lineTo(originX, h - margin); // I축
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('전압 VD (V) →', w - margin - 60, originY - 8);
    ctx.fillText('↑ 전류 ID (mA)', originX + 8, margin + 14);

    // 문턱 전압 설정
    const vfMap = { silicon: 0.7, germanium: 0.3, schottky: 0.25 };
    const vf = vfMap[this.diodeType] || 0.7;

    const vScale = (w - originX - margin) / 1.0; // 1V = 너비
    const iScale = (originY - margin) / 100.0; // 100mA = 높이

    // I-V 곡선 계산 및 그리기
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let vx = -2.0; vx <= 0.85; vx += 0.01) {
      const scrX = originX + vx * vScale;
      // 쇼클리 다이오드 지수 전류 계산
      let id = 0;
      if (vx > 0) {
        id = 0.001 * Math.exp(vx / (vf * 0.15));
      } else {
        id = -0.0001; // 역방향 포화 누설전류
      }
      if (id > 110) id = 110;
      const scrY = originY - id * iScale;

      if (vx === -2.0) ctx.moveTo(scrX, scrY);
      else ctx.lineTo(scrX, scrY);
    }
    ctx.stroke();

    // 문턱 전압 점선 표시 (Knee)
    const kneeX = originX + vf * vScale;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(kneeX, margin);
    ctx.lineTo(kneeX, originY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f87171';
    ctx.font = '10px monospace';
    ctx.fillText(`Vf ≈ ${vf}V`, kneeX - 15, originY + 16);

    // 현재 동작점 (Q-Point) 표시
    let currentId = 0;
    if (this.diodeVoltage > 0) {
      currentId = 0.001 * Math.exp(this.diodeVoltage / (vf * 0.15));
    }
    const qX = originX + this.diodeVoltage * vScale;
    const qY = originY - Math.min(100, currentId) * iScale;

    ctx.beginPath();
    ctx.arc(qX, qY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Q-Point (${this.diodeVoltage.toFixed(2)}V, ${currentId.toFixed(1)}mA)`, qX + 10, qY - 6);
  }
};
