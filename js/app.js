/**
 * app.js
 * SemiLearn 애플리케이션 메인 컨트롤러
 */

(function () {
  'use strict';

  let currentChapterId = 1;
  let activeTab = 'concepts'; // 'concepts', 'lab', 'deepdive', 'resources', 'reader'
  let completedChapters = new Set(JSON.parse(localStorage.getItem('semilearn_completed') || '[]'));
  let currentSimulator = null;

  // DOM 요소 캐시
  const elements = {
    chapterList: document.getElementById('chapter-list'),
    searchInput: document.getElementById('chapter-search'),
    chapterBadge: document.getElementById('chapter-badge'),
    chapterTitleKo: document.getElementById('chapter-title-ko'),
    chapterTitleEn: document.getElementById('chapter-title-en'),
    chapterPages: document.getElementById('chapter-pages'),
    chapterTags: document.getElementById('chapter-tags'),
    chapterDesc: document.getElementById('chapter-desc'),
    
    // 탭 콘텐츠 컨테이너
    tabConcepts: document.getElementById('tab-content-concepts'),
    tabLab: document.getElementById('tab-content-lab'),
    tabDeepdive: document.getElementById('tab-content-deepdive'),
    tabResources: document.getElementById('tab-content-resources'),
    tabReader: document.getElementById('tab-content-reader'),
    
    // 버튼
    prevBtn: document.getElementById('btn-prev-chapter'),
    nextBtn: document.getElementById('btn-next-chapter'),
    completeBtn: document.getElementById('btn-toggle-complete'),
    themeToggle: document.getElementById('theme-toggle'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.getElementById('sidebar'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar')
  };

  // 초기화
  function init() {
    initTheme();
    renderSidebar();
    bindEvents();
    
    // 해시 라우팅 확인 (#ch1, #ch2 등)
    const hash = window.location.hash.replace('#', '');
    const foundCh = window.CHAPTERS_DATA.find(c => c.slug === hash || `ch${c.id}` === hash);
    if (foundCh) {
      currentChapterId = foundCh.id;
    }
    
    loadChapter(currentChapterId);
    updateProgress();
    window.addEventListener('hashchange', () => {
      const slug = window.location.hash.slice(1);
      const chapter = window.CHAPTERS_DATA.find(c => c.slug === slug || `ch${c.id}` === slug);
      if (chapter && chapter.id !== currentChapterId) loadChapter(chapter.id);
    });
  }

  // 테마 초기화
  function initTheme() {
    const isDark = localStorage.getItem('semilearn_theme') === 'dark' || 
                   (!localStorage.getItem('semilearn_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('semilearn_theme', isDark ? 'dark' : 'light');
  }

  // 사이드바 챕터 목록 렌더링
  function renderSidebar(filterQuery = '') {
    if (!elements.chapterList) return;
    elements.chapterList.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();
    const filtered = window.CHAPTERS_DATA.filter(ch => {
      return ch.titleKo.toLowerCase().includes(query) || 
             ch.titleEn.toLowerCase().includes(query) ||
             ch.tags.some(t => t.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
      elements.chapterList.innerHTML = `<li class="p-3 text-xs text-slate-400 text-center">검색 결과가 없습니다.</li>`;
      return;
    }

    // Phase 별 그룹핑
    const phases = [
      { num: 1, name: 'Phase 1: 기초 & 정류기 (Ch 1-3)', badge: '학습 가능' },
      { num: 2, name: 'Phase 2: 트랜지스터 (Ch 4-6)', badge: '준비중' },
      { num: 3, name: 'Phase 3: 전력소자 & Op-Amp (Ch 7-8)', badge: '준비중' },
      { num: 4, name: 'Phase 4: 응용 & 진공관 (Ch 9-13)', badge: '준비중' }
    ];

    phases.forEach(ph => {
      const phChapters = filtered.filter(c => c.phase === ph.num);
      if (phChapters.length === 0) return;

      const groupHeader = document.createElement('div');
      groupHeader.className = 'px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex justify-between items-center';
      groupHeader.innerHTML = `
        <span>${ph.name}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded font-normal ${ph.num === 1 ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700/40 text-slate-400'}">${ph.badge}</span>
      `;
      elements.chapterList.appendChild(groupHeader);

      phChapters.forEach(ch => {
        const isSelected = ch.id === currentChapterId;
        const isDone = completedChapters.has(ch.id);

        const li = document.createElement('li');
        li.className = `group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
          isSelected 
            ? 'bg-sky-600 text-white font-semibold shadow-md' 
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`;

        li.innerHTML = `
          <div class="flex items-center gap-2.5 overflow-hidden">
            <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded text-[10px] font-mono ${
              isSelected ? 'bg-sky-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }">
              ${ch.id}
            </span>
            <div class="truncate">
              <div class="truncate">${ch.titleKo}</div>
              <div class="text-[10px] opacity-75 truncate">${ch.titleEn}</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            ${isDone ? '<span class="text-emerald-400 text-xs">✓</span>' : ''}
            ${ch.status === 'active' ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' : ''}
          </div>
        `;

        li.addEventListener('click', () => {
          loadChapter(ch.id);
          // 모바일 드로어 닫기
          if (window.innerWidth < 1024) {
            elements.sidebar?.classList.add('-translate-x-full');
          }
        });

        elements.chapterList.appendChild(li);
      });
    });
  }

  // 챕터 로딩 및 렌더링
  function loadChapter(chapterId) {
    const chapter = window.CHAPTERS_DATA.find(c => c.id === chapterId);
    if (!chapter) return;

    currentChapterId = chapterId;
    window.location.hash = chapter.slug;

    // 이전 활성 시뮬레이터 중지
    if (currentSimulator && typeof currentSimulator.stop === 'function') {
      currentSimulator.stop();
      currentSimulator.dispose?.();
      currentSimulator = null;
    }

    // 메타데이터 갱신
    if (elements.chapterBadge) elements.chapterBadge.textContent = `Chapter ${chapter.id} · Phase ${chapter.phase}`;
    if (elements.chapterTitleKo) elements.chapterTitleKo.textContent = chapter.titleKo;
    if (elements.chapterTitleEn) elements.chapterTitleEn.textContent = chapter.titleEn;
    if (elements.chapterPages) elements.chapterPages.textContent = `교재 원문: ${chapter.pages}`;
    if (elements.chapterDesc) elements.chapterDesc.textContent = chapter.desc;

    // 태그 렌더링
    if (elements.chapterTags) {
      elements.chapterTags.innerHTML = chapter.tags.map(t => `
        <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
          # ${t}
        </span>
      `).join('');
    }

    // 학습 완료 버튼 상태
    updateCompleteButton();

    // 1. 핵심 개념 탭 렌더링
    renderKeyConcepts(chapter);

    // 2. 심층 탐구 탭 렌더링
    renderDeepDive(chapter);

    // 3. 외부 리소스 탭 렌더링
    renderResources(chapter);

    // Ch 1 교재 읽기 파일럿
    renderReader(chapter);

    // 4. 인터랙티브 랩 탭 준비
    renderLab(chapter);

    // 사이드바 선택 상태 하이라이트 동기화
    renderSidebar(elements.searchInput?.value || '');

    // 이전/다음 버튼 상태
    if (elements.prevBtn) elements.prevBtn.disabled = currentChapterId <= 1;
    if (elements.nextBtn) elements.nextBtn.disabled = currentChapterId >= window.CHAPTERS_DATA.length;

    // 수식 렌더링 (KaTeX)
    renderFormulas();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function renderReader(chapter) {
    if (!elements.tabReader) return;
    if (chapter.id !== 1 || !window.CH1_READER) {
      elements.tabReader.innerHTML = '<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-sm text-slate-600 dark:text-slate-300">교재 원문·번역은 현재 Ch 1에서만 시범 제공됩니다. 다른 장은 아직 작성되지 않았습니다.</div>';
      return;
    }

    const reader = window.CH1_READER;
    elements.tabReader.innerHTML = `
      <div class="space-y-5">
        <div class="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
          <strong>Ch 1 부분 공개 · 절별 원문과 번역</strong><br>
          1.1·1.2절은 본문을 번역했고, 나머지 절은 선정 문장만 번역했습니다. 그림·수식의 완전한 대조본은 아직 아닙니다.
          전체 본문은 <a class="underline font-semibold" href="${reader.source}" target="_blank" rel="noopener noreferrer">공식 교재 Ch 1 ↗</a> 또는 아래 절별 PDF 링크에서 확인하세요.
        </div>
        <nav aria-label="Ch 1 절 목차" class="flex flex-wrap gap-2">
          ${reader.sections.map(section => `<button type="button" data-reader-section="${section.id}" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:border-sky-500">${escapeHtml(section.title)}</button>`).join('')}
        </nav>
        ${reader.sections.map(section => `
          <section id="reader-${section.id}" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-4 md:p-6 scroll-mt-4">
            <div class="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div><h3 class="font-bold text-slate-900 dark:text-white">${escapeHtml(section.title)}</h3><p class="text-xs text-slate-500 dark:text-slate-400">${escapeHtml(section.originalTitle)} · 교재 pp. ${escapeHtml(section.textbookPages)}</p></div>
              <div class="text-xs text-right"><div class="text-amber-700 dark:text-amber-300">${escapeHtml(section.coverage)}</div><a class="underline text-sky-700 dark:text-sky-300" href="SEMI.pdf#page=${section.pdfPage}" target="_blank" rel="noopener noreferrer">원본 PDF 해당 절 ↗</a></div>
            </div>
            ${section.pairs.map(pair => `
              <div id="reader-pair-${pair.id}" class="mb-5 last:mb-0 border-t border-slate-200 dark:border-slate-700 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div lang="en" class="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                  <div class="text-[11px] font-bold text-sky-700 dark:text-sky-400 mb-2">EN · 교재 원문 발췌</div>
                  <p class="text-sm leading-7 text-slate-800 dark:text-slate-200">${escapeHtml(pair.en)}</p>
                </div>
                <div lang="ko" class="rounded-lg bg-sky-50 dark:bg-sky-950/30 p-4">
                  <div class="text-[11px] font-bold text-sky-700 dark:text-sky-400 mb-2">KO · 한국어 번역</div>
                  <p class="text-sm leading-7 text-slate-800 dark:text-slate-200">${escapeHtml(pair.ko)}</p>
                </div>
              </div>
              <div class="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-300"><strong>보충 설명 ·</strong> ${escapeHtml(pair.note)}</div>
              </div>
            `).join('')}
            ${section.formulas?.length ? `
              <div class="mt-5 border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">관련 수식 · 교재 내용을 읽기 쉽게 재표기</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  ${section.formulas.map(formula => `
                    <div class="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 text-xs leading-relaxed">
                      <div class="font-bold text-sky-700 dark:text-sky-300 mb-1">${escapeHtml(formula.name)}</div>
                      <code class="block text-sm whitespace-normal break-words text-slate-900 dark:text-white">${escapeHtml(formula.expression)}</code>
                      <div class="mt-1 text-slate-500 dark:text-slate-400">조건: ${escapeHtml(formula.condition)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${section.subsections?.length ? `
              <div class="mt-5 border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">감쇠기 소절별 원문 발췌·번역</h4>
                <div class="space-y-3">
                  ${section.subsections.map(subsection => `
                    <div id="reader-${subsection.id}" class="rounded-lg border border-slate-200 dark:border-slate-700 p-3 md:p-4">
                      <div class="flex flex-wrap justify-between gap-2 mb-2">
                        <h5 class="text-xs font-bold text-slate-900 dark:text-white">${escapeHtml(subsection.title)}</h5>
                        <a class="text-[11px] underline text-sky-700 dark:text-sky-300" href="SEMI.pdf#page=${subsection.pdfPage}" target="_blank" rel="noopener noreferrer">해당 PDF 쪽 ↗</a>
                      </div>
                      <p lang="en" class="text-xs leading-6 text-slate-600 dark:text-slate-300">${escapeHtml(subsection.en)}</p>
                      <p lang="ko" class="text-xs leading-6 mt-2 text-slate-800 dark:text-slate-100">${escapeHtml(subsection.ko)}</p>
                      <p class="text-xs leading-6 mt-2 text-slate-500 dark:text-slate-400">보충 설명 · ${escapeHtml(subsection.note)}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </section>
        `).join('')}
        <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          원저자 Tony R. Kuphaldt · 로컬 PDF ${escapeHtml(reader.edition)} · <a class="underline" href="${reader.source}" target="_blank" rel="noopener noreferrer">원본 Ch 1</a> ·
          <a class="underline" href="${reader.license}" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
          한국어 번역·보충 설명은 SemiLearn에서 작성했습니다. 원본의 나머지 문장과 그림은 공식 페이지에서 확인할 수 있습니다.
        </p>
      </div>
    `;
  }

  // 핵심 개념 탭 내용 렌더링
  function renderKeyConcepts(chapter) {
    if (!elements.tabConcepts) return;
    
    let html = `
      <div class="space-y-6">
        <!-- 핵심 요약 카드 그리드 -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            핵심 요약 포인트 (Key Takeaways)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            ${(chapter.keyTakeaways || []).map(k => `
              <div class="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:border-sky-500/50 transition-colors">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <span class="text-sky-500 font-bold">•</span> ${k.title}
                </h4>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${k.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 핵심 수식 카드 -->
        ${chapter.formulas && chapter.formulas.length > 0 ? `
          <div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              핵심 공식 & 모델 (Formulas)
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${chapter.formulas.map(f => `
                <div class="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">${f.name}</div>
                  <div class="katex-formula text-sm text-slate-900 dark:text-sky-300 font-mono py-1 overflow-x-auto" data-formula="${f.latex}">
                    $$${f.latex}$$
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    elements.tabConcepts.innerHTML = html;
    if (chapter.id === 1) {
      elements.tabConcepts.insertAdjacentHTML('beforeend', '<button type="button" data-open-reader class="mt-5 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500">Ch 1 교재 원문·번역 보기 →</button>');
    }
  }

  // 심층 탐구 탭 렌더링
  function renderDeepDive(chapter) {
    if (!elements.tabDeepdive) return;
    if (chapter.deepDiveHtml) {
      elements.tabDeepdive.innerHTML = `
        <div class="bg-white dark:bg-slate-800/80 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
          ${chapter.deepDiveHtml}
        </div>
      `;
      if (chapter.id === 1 && window.CH1_READER) {
        const supplement = window.CH1_READER.supplement;
        elements.tabDeepdive.insertAdjacentHTML('beforeend', `
          <article class="mt-5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-5 md:p-6 text-sm leading-relaxed">
            <p class="text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-2">외부 자료를 대조해 작성한 Ch 1 보충 해설</p>
            <h4 class="font-bold text-slate-900 dark:text-white mb-3">${escapeHtml(supplement.title)}</h4>
            <p class="mb-2"><strong>질문:</strong> ${escapeHtml(supplement.question)}</p>
            <p class="mb-2">${escapeHtml(supplement.explanation)}</p>
            <p class="mb-2"><strong>예:</strong> ${escapeHtml(supplement.example)}</p>
            <p class="mb-3"><strong>흔한 오해:</strong> ${escapeHtml(supplement.misconception)}</p>
            <div class="text-xs text-slate-600 dark:text-slate-300"><strong>검증 자료:</strong>
              ${supplement.sources.map(source => `<a class="underline ml-2" href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>`).join('')}
            </div>
            <button type="button" data-open-reader class="mt-4 text-xs font-semibold text-sky-700 dark:text-sky-300 underline">교재 발췌·번역과 비교하기 →</button>
          </article>
        `);
      }
    } else {
      elements.tabDeepdive.innerHTML = `
        <div class="bg-white dark:bg-slate-800/80 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div class="text-3xl mb-2">🚧</div>
          <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200">심층 탐구 콘텐츠 준비 중</h4>
          <p class="text-xs text-slate-500 mt-1">이 챕터의 상세 해설 및 내부 동작 메커니즘은 Phase 진행에 따라 곧 업데이트됩니다.</p>
        </div>
      `;
    }
  }

  // 외부 보충 자료 탭 렌더링
  function renderResources(chapter) {
    if (!elements.tabResources) return;
    if (chapter.resources && chapter.resources.length > 0) {
      elements.tabResources.innerHTML = `
        <div class="space-y-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">본 단원의 이해를 극대화할 수 있도록 엄선된 대화형 시뮬레이션 및 외부 강좌 자료입니다.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            ${chapter.resources.map(r => `
              <a href="${r.url}" target="_blank" rel="noopener noreferrer" 
                 class="block bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:border-sky-500 hover:shadow-md transition-all group">
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    r.type === 'Simulation' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    r.type === 'Interactive' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }">${r.type}</span>
                  <span class="text-slate-400 group-hover:text-sky-500 text-xs">↗ 열기</span>
                </div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 mb-1">
                  ${r.title}
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">${r.desc}</p>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      elements.tabResources.innerHTML = `
        <div class="bg-white dark:bg-slate-800/80 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div class="text-3xl mb-2">📚</div>
          <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200">추천 자료 준비 중</h4>
          <p class="text-xs text-slate-500 mt-1">이 챕터의 검증된 시뮬레이터 링크와 참고 문헌이 순차적으로 추가됩니다.</p>
        </div>
      `;
    }
  }

  // 인터랙티브 랩 탭 준비 및 시뮬레이터 마운트
  function renderLab(chapter) {
    if (!elements.tabLab) return;

    if (chapter.id === 1 && window.SimulatorCh1) {
      elements.tabLab.innerHTML = `<div id="lab-container"></div>`;
      window.SimulatorCh1.init('lab-container');
      currentSimulator = window.SimulatorCh1;
    } else if (chapter.id === 2 && window.SimulatorCh2) {
      elements.tabLab.innerHTML = `<div id="lab-container"></div>`;
      window.SimulatorCh2.init('lab-container');
      currentSimulator = window.SimulatorCh2;
    } else if (chapter.id === 3 && window.SimulatorCh3) {
      elements.tabLab.innerHTML = `<div id="lab-container"></div>`;
      window.SimulatorCh3.init('lab-container');
      currentSimulator = window.SimulatorCh3;
    } else {
      elements.tabLab.innerHTML = `
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-white">
          <div class="text-3xl mb-2">⚡</div>
          <h4 class="text-base font-bold text-slate-200">시뮬레이터 준비 중 (Phase ${chapter.phase})</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            현재 챕터의 전용 인터랙티브 애니메이션 모듈이 개발 진행 중입니다. Phase 1 (Ch 1 ~ 3)의 시뮬레이터를 먼저 체험해 보세요.
          </p>
        </div>
      `;
    }
    if (currentSimulator && activeTab !== 'lab') currentSimulator.stop();
  }

  // KaTeX 수식 렌더링
  function renderFormulas() {
    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(document.getElementById('main-content'), {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX render warning:', err);
      }
    }
  }

  // 탭 전환 처리
  function switchTab(tabId) {
    if (activeTab === 'lab' && tabId !== 'lab') currentSimulator?.stop();
    activeTab = tabId;
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(btn => {
      const target = btn.getAttribute('data-tab-target');
      if (target === tabId) {
        btn.className = 'px-4 py-2.5 text-xs font-bold border-b-2 border-sky-500 text-sky-600 dark:text-sky-400 transition-colors';
      } else {
        btn.className = 'px-4 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors';
      }
    });

    ['concepts', 'lab', 'deepdive', 'resources', 'reader'].forEach(t => {
      const el = document.getElementById(`tab-content-${t}`);
      if (el) {
        if (t === tabId) {
          el.classList.remove('hidden');
          el.classList.add('tab-content-fade');
        } else {
          el.classList.add('hidden');
          el.classList.remove('tab-content-fade');
        }
      }
    });

    // 랩 탭 활성화 시 캔버스 크기 재조정
    if (tabId === 'lab' && currentSimulator && typeof currentSimulator.resizeCanvas === 'function') {
      setTimeout(() => {
        currentSimulator.resizeCanvas();
        currentSimulator.startLoop();
      }, 50);
    }

    renderFormulas();
  }

  // 이벤트 바인딩
  function bindEvents() {
    document.getElementById('main-content')?.addEventListener('click', event => {
      if (event.target.closest('[data-open-reader]')) switchTab('reader');
      const sectionButton = event.target.closest('[data-reader-section]');
      if (sectionButton) document.getElementById(`reader-${sectionButton.dataset.readerSection}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    // 탭 버튼 클릭 이벤트
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        switchTab(target);
      });
    });

    // 이전/다음 챕터
    elements.prevBtn?.addEventListener('click', () => {
      if (currentChapterId > 1) loadChapter(currentChapterId - 1);
    });

    elements.nextBtn?.addEventListener('click', () => {
      if (currentChapterId < window.CHAPTERS_DATA.length) loadChapter(currentChapterId + 1);
    });

    // 검색
    elements.searchInput?.addEventListener('input', (e) => {
      renderSidebar(e.target.value);
    });

    // 다크 모드 토글
    elements.themeToggle?.addEventListener('click', toggleTheme);

    // 사이드바 토글 (모바일)
    elements.sidebarToggle?.addEventListener('click', () => {
      elements.sidebar?.classList.toggle('-translate-x-full');
    });

    // 학습 완료 토글
    elements.completeBtn?.addEventListener('click', toggleComplete);
  }

  function toggleComplete() {
    if (completedChapters.has(currentChapterId)) {
      completedChapters.delete(currentChapterId);
    } else {
      completedChapters.add(currentChapterId);
    }
    localStorage.setItem('semilearn_completed', JSON.stringify([...completedChapters]));
    updateCompleteButton();
    updateProgress();
    renderSidebar(elements.searchInput?.value || '');
  }

  function updateCompleteButton() {
    if (!elements.completeBtn) return;
    const isDone = completedChapters.has(currentChapterId);
    if (isDone) {
      elements.completeBtn.innerHTML = `
        <span class="text-emerald-500">✓</span>
        <span>학습 완료됨</span>
      `;
      elements.completeBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center gap-1.5';
    } else {
      elements.completeBtn.innerHTML = `
        <span>학습 완료로 표시</span>
      `;
      elements.completeBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5';
    }
  }

  function updateProgress() {
    const total = window.CHAPTERS_DATA.length;
    const count = completedChapters.size;
    const pct = Math.round((count / total) * 100);

    if (elements.progressText) elements.progressText.textContent = `${count}/${total} (${pct}%)`;
    if (elements.progressBar) elements.progressBar.style.width = `${pct}%`;
  }

  // 앱 실행
  document.addEventListener('DOMContentLoaded', init);
})();
