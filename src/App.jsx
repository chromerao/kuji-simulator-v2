import { useState, useEffect } from 'react';

// --- 아이콘 컴포넌트 (SVG) ---
const IconWrapper = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const AlertCircle = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></IconWrapper>;
const Sparkles = (props) => <IconWrapper {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></IconWrapper>;
const Plus = (props) => <IconWrapper {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></IconWrapper>;
const Save = (props) => <IconWrapper {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></IconWrapper>;
const Gift = (props) => <IconWrapper {...props}><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></IconWrapper>;
const RotateCcw = (props) => <IconWrapper {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></IconWrapper>;
const Trash2 = (props) => <IconWrapper {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></IconWrapper>;
const ToggleLeft = (props) => <IconWrapper {...props}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect><circle cx="8" cy="12" r="2"></circle></IconWrapper>;
const ToggleRight = (props) => <IconWrapper {...props}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect><circle cx="16" cy="12" r="2"></circle></IconWrapper>;

// --- 쿠지 뜯기 모달 컴포넌트 ---
const KujiRevealModal = ({ grade, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handlePeel = () => {
    setIsOpen(true);
    setTimeout(() => onComplete(), 1500);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="text-center w-full max-w-sm">
        <h2 className="text-white text-2xl font-bold mb-8 animate-pulse">터치해서 뜯으세요! 👇</h2>
        <div onClick={handlePeel} className="relative w-64 h-64 mx-auto cursor-pointer perspective-1000 group select-none" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center border-4 border-gray-300 shadow-inner">
            <div className="text-center">
              <div className="text-6xl font-black text-gray-800">{grade}</div>
              <div className="text-xl font-bold text-gray-500 mt-2">상 당첨!</div>
            </div>
          </div>
          <div className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-xl flex items-center justify-center border-4 border-white transition-all duration-700 origin-bottom-right transform style-preserve-3d ${isOpen ? 'rotate-[-120deg] translate-x-full opacity-0' : 'hover:scale-105'}`} style={{ transformOrigin: 'bottom right', transition: 'transform 0.8s ease-in-out, opacity 0.8s' }}>
            <div className="text-center border-4 border-dashed border-white/30 p-4 rounded bg-white/10 w-full h-full flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-white mb-2">KUJI</div>
              <div className="text-white/80 text-sm font-bold">PULL HERE</div>
              <div className="mt-4 animate-bounce text-white">▲</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 메인 앱 컴포넌트 ---
function App() {
  const [mode, setMode] = useState('custom');
  const [prizes, setPrizes] = useState({ A: 2, B: 3, C: 5, D: 10, E: 15, 라스트원: 1 });
  const [wishList, setWishList] = useState({ A: false, B: false, C: false, D: false, E: false, 라스트원: true });
  const [remaining, setRemaining] = useState({...prizes});
  const [drawn, setDrawn] = useState([]);
  const [pricePerDraw, setPricePerDraw] = useState(700);
  
  const [isAnimationOn, setIsAnimationOn] = useState(true);
  const [pendingResult, setPendingResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(null);

  const [newGradeName, setNewGradeName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [customPresets, setCustomPresets] = useState({
    '원피스 해적왕': { prizes: { A: 2, B: 3, C: 5, D: 10, E: 20, F: 30, G: 40, 라스트원: 1 }, price: 700 },
    '포켓몬 피카츄': { prizes: { A: 1, B: 2, C: 4, D: 8, E: 15, F: 25, G: 35, 라스트원: 1 }, price: 700 }
  });
  const [newPresetName, setNewPresetName] = useState('');

  // LocalStorage 로드
  useEffect(() => {
    const savedPrizes = localStorage.getItem('kuji_prizes');
    const savedRemaining = localStorage.getItem('kuji_remaining');
    const savedDrawn = localStorage.getItem('kuji_drawn');
    const savedPrice = localStorage.getItem('kuji_price');
    const savedAnim = localStorage.getItem('kuji_animation_on');

    if (savedPrizes) setPrizes(JSON.parse(savedPrizes));
    if (savedRemaining) setRemaining(JSON.parse(savedRemaining));
    if (savedDrawn) setDrawn(JSON.parse(savedDrawn));
    if (savedPrice) setPricePerDraw(JSON.parse(savedPrice));
    if (savedAnim !== null) setIsAnimationOn(JSON.parse(savedAnim));
  }, []);

  // LocalStorage 저장
  useEffect(() => {
    localStorage.setItem('kuji_prizes', JSON.stringify(prizes));
    localStorage.setItem('kuji_remaining', JSON.stringify(remaining));
    localStorage.setItem('kuji_drawn', JSON.stringify(drawn));
    localStorage.setItem('kuji_price', JSON.stringify(pricePerDraw));
    localStorage.setItem('kuji_animation_on', JSON.stringify(isAnimationOn));
  }, [prizes, remaining, drawn, pricePerDraw, isAnimationOn]);

  const gradeColors = {
    A: 'bg-yellow-400 text-yellow-900', B: 'bg-orange-400 text-orange-900',
    C: 'bg-pink-400 text-pink-900', D: 'bg-purple-400 text-purple-900',
    E: 'bg-blue-400 text-blue-900', F: 'bg-green-400 text-green-900',
    G: 'bg-gray-400 text-gray-900', 라스트원: 'bg-red-500 text-white'
  };
  const getGradeColor = (grade) => gradeColors[grade] || 'bg-indigo-400 text-indigo-900';
  
  const isTopGrade = (grade) => {
    const totalPrizes = Object.values(prizes).reduce((sum, count) => sum + count, 0);
    const gradeCount = prizes[grade] || 0;
    const percentage = (gradeCount / totalPrizes) * 100;
    return percentage <= 10 || grade === '라스트원' || ['A', 'B', 'C'].includes(grade);
  };

  const handleCustomChange = (grade, value) => {
    if (value === '') {
        const newPrizes = {...prizes, [grade]: 0};
        setPrizes(newPrizes);
        setRemaining(prev => ({...prev, [grade]: 0}));
        return;
    }
    const newValue = Math.max(0, parseInt(value) || 0);
    const newPrizes = {...prizes, [grade]: newValue};
    setPrizes(newPrizes);
    setRemaining(prev => ({...prev, [grade]: newValue}));
  };

  const handlePriceChange = (value) => {
    if (value === '') { setPricePerDraw(0); return; }
    setPricePerDraw(Math.max(0, parseInt(value) || 0));
  };

  const drawPrize = () => {
    const availableGrades = Object.entries(remaining)
      .filter(([_, count]) => count > 0)
      .flatMap(([grade, count]) => Array(count).fill(grade));
    
    if (availableGrades.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableGrades.length);
    const drawnGrade = availableGrades[randomIndex];
    const isWish = wishList[drawnGrade];
    
    setRemaining(prev => ({ ...prev, [drawnGrade]: prev[drawnGrade] - 1 }));
    
    const resultData = {
      grade: drawnGrade,
      number: drawn.length + 1,
      timestamp: new Date().toLocaleTimeString(),
      isWish: isWish
    };

    if (isAnimationOn) {
      setPendingResult(resultData);
    } else {
      finalizeDraw(resultData);
    }
  };

  const finalizeDraw = (resultData) => {
    setDrawn(prev => [...prev, resultData]);
    setPendingResult(null);
    if (resultData.isWish || isTopGrade(resultData.grade)) {
      triggerCelebration(resultData.grade, resultData.isWish);
    }
  };

  const triggerCelebration = (grade, isWish = false) => {
    setShowCelebration({ grade, isWish });
    setTimeout(() => setShowCelebration(null), 3000);
  };

  const addNewGrade = () => {
    if (!newGradeName.trim() || prizes[newGradeName]) return;
    setPrizes({...prizes, [newGradeName]: 0});
    setRemaining(prev => ({...prev, [newGradeName]: 0}));
    setNewGradeName('');
  };

  const confirmRemoveGrade = (g) => setConfirmDialog({ type: 'grade', target: g, message: `${g}상을 삭제하시겠습니까?` });
  const executeRemoveGrade = (gradeToRemove) => {
    const newPrizesObj = {}; const newRemainingObj = {}; const newWishListObj = {};
    for (const key in prizes) {
      if (key !== gradeToRemove) {
        newPrizesObj[key] = prizes[key];
        newRemainingObj[key] = remaining[key];
        newWishListObj[key] = wishList[key];
      }
    }
    setPrizes(newPrizesObj); setRemaining(newRemainingObj); setWishList(newWishListObj);
    setDrawn(prev => prev.filter(item => item.grade !== gradeToRemove));
    setConfirmDialog(null);
  };

  const saveAsPreset = () => {
    if (!newPresetName.trim()) return;
    if (customPresets[newPresetName]) {
      setConfirmDialog({ type: 'overwrite', target: newPresetName, message: `"${newPresetName}" 프리셋이 이미 존재합니다. 덮어쓰시겠습니까?` });
    } else { executeSavePreset(newPresetName); }
  };
  const executeSavePreset = (name) => {
    setCustomPresets(prev => ({ ...prev, [name]: { prizes: {...prizes}, price: pricePerDraw } }));
    setNewPresetName(''); setConfirmDialog(null);
  };
  const loadPreset = (name) => {
    const preset = customPresets[name];
    setPrizes({...preset.prizes}); setRemaining({...preset.prizes}); setPricePerDraw(preset.price); setDrawn([]);
    const newWish = {}; for (const k in preset.prizes) newWish[k] = k === '라스트원';
    setWishList(newWish);
  };
  const confirmDeletePreset = (n) => setConfirmDialog({ type: 'preset', target: n, message: `"${n}" 프리셋을 삭제하시겠습니까?` });
  const executeDeletePreset = (n) => {
    const newPresets = {...customPresets}; delete newPresets[n];
    setCustomPresets(newPresets); setConfirmDialog(null);
  };
  const handleConfirm = () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === 'grade') executeRemoveGrade(confirmDialog.target);
    else if (confirmDialog.type === 'preset') executeDeletePreset(confirmDialog.target);
    else if (confirmDialog.type === 'overwrite') executeSavePreset(confirmDialog.target);
  };
  const reset = () => { setRemaining({...prizes}); setDrawn([]); };
  const getDrawnStats = () => {
    const stats = {}; drawn.forEach(item => stats[item.grade] = (stats[item.grade] || 0) + 1);
    return stats;
  };

  const totalPrizes = Object.values(prizes).reduce((sum, count) => sum + count, 0);
  const remainingTotal = Object.values(remaining).reduce((sum, count) => sum + count, 0);
  const totalCost = drawn.length * pricePerDraw;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6 relative overflow-hidden">
      {pendingResult && (
        <KujiRevealModal grade={pendingResult.grade} onComplete={() => finalizeDraw(pendingResult)} />
      )}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="text-orange-500 flex-shrink-0" size={24} />
              <p className="text-lg font-semibold">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDialog(null)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition">취소</button>
              <button onClick={handleConfirm} className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">확인</button>
            </div>
          </div>
        </div>
      )}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce z-50">
            <div className={`${showCelebration.isWish ? 'bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600' : 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'} text-white px-12 py-8 rounded-2xl shadow-2xl text-center transform scale-110`}>
              <Sparkles className="mx-auto mb-4" size={64} />
              <div className="text-5xl font-bold mb-2">{showCelebration.isWish ? '위시 획득! 💖' : '축하합니다! 🎉'}</div>
              <div className="text-3xl font-bold">{showCelebration.grade}상 당첨!</div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-purple-800 mb-2">쿠지 시뮬레이터</h1>
            <p className="text-gray-600">실제 도전 전에 운을 시험해보세요!</p>
          </div>
          <button onClick={() => setIsAnimationOn(!isAnimationOn)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md transition-all ${isAnimationOn ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            <span>연출 {isAnimationOn ? 'ON' : 'OFF'}</span>
            {isAnimationOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button onClick={() => setMode('custom')} className={`px-6 py-3 rounded-lg font-semibold transition ${mode === 'custom' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>커스텀 설정</button>
            <button onClick={() => setMode('preset')} className={`px-6 py-3 rounded-lg font-semibold transition ${mode === 'preset' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>프리셋 선택</button>
          </div>

          {mode === 'custom' ? (
            <div>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newGradeName} onChange={(e) => setNewGradeName(e.target.value)} placeholder="새 등급 이름" className="flex-1 border-2 border-gray-300 rounded px-3 py-2 outline-none" onKeyPress={(e) => e.key === 'Enter' && addNewGrade()} />
                  <button onClick={addNewGrade} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"><Plus size={20} />등급 추가</button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="프리셋 이름" className="flex-1 border-2 border-gray-300 rounded px-3 py-2 outline-none" onKeyPress={(e) => e.key === 'Enter' && saveAsPreset()} />
                  <button onClick={saveAsPreset} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"><Save size={20} />저장</button>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(prizes).map(([grade, count]) => (
                  <div key={grade} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={wishList[grade] || false} onChange={(e) => setWishList(prev => ({...prev, [grade]: e.target.checked}))} className="w-5 h-5 text-pink-600 rounded" />
                      <div className="flex-1">
                        <label className="text-sm font-semibold mb-2 block">{grade}상</label>
                        <input type="number" min="0" value={count === 0 ? '' : count} placeholder="0" onChange={(e) => handleCustomChange(grade, e.target.value)} className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none" />
                      </div>
                      <button onClick={() => confirmRemoveGrade(grade)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-6">삭제</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-sm font-semibold mb-1 block">1회 가격 (원)</label>
                <input type="number" min="0" value={pricePerDraw === 0 ? '' : pricePerDraw} placeholder="0" onChange={(e) => handlePriceChange(e.target.value)} className="border-2 border-gray-300 rounded px-3 py-2 outline-none w-40" />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-4">프리셋 선택</h3>
              <div className="space-y-3">
                {Object.keys(customPresets).map(presetName => (
                  <div key={presetName} className="flex gap-3">
                    <button onClick={() => loadPreset(presetName)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition">{presetName}</button>
                    <button onClick={() => confirmDeletePreset(presetName)} className="bg-red-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-600 transition">삭제</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-purple-800">남은 상품</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(remaining).map(([grade, count]) => {
                const probability = remainingTotal > 0 ? ((count / remainingTotal) * 100).toFixed(2) : 0;
                return (
                  <div key={grade} className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded font-semibold ${getGradeColor(grade)} flex items-center gap-2`}>
                      {grade}상 {wishList[grade] && '💖'} {isTopGrade(grade) && <Sparkles size={16} />}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">{probability}%</span>
                      <span className="font-semibold text-lg">{count}개</span>
                    </div>
                  </div>
                );
              })}
              <div className="border-t-2 pt-2 mt-2 flex justify-between items-center font-bold text-lg">
                <span>총 남은 수량</span><span className="text-purple-600">{remainingTotal}개</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-purple-800">뽑기</h3>
            <div className="space-y-4">
              <button onClick={drawPrize} disabled={remainingTotal === 0} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-bold text-xl hover:from-yellow-500 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 active:scale-95">
                <Gift size={24} /> 뽑기 ({pricePerDraw}원)
              </button>
              <button onClick={reset} className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"><RotateCcw size={20} />초기화</button>
              <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="font-semibold">뽑은 횟수</span><span className="text-purple-600 font-bold">{drawn.length}회</span></div>
                <div className="flex justify-between"><span className="font-semibold">총 비용</span><span className="text-red-600 font-bold">{totalCost.toLocaleString()}원</span></div>
                <div className="flex justify-between"><span className="font-semibold">진행률</span><span className="text-green-600 font-bold">{totalPrizes > 0 ? ((drawn.length / totalPrizes) * 100).toFixed(1) : 0}%</span></div>
              </div>
            </div>
          </div>
        </div>

        {drawn.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-purple-800 flex items-center justify-between">
              <span>뽑기 결과</span>
              <button onClick={() => setDrawn([])} className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-1"><Trash2 size={16} />지우기</button>
            </h3>
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3 text-purple-800">획득 현황</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(getDrawnStats()).sort((a,b)=>Object.keys(prizes).indexOf(a[0])-Object.keys(prizes).indexOf(b[0])).map(([g,c])=>(
                  <div key={g} className={`${getGradeColor(g)} p-3 rounded-lg shadow-sm flex items-center justify-between`}>
                    <span className="font-bold text-lg flex items-center gap-1">{g}상 {isTopGrade(g) && <Sparkles size={14} />}</span>
                    <span className="font-bold text-2xl">{c}개</span>
                  </div>
                ))}
              </div>
            </div>
            <h4 className="font-semibold text-lg mb-3 text-purple-800">히스토리</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
              {drawn.slice().reverse().map((item, i) => (
                <div key={drawn.length - i} className={`p-4 rounded-lg text-center ${getGradeColor(item.grade)} shadow ${item.isWish ? 'ring-4 ring-pink-400 ring-offset-2' : ''}`}>
                  <div className="font-bold text-2xl flex items-center justify-center gap-1">{item.grade} {item.isWish && '💖'}</div>
                  <div className="text-xs mt-1">#{item.number}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;