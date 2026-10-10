/**
 * sim-ch1.js
 * Chapter 1: 증폭기 동작 원리 및 데시벨(dB) 인터랙티브 시뮬레이터
 */

window.SimulatorCh1 = {
  canvas: null,
  ctx: null,
  animId: null,
  time: 0,
  
  // 파라미터 상태
  gain: 5.0,
  inAmp: 1.0,
  vSupply: 10.0,
  freq: 1.5,
  isDualSupply: true,

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl text-white">
        <!-- 헤더 및 컨트롤 바 -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h4 class="text-base font-bold text-sky-400 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              증폭기 입출력 파형 & 데시벨(dB) 실시간 랩
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">외부 직류 전원 공급과 이득에 따른 파형 증폭 및 포화(Clipping) 현상을 관찰하세요.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="ch1-reset-btn" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
              초기화
            </button>
          </div>
        </div>

        <!-- 캔버스 영역 -->
        <div class="relative w-full aspect-[16/9] max-h-[360px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
          <canvas id="ch1-canvas" class="w-full h-full block"></canvas>
          
          <!-- 범례 -->
          <div class="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-md px-3 py-2 text-xs flex flex-col gap-1.5 shadow">
            <div class="flex items-center gap-2">
              <span class="w-3 h-0.5 bg-yellow-400 inline-block"></span>
              <span class="text-slate-300">입력 신호 (Vin)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-0.5 bg-sky-400 inline-block"></span>
              <span class="text-slate-300">출력 신호 (Vout)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-0.5 border-b border-dashed border-red-400 inline-block"></span>
              <span class="text-slate-300">전원 공급 한계 (±Vcc)</span>
            </div>
          </div>
        </div>

        <!-- 실시간 측정 지표 배너 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <div class="text-[11px] text-slate-400">전압 이득 (Av)</div>
            <div id="ch1-metric-gain" class="text-lg font-bold text-sky-400 font-mono">5.0x</div>
          </div>
          <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <div class="text-[11px] text-slate-400">전압 이득 (dB)</div>
            <div id="ch1-metric-db" class="text-lg font-bold text-emerald-400 font-mono">14.0 dB</div>
          </div>
          <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <div class="text-[11px] text-slate-400">출력 피크 전압 (Vpk)</div>
            <div id="ch1-metric-vout" class="text-lg font-bold text-amber-400 font-mono">5.0 V</div>
          </div>
          <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <div class="text-[11px] text-slate-400">포화(Clipping) 상태</div>
            <div id="ch1-metric-clip" class="text-lg font-bold text-slate-300 font-mono">정상 증폭</div>
          </div>
        </div>

        <!-- 조작 슬라이더 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>전압 이득 (Gain Av):</span>
              <span id="ch1-val-gain" class="font-mono text-sky-400 font-bold">5.0</span>
            </div>
            <input id="ch1-slider-gain" type="range" min="1" max="15" step="0.5" value="5" class="w-full accent-sky-500 cursor-pointer">
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>입력 진폭 (Vin Peak):</span>
              <span id="ch1-val-inamp" class="font-mono text-yellow-400 font-bold">1.0 V</span>
            </div>
            <input id="ch1-slider-inamp" type="range" min="0.2" max="3.0" step="0.1" value="1.0" class="w-full accent-yellow-500 cursor-pointer">
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>공급 전원 (Vcc):</span>
              <span id="ch1-val-vsupply" class="font-mono text-red-400 font-bold">±10.0 V</span>
            </div>
            <input id="ch1-slider-vsupply" type="range" min="3.0" max="15.0" step="0.5" value="10.0" class="w-full accent-red-500 cursor-pointer">
          </div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('ch1-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.bindEvents();
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
    const sGain = document.getElementById('ch1-slider-gain');
    const sInAmp = document.getElementById('ch1-slider-inamp');
    const sVsupply = document.getElementById('ch1-slider-vsupply');
    const btnReset = document.getElementById('ch1-reset-btn');

    sGain?.addEventListener('input', (e) => {
      this.gain = parseFloat(e.target.value);
      document.getElementById('ch1-val-gain').textContent = this.gain.toFixed(1);
      this.updateMetrics();
    });

    sInAmp?.addEventListener('input', (e) => {
      this.inAmp = parseFloat(e.target.value);
      document.getElementById('ch1-val-inamp').textContent = this.inAmp.toFixed(1) + ' V';
      this.updateMetrics();
    });

    sVsupply?.addEventListener('input', (e) => {
      this.vSupply = parseFloat(e.target.value);
      document.getElementById('ch1-val-vsupply').textContent = '±' + this.vSupply.toFixed(1) + ' V';
      this.updateMetrics();
    });

    btnReset?.addEventListener('click', () => {
      this.gain = 5.0;
      this.inAmp = 1.0;
      this.vSupply = 10.0;
      if (sGain) sGain.value = '5';
      if (sInAmp) sInAmp.value = '1';
      if (sVsupply) sVsupply.value = '10';
      document.getElementById('ch1-val-gain').textContent = '5.0';
      document.getElementById('ch1-val-inamp').textContent = '1.0 V';
      document.getElementById('ch1-val-vsupply').textContent = '±10.0 V';
      this.updateMetrics();
    });

    this.updateMetrics();
  },

  updateMetrics() {
    const dbVal = 20 * Math.log10(this.gain);
    const unclippedVout = this.inAmp * this.gain;
    const actualVout = Math.min(unclippedVout, this.vSupply);
    const isClipped = unclippedVout > this.vSupply;

    const mGain = document.getElementById('ch1-metric-gain');
    const mDb = document.getElementById('ch1-metric-db');
    const mVout = document.getElementById('ch1-metric-vout');
    const mClip = document.getElementById('ch1-metric-clip');

    if (mGain) mGain.textContent = this.gain.toFixed(1) + 'x';
    if (mDb) mDb.textContent = dbVal.toFixed(1) + ' dB';
    if (mVout) mVout.textContent = actualVout.toFixed(1) + ' V' + (isClipped ? ' (클리핑)' : '');
    if (mClip) {
      if (isClipped) {
        mClip.textContent = '⚠️ 포화 클리핑 왜곡!';
        mClip.className = 'text-lg font-bold text-rose-400 font-mono animate-pulse';
      } else {
        mClip.textContent = '✅ 선형 정상 증폭';
        mClip.className = 'text-lg font-bold text-emerald-400 font-mono';
      }
    }
  },

  startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const render = () => {
      this.draw();
      this.time += 0.035;
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

    // 오실로스코프 눈금 그리드
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    const gridCols = 10;
    const gridRows = 6;
    for (let c = 0; c <= gridCols; c++) {
      const x = (w / gridCols) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let r = 0; r <= gridRows; r++) {
      const y = (h / gridRows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 중앙 축 (0V)
    const midY = h / 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // 전압 스케일 비율 (최대 ±15V 기준)
    const maxScaleV = 16.0;
    const pxPerVolt = (h * 0.42) / maxScaleV;

    // 전원 레일 표시 (+Vcc, -Vcc)
    const vccYPos = midY - this.vSupply * pxPerVolt;
    const vccYNeg = midY + this.vSupply * pxPerVolt;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, vccYPos);
    ctx.lineTo(w, vccYPos);
    ctx.moveTo(0, vccYNeg);
    ctx.lineTo(w, vccYNeg);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.font = `${Math.max(10, Math.floor(w * 0.016))}px monospace`;
    ctx.fillText(`+Vcc (${this.vSupply}V)`, 10, vccYPos - 4);
    ctx.fillText(`-Vcc (-${this.vSupply}V)`, 10, vccYNeg + 14);

    // 1. 입력 신호 (Vin) 그리기 (노란색)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = this.time + (x / w) * Math.PI * 4;
      const vin = this.inAmp * Math.sin(t * this.freq);
      const y = midY - vin * pxPerVolt;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. 출력 신호 (Vout) 그리기 (스카이블루, 포화 클리핑 적용)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = this.time + (x / w) * Math.PI * 4;
      let rawVout = this.inAmp * this.gain * Math.sin(t * this.freq);
      // 클리핑(Saturation) 적용
      let clippedVout = rawVout;
      if (clippedVout > this.vSupply) clippedVout = this.vSupply;
      if (clippedVout < -this.vSupply) clippedVout = -this.vSupply;

      const y = midY - clippedVout * pxPerVolt;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};
