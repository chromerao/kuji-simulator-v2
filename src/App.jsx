import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// SVG ICONS
// ============================================================
const IconWrapper = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const AlertCircle = (p) => <IconWrapper {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconWrapper>;
const Sparkles = (p) => <IconWrapper {...p}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></IconWrapper>;
const Plus = (p) => <IconWrapper {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></IconWrapper>;
const Save = (p) => <IconWrapper {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></IconWrapper>;
const Gift = (p) => <IconWrapper {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></IconWrapper>;
const RotateCcw = (p) => <IconWrapper {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></IconWrapper>;
const Trash2 = (p) => <IconWrapper {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></IconWrapper>;
const ToggleLeft = (p) => <IconWrapper {...p}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="8" cy="12" r="2"/></IconWrapper>;
const ToggleRight = (p) => <IconWrapper {...p}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></IconWrapper>;
const Volume2 = (p) => <IconWrapper {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></IconWrapper>;
const VolumeX = (p) => <IconWrapper {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></IconWrapper>;
const ChartPie = (p) => <IconWrapper {...p}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></IconWrapper>;
const Settings = (p) => <IconWrapper {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></IconWrapper>;

// ============================================================
// SOUND ENGINE
// ============================================================
const useSoundEngine = (enabled) => {
  const ctx = useRef(null);
  const getCtx = useCallback(() => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.current.state === 'suspended') ctx.current.resume();
    return ctx.current;
  }, []);
  const playTone = useCallback((freq, type, dur, vol = 0.3, delay = 0) => {
    if (!enabled) return;
    try {
      const ac = getCtx();
      const o = ac.createOscillator(); const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type = type; o.frequency.setValueAtTime(freq, ac.currentTime + delay);
      g.gain.setValueAtTime(0, ac.currentTime + delay);
      g.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
      o.start(ac.currentTime + delay); o.stop(ac.currentTime + delay + dur + 0.05);
    } catch(e) {}
  }, [enabled, getCtx]);
  return {
    draw: () => { playTone(440,'sine',0.15); playTone(660,'sine',0.1,0.2,0.05); },
    win: () => { [523,659,784,1047].forEach((f,i) => playTone(f,'triangle',0.3,0.3,i*0.08)); },
    wish: () => { [523,659,784,1047,1319].forEach((f,i) => playTone(f,'triangle',0.4,0.35,i*0.07)); playTone(2093,'sine',0.5,0.2,0.35); },
    peel: () => { playTone(300,'sawtooth',0.2,0.15); playTone(200,'sawtooth',0.15,0.1,0.08); },
    reveal: () => { playTone(880,'sine',0.2); playTone(1100,'sine',0.15,0.25,0.1); },
    click: () => playTone(600,'square',0.05,0.1),
    reset: () => { playTone(330,'sine',0.1); playTone(220,'sine',0.15,0.2,0.08); },
  };
};

// ============================================================
// PIE CHART
// ============================================================
const PieChart = ({ data, colors }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-center text-gray-400 py-8 text-sm">뽑기 결과가 없습니다</div>;
  let cum = 0;
  const slices = data.map(d => {
    const pct = d.value / total;
    const sa = cum * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const ea = cum * 2 * Math.PI - Math.PI / 2;
    const x1 = 50 + 45 * Math.cos(sa), y1 = 50 + 45 * Math.sin(sa);
    const x2 = 50 + 45 * Math.cos(ea), y2 = 50 + 45 * Math.sin(ea);
    return { ...d, path: `M 50 50 L ${x1} ${y1} A 45 45 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2} Z`, pct };
  });
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-44 h-44 drop-shadow flex-shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={colors[s.grade] || '#6366f1'} stroke="white" strokeWidth="1" opacity="0.9">
            <title>{s.grade}상: {s.value}개 ({(s.pct*100).toFixed(1)}%)</title>
          </path>
        ))}
        <circle cx="50" cy="50" r="20" fill="white"/>
        <text x="50" y="54" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">{total}회</text>
      </svg>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-sm">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[s.grade] || '#6366f1' }}/>
            <span className="text-gray-700 font-medium">{s.grade}상</span>
            <span className="text-gray-900 ml-auto font-bold">{s.value}</span>
            <span className="text-gray-400 text-xs">({(s.pct*100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 쿠지 뜯기 모달 — 왼쪽→오른쪽 수평 슬라이드 (직사각형 티켓)
// ============================================================
const KujiRevealModal = ({ grade, onComplete, sound }) => {
  const [phase, setPhase] = useState('idle'); // idle → sliding → revealed
  const isSpecial = ['A','B','C','라스트원'].includes(grade);

  const timerRef = useRef([]);

  const handlePeel = () => {
    if (phase !== 'idle') return;
    sound.peel();
    setPhase('sliding');
    timerRef.current.push(setTimeout(() => { sound.reveal(); setPhase('revealed'); }, 650));
    timerRef.current.push(setTimeout(() => onComplete(), 2100));
  };

  const handleClick = () => {
    if (phase === 'idle') { handlePeel(); return; }
    // 애니메이션 중 클릭 시 즉시 스킵
    timerRef.current.forEach(t => clearTimeout(t));
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={handleClick}
    >
      <div className="text-center w-full max-w-sm relative z-10 select-none">
        <p className="text-white/80 text-sm font-medium mb-6 tracking-wide">
          {phase === 'idle' ? '👆 터치하여 개봉하세요' : phase === 'sliding' ? '개봉 중... (터치하면 스킵)' : ''}
        </p>

        <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl"
             style={{ width: '320px', height: '180px' }}>

          {/* 결과 레이어 (뒤) */}
          <div className="absolute inset-0 flex items-center justify-center"
               style={{
                 background: isSpecial
                   ? 'linear-gradient(135deg, #fffbeb, #fef3c7, #fde68a)'
                   : 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #bae6fd)',
                 border: isSpecial ? '2px solid #fbbf24' : '2px solid #7dd3fc',
               }}>
            <div className="text-center">
              <div className="text-7xl font-black leading-none"
                   style={{ color: isSpecial ? '#92400e' : '#0369a1' }}>{grade}</div>
              <div className="text-lg font-bold mt-1"
                   style={{ color: isSpecial ? '#b45309' : '#0284c7' }}>
                당첨!{isSpecial ? ' ✨' : ''}
              </div>
            </div>
          </div>

          {/* 금색 티켓 레이어 — 오른쪽으로 슬라이드 */}
          <div className="absolute inset-0"
               style={{
                 background: 'linear-gradient(135deg, #92650a 0%, #c9920a 25%, #f5c842 50%, #c9920a 75%, #92650a 100%)',
                 willChange: 'transform',
                 transition: phase === 'sliding' ? 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                 transform: (phase === 'sliding' || phase === 'revealed') ? 'translateX(115%)' : 'translateX(0)',
                 boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
               }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-black tracking-[0.25em]"
                     style={{ fontSize: '2.8rem', color: '#5c3a00',
                       textShadow: '0 1px 0 rgba(255,255,255,0.3), 0 -1px 0 rgba(0,0,0,0.2)',
                       fontFamily: 'Georgia, serif' }}>KUJI</div>
                {phase === 'idle' && (
                  <div className="text-amber-800/60 text-xs font-bold tracking-widest mt-2 animate-pulse">
                    → 당기세요
                  </div>
                )}
              </div>
            </div>
            <div className="absolute inset-2 rounded-lg pointer-events-none"
                 style={{ border: '1.5px solid rgba(255,255,255,0.4)' }}/>
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.25) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)' }}/>
          </div>

          {phase === 'idle' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-3xl pointer-events-none z-0">→</div>
          )}
        </div>

        {phase === 'revealed' && isSpecial && (
          <div className="mt-6">
            <div className="text-yellow-300 text-xl font-bold animate-pulse">🎉 축하합니다! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 10연차 모달 — 스포트라이트 빔 + 고등급 강조
// ============================================================
const TenPullModal = ({ results, onComplete, sound, getGradeColor, isTopGrade }) => {
  const [revealed, setRevealed] = useState([]);
  const [spotlights, setSpotlights] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    results.forEach((r, i) => {
      setTimeout(() => {
        sound.draw();
        setRevealed(prev => [...prev, i]);
        if (isTopGrade(r.grade) || r.isWish) {
          setTimeout(() => setSpotlights(prev => [...prev, i]), 180);
        }
        if (i === results.length - 1) {
          setTimeout(() => {
            const hasWish = results.some(r2 => r2.isWish);
            const hasTop = results.some(r2 => isTopGrade(r2.grade));
            if (hasWish) sound.wish();
            else if (hasTop) sound.win();
            setDone(true);
          }, 500);
        }
      }, 180 + i * 210);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
         style={{ background: 'rgba(10,15,30,0.88)', backdropFilter: 'blur(12px)' }}>

      <div className="text-white/70 text-sm font-medium mb-5 tracking-wide">
        {done ? `${results.length}연차 완료` : '개봉 중...'}
      </div>

      <div className="grid grid-cols-5 gap-3 mb-8">
        {results.map((r, i) => {
          const isRev = revealed.includes(i);
          const isSpot = spotlights.includes(i);
          const isTop = isTopGrade(r.grade);

          return (
            <div key={i} className="relative flex flex-col items-center" style={{ zIndex: isSpot ? 10 : 1 }}>



              {/* 카드 */}
              <div
                className={[
                  'w-14 h-20 md:w-16 md:h-24 rounded-xl flex items-center justify-center font-black text-xl border-2',
                  isRev ? getGradeColor(r.grade) : 'bg-gray-800 border-gray-700',
                  isRev && r.isWish ? 'ring-4 ring-pink-400 ring-offset-2 ring-offset-transparent' : '',
                ].join(' ')}
                style={{
                  transform: isRev
                    ? (isSpot ? 'scale(1.15) translateY(-4px)' : 'scale(1) translateY(0)')
                    : 'scale(0.8) translateY(8px)',
                  opacity: isRev ? 1 : 0.18,
                  transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: isSpot
                    ? '0 0 0 2px rgba(250,204,21,1), 0 0 24px rgba(250,204,21,0.7), 0 0 48px rgba(250,204,21,0.35), 0 8px 20px rgba(0,0,0,0.5)'
                    : isRev ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                }}>
                {isRev ? (
                  <div className="text-center leading-tight">
                    <div>{r.grade}</div>
                    {r.isWish && <div className="text-xs">💖</div>}
                    {isTop && !r.isWish && <div className="text-xs opacity-75">✨</div>}
                  </div>
                ) : (
                  <div className="text-gray-600 font-black text-base">?</div>
                )}
              </div>

              {/* 등급 라벨 */}
              {isRev && (
                <div className="mt-1.5 text-xs font-bold text-white/60"
                     style={{ animation: 'fadeInUp 0.3s ease' }}>
                  {r.grade}상
                </div>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <button onClick={onComplete}
          className="px-10 py-3 rounded-full font-bold text-base tracking-wide transition-all hover:scale-105 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white',
            animation: 'fadeInUp 0.4s ease' }}>
          확인
        </button>
      )}
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [activeTab, setActiveTab] = useState('draw');
  const [mode, setMode] = useState('custom');
  const DEFAULT_PRIZES = { A: 1, B: 2, C: 2, D: 2, E: 10, F: 15, G: 15, H: 20, I: 13 };
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [wishList, setWishList] = useState({ A: false, B: false, C: false, D: false, E: false, F: false, G: false, H: false, I: false });
  const [remaining, setRemaining] = useState(DEFAULT_PRIZES);
  const [drawn, setDrawn] = useState([]);
  const [pricePerDraw, setPricePerDraw] = useState(15000);
  const [isAnimationOn, setIsAnimationOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [pendingResult, setPendingResult] = useState(null);
  const [pendingTenPull, setPendingTenPull] = useState(null);
  const [showCelebration, setShowCelebration] = useState(null);
  const [newGradeName, setNewGradeName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [customPresets, setCustomPresets] = useState({
    '원피스 해적왕': { prizes: { A: 2, B: 3, C: 5, D: 10, E: 20, F: 30, G: 40, 라스트원: 1 }, price: 15000 },
    '포켓몬 피카츄': { prizes: { A: 1, B: 2, C: 4, D: 8, E: 15, F: 25, G: 35, 라스트원: 1 }, price: 15000 }
  });
  const [newPresetName, setNewPresetName] = useState('');

  const sound = useSoundEngine(isSoundOn);

  useEffect(() => {
    try {
      // v2: 새 버전 키 사용 (기존 저장 데이터 무시)
      const VERSION = 'v2';
      const sp = localStorage.getItem(`kuji_prizes_${VERSION}`);
      const sr = localStorage.getItem(`kuji_remaining_${VERSION}`);
      const sd = localStorage.getItem(`kuji_drawn_${VERSION}`);
      const sc = localStorage.getItem(`kuji_price_${VERSION}`);
      const sa = localStorage.getItem('kuji_animation_on');
      const ss = localStorage.getItem('kuji_sound_on');
      const sw = localStorage.getItem(`kuji_wish_${VERSION}`);
      const scp = localStorage.getItem('kuji_custom_presets');
      if (sp) setPrizes(JSON.parse(sp));
      if (sr) setRemaining(JSON.parse(sr));
      if (sd) setDrawn(JSON.parse(sd));
      if (sc) setPricePerDraw(JSON.parse(sc));
      if (sa !== null) setIsAnimationOn(JSON.parse(sa));
      if (ss !== null) setIsSoundOn(JSON.parse(ss));
      if (sw) setWishList(JSON.parse(sw));
      if (scp) setCustomPresets(JSON.parse(scp));
    } catch(e) {}
  }, []);

  useEffect(() => {
    try {
      const VERSION = 'v2';
      localStorage.setItem(`kuji_prizes_${VERSION}`, JSON.stringify(prizes));
      localStorage.setItem(`kuji_remaining_${VERSION}`, JSON.stringify(remaining));
      localStorage.setItem(`kuji_drawn_${VERSION}`, JSON.stringify(drawn));
      localStorage.setItem(`kuji_price_${VERSION}`, JSON.stringify(pricePerDraw));
      localStorage.setItem('kuji_animation_on', JSON.stringify(isAnimationOn));
      localStorage.setItem('kuji_sound_on', JSON.stringify(isSoundOn));
      localStorage.setItem(`kuji_wish_${VERSION}`, JSON.stringify(wishList));
      localStorage.setItem('kuji_custom_presets', JSON.stringify(customPresets));
    } catch(e) {}
  }, [prizes, remaining, drawn, pricePerDraw, isAnimationOn, isSoundOn, wishList, customPresets]);

  const gradeColorMap = {
    A: '#f59e0b', B: '#ef4444', C: '#8b5cf6', D: '#10b981',
    E: '#3b82f6', F: '#6b7280', G: '#64748b', H: '#0891b2', I: '#7c3aed', 라스트원: '#dc2626',
  };
  const gradeBgMap = {
    A: 'bg-amber-400 text-amber-900', B: 'bg-red-500 text-white',
    C: 'bg-violet-500 text-white', D: 'bg-emerald-500 text-white',
    E: 'bg-blue-500 text-white', F: 'bg-gray-500 text-white',
    G: 'bg-slate-500 text-white', H: 'bg-cyan-600 text-white',
    I: 'bg-violet-700 text-white', 라스트원: 'bg-red-700 text-yellow-200 border border-yellow-400',
  };
  const getGradeColor = (g) => gradeBgMap[g] || 'bg-indigo-500 text-white';
  const getGradeHex = (g) => gradeColorMap[g] || '#6366f1';

  const isTopGrade = (grade) => {
    const total = Object.values(prizes).reduce((s, c) => s + c, 0);
    const pct = total > 0 ? ((prizes[grade] || 0) / total) * 100 : 0;
    return pct <= 10 || grade === '라스트원' || ['A','B','C'].includes(grade);
  };

  const totalPrizes = Object.values(prizes).reduce((s, c) => s + c, 0);
  const remainingTotal = Object.values(remaining).reduce((s, c) => s + c, 0);
  const totalCost = drawn.length * pricePerDraw;
  const getAvailablePool = () =>
    Object.entries(remaining).filter(([_, c]) => c > 0).flatMap(([g, c]) => Array(c).fill(g));

  const drawPrize = () => {
    const pool = getAvailablePool();
    if (!pool.length) return;
    sound.draw();
    const grade = pool[Math.floor(Math.random() * pool.length)];
    const result = { grade, number: drawn.length + 1, timestamp: new Date().toLocaleTimeString(), isWish: !!wishList[grade] };
    const newRemaining = { ...remaining, [grade]: remaining[grade] - 1 };
    setRemaining(newRemaining);
    if (isAnimationOn) setPendingResult({ ...result, _newRemaining: newRemaining });
    else finalizeDraw([result], newRemaining);
  };

  const drawTen = () => {
    const pool = getAvailablePool();
    if (!pool.length) return;
    const count = Math.min(10, pool.length);
    const results = [];
    const tmp = [...pool];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * tmp.length);
      const grade = tmp.splice(idx, 1)[0];
      results.push({ grade, number: drawn.length + 1 + i, timestamp: new Date().toLocaleTimeString(), isWish: !!wishList[grade] });
    }
    const nr = { ...remaining };
    results.forEach(r => nr[r.grade]--);
    setRemaining(nr);
    if (isAnimationOn) setPendingTenPull({ results, newRemaining: nr });
    else finalizeDraw(results, nr);
  };

  const finalizeDraw = (results, newRemaining) => {
    setDrawn(prev => [...prev, ...results]);
    setPendingResult(null); setPendingTenPull(null);

    // 라스트원 등록돼 있고 뽑기 후 남은 수량이 0이면 특별 연출
    const afterTotal = newRemaining
      ? Object.values(newRemaining).reduce((s, c) => s + c, 0)
      : 0;
    if (afterTotal === 0 && prizes['라스트원'] !== undefined) {
      setTimeout(() => { sound.wish(); triggerCelebration('라스트원', false, true); }, 200);
      return;
    }

    const hasWish = results.some(r => r.isWish);
    const hasTop = results.some(r => isTopGrade(r.grade));
    if (hasWish) { sound.wish(); triggerCelebration(results.find(r => r.isWish).grade, true, false); }
    else if (hasTop) { sound.win(); triggerCelebration(results.find(r => isTopGrade(r.grade)).grade, false, false); }
  };

  // 클릭 스킵 가능한 축하 연출 — isLastOne: 라스트원 전용
  const triggerCelebration = (grade, isWish, isLastOne = false) => {
    setShowCelebration({ grade, isWish, isLastOne });
    setTimeout(() => setShowCelebration(null), 4000);
  };
  const skipCelebration = () => setShowCelebration(null);

  const handleCustomChange = (grade, value) => {
    const v = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    setPrizes(p => ({ ...p, [grade]: v }));
    setRemaining(p => ({ ...p, [grade]: v }));
  };
  const addNewGrade = () => {
    if (!newGradeName.trim() || prizes[newGradeName]) return;
    sound.click();
    setPrizes(p => ({ ...p, [newGradeName]: 0 }));
    setRemaining(p => ({ ...p, [newGradeName]: 0 }));
    setNewGradeName('');
  };
  const confirmRemoveGrade = (g) => { sound.click(); setConfirmDialog({ type: 'grade', target: g, message: `${g}상을 삭제하시겠습니까?` }); };
  const executeRemoveGrade = (g) => {
    const filter = obj => Object.fromEntries(Object.entries(obj).filter(([k]) => k !== g));
    setPrizes(filter); setRemaining(filter); setWishList(filter);
    setDrawn(prev => prev.filter(d => d.grade !== g));
    setConfirmDialog(null);
  };
  const saveAsPreset = () => {
    if (!newPresetName.trim()) return;
    sound.click();
    if (customPresets[newPresetName]) setConfirmDialog({ type: 'overwrite', target: newPresetName, message: `"${newPresetName}" 프리셋을 덮어쓰시겠습니까?` });
    else executeSavePreset(newPresetName);
  };
  const executeSavePreset = (name) => {
    setCustomPresets(prev => ({ ...prev, [name]: { prizes: { ...prizes }, price: pricePerDraw } }));
    setNewPresetName(''); setConfirmDialog(null);
  };
  const loadPreset = (name) => {
    sound.click();
    const p = customPresets[name];
    setPrizes({ ...p.prizes }); setRemaining({ ...p.prizes }); setPricePerDraw(p.price); setDrawn([]);
    const nw = {}; for (const k in p.prizes) nw[k] = k === '라스트원';
    setWishList(nw);
  };
  const confirmDeletePreset = (n) => { sound.click(); setConfirmDialog({ type: 'preset', target: n, message: `"${n}" 프리셋을 삭제하시겠습니까?` }); };
  const executeDeletePreset = (n) => {
    const np = { ...customPresets }; delete np[n]; setCustomPresets(np); setConfirmDialog(null);
  };
  const handleConfirm = () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === 'grade') executeRemoveGrade(confirmDialog.target);
    else if (confirmDialog.type === 'preset') executeDeletePreset(confirmDialog.target);
    else if (confirmDialog.type === 'overwrite') executeSavePreset(confirmDialog.target);
  };
  const reset = () => { sound.reset(); setRemaining({ ...prizes }); setDrawn([]); };
  const getDrawnStats = () => { const s = {}; drawn.forEach(d => s[d.grade] = (s[d.grade] || 0) + 1); return s; };
  const pieData = Object.entries(getDrawnStats()).map(([grade, value]) => ({ grade, value }));

  // 라이트 테마 스타일
  const s = {
    bg: 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100',
    card: { background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
    cardInner: { background: '#f9fafb', border: '1px solid #e5e7eb' },
    input: { background: 'white', border: '1px solid #d1d5db', color: '#111827', outline: 'none' },
    goldBtn: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' },
    redBtn: { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 3px 10px rgba(239,68,68,0.3)' },
    greenBtn: { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' },
    tab: (active) => active
      ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }
      : { background: 'white', border: '1px solid #e5e7eb', color: '#9ca3af' },
    modeTab: (active) => active
      ? { background: '#111827', color: 'white' }
      : { background: '#f3f4f6', color: '#6b7280' },
  };

  return (
    <div className={s.bg}>
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}/>

      {/* MODALS */}
      {pendingResult && (
        <KujiRevealModal grade={pendingResult.grade} onComplete={() => finalizeDraw([pendingResult], pendingResult._newRemaining)} sound={sound}/>
      )}
      {pendingTenPull && (
        <TenPullModal results={pendingTenPull.results} onComplete={() => finalizeDraw(pendingTenPull.results, pendingTenPull.newRemaining)}
          sound={sound} getGradeColor={getGradeColor} isTopGrade={isTopGrade}/>
      )}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 max-w-sm w-full shadow-2xl" style={s.card}>
            <div className="flex items-start gap-3 mb-5">
              <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={22}/>
              <p className="text-gray-800 font-medium leading-snug">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDialog(null)} className="px-5 py-2 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">취소</button>
              <button onClick={handleConfirm} className="px-5 py-2 rounded-xl font-bold transition-all hover:scale-105" style={s.redBtn}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 상위상 연출 — 클릭 스킵 */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-auto z-40 flex items-center justify-center cursor-pointer"
             onClick={skipCelebration}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"/>
          {showCelebration.isLastOne ? (
            <div className="z-10 text-center px-10 py-10 rounded-3xl shadow-2xl"
                 style={{
                   background: 'linear-gradient(135deg, #1a0a00, #3b1200)',
                   border: '3px solid #f59e0b',
                   boxShadow: '0 0 80px rgba(245,158,11,0.7), 0 0 160px rgba(245,158,11,0.3)',
                   animation: 'lastOnePulse 0.6s ease-in-out infinite alternate',
                 }}>
              <div className="text-5xl mb-3">🏆</div>
              <div className="text-4xl font-black mb-2" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251,191,36,0.8)' }}>
                라스트원!
              </div>
              <div className="text-xl font-bold mb-1" style={{ color: '#fde68a' }}>
                모든 쿠지를 소진했습니다!
              </div>
              <div className="text-base mt-2" style={{ color: '#f59e0b' }}>✨ 완전 클리어 ✨</div>
              <div className="text-xs text-amber-700 mt-4">화면을 터치하면 닫힙니다</div>
            </div>
          ) : (
            <div className="z-10 text-center px-10 py-8 rounded-3xl shadow-2xl animate-bounce"
                 style={{
                   background: showCelebration.isWish
                     ? 'linear-gradient(135deg, #fdf2f8, #fce7f3)'
                     : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                   border: showCelebration.isWish ? '2px solid #f9a8d4' : '2px solid #fbbf24',
                   boxShadow: showCelebration.isWish ? '0 0 50px rgba(236,72,153,0.35)' : '0 0 50px rgba(245,158,11,0.45)',
                 }}>
              <Sparkles className="mx-auto mb-2" size={48} style={{ color: showCelebration.isWish ? '#ec4899' : '#f59e0b' }}/>
              <div className="text-3xl font-black mb-1" style={{ color: showCelebration.isWish ? '#be185d' : '#92400e' }}>
                {showCelebration.isWish ? '💖 위시 획득!' : '🎉 축하합니다!'}
              </div>
              <div className="text-xl font-bold" style={{ color: showCelebration.isWish ? '#db2777' : '#b45309' }}>
                {showCelebration.grade}상 당첨!
              </div>
              <div className="text-xs text-gray-400 mt-3">화면을 터치하면 닫힙니다</div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 relative">
        {/* HEADER */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-3 mb-1">
            {/* 쿠지 종이 SVG 아이콘 */}
            <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="36" height="44" rx="4" fill="url(#kujiGold)" stroke="#b8860b" strokeWidth="1.5"/>
              <rect x="4" y="4" width="30" height="38" rx="2.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 2"/>
              <text x="19" y="26" textAnchor="middle" fill="#5c3a00" fontSize="11" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1">KUJI</text>
              <line x1="8" y1="31" x2="30" y2="31" stroke="#b8860b" strokeWidth="0.8" opacity="0.5"/>
              <defs>
                <linearGradient id="kujiGold" x1="0" y1="0" x2="38" y2="46" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f5c842"/>
                  <stop offset="40%" stopColor="#c9920a"/>
                  <stop offset="70%" stopColor="#f5c842"/>
                  <stop offset="100%" stopColor="#92650a"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              쿠지 시뮬레이터
            </h1>
          </div>
          <p className="text-gray-400 text-sm">쿠지 운을 시험하세요 !</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => { setIsSoundOn(v => !v); sound.click(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
              style={s.tab(isSoundOn)}>
              {isSoundOn ? <Volume2 size={13}/> : <VolumeX size={13}/>}
              소리 {isSoundOn ? 'ON' : 'OFF'}
            </button>
            <button onClick={() => { setIsAnimationOn(v => !v); sound.click(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
              style={s.tab(isAnimationOn)}>
              {isAnimationOn ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>}
              연출 {isAnimationOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-5">
          {[['draw','뽑기',Gift],['settings','설정',Settings],['stats','통계',ChartPie]].map(([id,label,Icon]) => (
            <button key={id} onClick={() => { setActiveTab(id); sound.click(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={s.tab(activeTab === id)}>
              <Icon size={15}/>{label}
            </button>
          ))}
        </div>

        {/* ===== 뽑기 탭 ===== */}
        {activeTab === 'draw' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 grid grid-cols-3 gap-3 text-center" style={s.card}>
              {[['남은 수량',`${remainingTotal}개`,'text-blue-600'],['뽑은 횟수',`${drawn.length}회`,'text-amber-600'],['총 비용',`${totalCost.toLocaleString()}원`,'text-red-500']].map(([l,v,c]) => (
                <div key={l}><div className="text-gray-400 text-xs mb-0.5">{l}</div><div className={`font-black text-lg ${c}`}>{v}</div></div>
              ))}
            </div>

            <div className="rounded-2xl p-4" style={s.card}>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>진행률</span>
                <span className="text-amber-600 font-bold">{totalPrizes > 0 ? ((drawn.length/totalPrizes)*100).toFixed(1) : 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width:`${totalPrizes > 0 ? (drawn.length/totalPrizes)*100 : 0}%`, background:'linear-gradient(90deg,#f59e0b,#ef4444)' }}/>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={s.card}>
              <div className="text-gray-400 text-xs font-medium mb-3">남은 상품</div>
              <div className="space-y-2">
                {Object.entries(remaining).map(([grade, count]) => {
                  const prob = remainingTotal > 0 ? ((count/remainingTotal)*100).toFixed(1) : '0.0';
                  return (
                    <div key={grade} className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold flex-shrink-0 min-w-[56px] text-center ${getGradeColor(grade)}`}>
                        {grade}상{wishList[grade] ? ' 💖' : ''}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${prob}%`, backgroundColor: getGradeHex(grade) }}/>
                      </div>
                      <span className="text-gray-400 text-xs w-12 text-right">{prob}%</span>
                      <span className="text-gray-800 font-bold text-sm w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={drawPrize} disabled={remainingTotal === 0}
                className="py-5 rounded-2xl font-black text-sm tracking-wide transition-all hover:scale-105 active:scale-95 disabled:opacity-30 flex flex-col items-center gap-0.5"
                style={s.goldBtn}>
                <div className="flex items-center gap-1.5 text-base"><Gift size={18}/>1연차</div>
                <div className="text-xs opacity-80">{pricePerDraw.toLocaleString()}원</div>
              </button>
              <button onClick={drawTen} disabled={remainingTotal === 0}
                className="py-5 rounded-2xl font-black text-sm tracking-wide transition-all hover:scale-105 active:scale-95 disabled:opacity-30 flex flex-col items-center gap-0.5"
                style={s.redBtn}>
                <div className="flex items-center gap-1.5 text-base"><Sparkles size={18}/>10연차</div>
                <div className="text-xs opacity-80">{(pricePerDraw*10).toLocaleString()}원</div>
              </button>
            </div>

            <button onClick={reset} className="w-full py-3 rounded-2xl font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <RotateCcw size={15}/>초기화
            </button>

            {drawn.length > 0 && (
              <div className="rounded-2xl p-4" style={s.card}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-400 text-xs font-medium">결과 히스토리</div>
                  <button onClick={() => setDrawn([])} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={13}/>지우기
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto">
                  {drawn.slice().reverse().map((item, i) => (
                    <div key={drawn.length-i}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center font-black text-sm shadow-sm ${getGradeColor(item.grade)} ${item.isWish ? 'ring-2 ring-pink-400' : ''}`}>
                      <div>{item.grade}</div>
                      {item.isWish && <div className="text-xs leading-none">💖</div>}
                      <div className="text-xs opacity-40 font-normal">#{item.number}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== 설정 탭 ===== */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4" style={s.card}>
              <div className="flex gap-2 mb-4">
                {['custom','preset'].map(m => (
                  <button key={m} onClick={() => { setMode(m); sound.click(); }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={s.modeTab(mode === m)}>
                    {m === 'custom' ? '커스텀 설정' : '프리셋 선택'}
                  </button>
                ))}
              </div>
              {mode === 'custom' ? (
                <div className="space-y-4">
                  <div className="rounded-xl p-3 space-y-2" style={s.cardInner}>
                    <div className="flex gap-2">
                      <input type="text" value={newGradeName} onChange={e => setNewGradeName(e.target.value)}
                        placeholder="새 등급 이름 (예: SS)" className="flex-1 rounded-lg px-3 py-2 text-sm"
                        style={s.input} onKeyPress={e => e.key === 'Enter' && addNewGrade()}/>
                      <button onClick={addNewGrade} className="px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1 hover:scale-105 transition-transform" style={s.goldBtn}>
                        <Plus size={15}/>추가
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newPresetName} onChange={e => setNewPresetName(e.target.value)}
                        placeholder="프리셋으로 저장" className="flex-1 rounded-lg px-3 py-2 text-sm"
                        style={s.input} onKeyPress={e => e.key === 'Enter' && saveAsPreset()}/>
                      <button onClick={saveAsPreset} className="px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1 hover:scale-105 transition-transform" style={s.greenBtn}>
                        <Save size={15}/>저장
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(prizes).map(([grade, count]) => (
                      <div key={grade} className="rounded-xl p-3 flex items-center gap-2" style={s.cardInner}>
                        <input type="checkbox" checked={wishList[grade] || false}
                          onChange={e => setWishList(p => ({ ...p, [grade]: e.target.checked }))}
                          className="w-4 h-4 accent-pink-500 flex-shrink-0"/>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold flex-shrink-0 ${getGradeColor(grade)}`}>{grade}상</span>
                        <input type="number" min="0" value={count || ''} placeholder="0"
                          onChange={e => handleCustomChange(grade, e.target.value)}
                          className="flex-1 rounded-lg px-3 py-1.5 text-sm min-w-0" style={s.input}/>
                        <button onClick={() => confirmRemoveGrade(grade)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 hover:scale-105 transition-transform" style={s.redBtn}>삭제</button>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3" style={s.cardInner}>
                    <label className="text-gray-500 text-xs font-medium block mb-2">1회 가격 (원)</label>
                    <input type="number" min="0" value={pricePerDraw || ''} placeholder="0"
                      onChange={e => setPricePerDraw(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg px-3 py-2 text-sm" style={s.input}/>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.keys(customPresets).length === 0 && (
                    <div className="text-center text-gray-400 py-10 text-sm">저장된 프리셋이 없습니다</div>
                  )}
                  {Object.keys(customPresets).map(name => (
                    <div key={name} className="flex gap-2">
                      <button onClick={() => loadPreset(name)} className="flex-1 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform" style={s.goldBtn}>{name}</button>
                      <button onClick={() => confirmDeletePreset(name)} className="px-4 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform" style={s.redBtn}>삭제</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== 통계 탭 ===== */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={s.card}>
              <div className="text-gray-400 text-xs font-medium mb-4">등급별 획득 비율</div>
              <PieChart data={pieData} colors={gradeColorMap}/>
            </div>
            <div className="rounded-2xl p-5" style={s.card}>
              <div className="text-gray-400 text-xs font-medium mb-3">요약 통계</div>
              <div className="space-y-0">
                {[
                  ['총 뽑기 횟수',`${drawn.length}회`,'text-gray-900'],
                  ['총 비용',`${totalCost.toLocaleString()}원`,'text-red-500'],
                  ['남은 수량',`${remainingTotal}개`,'text-blue-600'],
                  ['진행률',`${totalPrizes > 0 ? ((drawn.length/totalPrizes)*100).toFixed(1) : 0}%`,'text-amber-600'],
                  ['위시 획득',`${drawn.filter(d=>d.isWish).length}개`,'text-pink-500'],
                  ['고등급 획득',`${drawn.filter(d=>isTopGrade(d.grade)).length}개`,'text-purple-600'],
                ].map(([label,val,cls]) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className={`font-bold text-sm ${cls}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {drawn.length > 0 && (
              <div className="rounded-2xl p-5" style={s.card}>
                <div className="text-gray-400 text-xs font-medium mb-3">획득 현황</div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(getDrawnStats()).sort((a,b) => Object.keys(prizes).indexOf(a[0])-Object.keys(prizes).indexOf(b[0])).map(([g,c]) => (
                    <div key={g} className={`p-3 rounded-xl text-center ${getGradeColor(g)}`}>
                      <div className="font-bold text-sm flex items-center justify-center gap-0.5">{g}상 {isTopGrade(g)&&<Sparkles size={10}/>}</div>
                      <div className="font-black text-2xl">{c}</div>
                      <div className="text-xs opacity-60">개</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8 text-gray-300 text-xs">쿠지 시뮬레이터 © 2025</div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:0.4;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:2px;}
        @keyframes lastOnePulse {
          from { transform: scale(1); box-shadow: 0 0 80px rgba(245,158,11,0.7), 0 0 160px rgba(245,158,11,0.3); }
          to   { transform: scale(1.04); box-shadow: 0 0 120px rgba(245,158,11,0.9), 0 0 220px rgba(245,158,11,0.5); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes beamDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
