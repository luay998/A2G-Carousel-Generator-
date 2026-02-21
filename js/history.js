var _histStack  = [];
var _histIdx    = -1;
var _histPaused = false;
var MAX_HIST    = 50;

function pushHistory() {
  if (_histPaused) return;
  if (_histIdx < _histStack.length - 1) _histStack.splice(_histIdx + 1);
  _histStack.push(JSON.stringify({ slides:slides, activeSlideIdx:activeSlideIdx, AC:AC, BG:BG }));
  if (_histStack.length > MAX_HIST) _histStack.shift();
  _histIdx = _histStack.length - 1;
  _updateHistBtns();
}

function undo() {
  if (_histIdx <= 0) return;
  _histIdx--;
  _applySnap(_histStack[_histIdx]);
}
function redo() {
  if (_histIdx >= _histStack.length - 1) return;
  _histIdx++;
  _applySnap(_histStack[_histIdx]);
}

function _applySnap(json) {
  _histPaused = true;
  try {
    var s = JSON.parse(json);
    slides = s.slides;
    activeSlideIdx = Math.min(s.activeSlideIdx, s.slides.length - 1);
    AC = s.AC; BG = s.BG;
    var ac=document.getElementById('c-ac');   if(ac)  ac.value=AC;
    var acH=document.getElementById('c-acH'); if(acH) acH.value=AC;
    var bg=document.getElementById('c-bg');   if(bg)  bg.value=BG;
    var bgH=document.getElementById('c-bgH'); if(bgH) bgH.value=BG;
    selEl=null; selElId=null;
    buildSlideList(); buildTabsBar(); renderActiveSlide(); buildElTable(); clearPropPanel();
  } catch(e) { console.error('undo error',e); }
  _histPaused = false;
  _updateHistBtns();
}

function updateHistoryUI() { _updateHistBtns(); }
function _updateHistBtns() {
  var u=document.getElementById('btn-undo');
  var r=document.getElementById('btn-redo');
  var mu=document.getElementById('mb-undo');
  var mr=document.getElementById('mb-redo');
  var uOp = _histIdx<=0 ? '0.3':'1';
  var rOp = _histIdx>=_histStack.length-1 ? '0.3':'1';
  if(u)  u.style.opacity  = uOp;
  if(r)  r.style.opacity  = rOp;
  if(mu) mu.style.opacity = uOp;
  if(mr) mr.style.opacity = rOp;
}
