(function init(){
  buildBgGrid();
  buildElPalette();
  _initSwatches();
  _initContextMenu();
  _initCanvasClick();

  document.getElementById('logoFileInput').onchange = uploadLogo;
  document.getElementById('bgFileInput').onchange   = uploadBg;

  addSlide('intro');
  addSlide('step');
  addSlide('cta');
  activeSlideIdx = 0;
  pushHistory();
  updateHistoryUI();
  document.getElementById('m-snap').classList.add('active');

  setTimeout(zoomFit, 120);
  window.addEventListener('resize', function(){
    zoomFit();
    if(window.innerWidth >= 768) _resetMobileState();
  });
  window.addEventListener('orientationchange', function(){ setTimeout(zoomFit,400); });

  /* ── CRITICAL: stop panel touches reaching overlay ── */
  ['leftPanel','propPanel'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('touchstart', function(e){ e.stopPropagation(); }, {passive:true});
    el.addEventListener('click',      function(e){ e.stopPropagation(); });
  });

  console.log('%cA2G v2.6 ✅','color:#7CFF7C;font-weight:bold;font-size:14px;');
})();

/* ─── Reset on desktop ─── */
function _resetMobileState(){
  _lp().classList.remove('open');
  _pp().classList.remove('open');
  _ov().classList.remove('open');
  window._mTab = null;
  _clearMtBtns();
}

/* ─── Helpers ─── */
function _lp(){ return document.getElementById('leftPanel'); }
function _pp(){ return document.getElementById('propPanel'); }
function _ov(){ return document.getElementById('drawerOverlay'); }

/* ─── Toast ─── */
function showToast(msg){
  var t = document.getElementById('a2g-toast');
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._tmr);
  t._tmr = setTimeout(function(){
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(12px)';
  }, 2200);
}

/* ─── Brand swatches ─── */
var _swatches = [];
function _initSwatches(){
  try{ _swatches = JSON.parse(localStorage.getItem('a2g-sw')) || _defaultSw(); }
  catch(e){ _swatches = _defaultSw(); }
  _renderSwatches();
}
function _defaultSw(){ return ['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff']; }
function _renderSwatches(){
  var c = document.getElementById('brandSwatches'); if(!c) return;
  c.innerHTML = '';
  _swatches.forEach(function(color, i){
    var sw = document.createElement('div');
    sw.style.cssText = 'width:32px;height:32px;border-radius:7px;background:'+color+';cursor:pointer;border:2px solid rgba(255,255,255,.12);flex-shrink:0;';
    sw.title = color;
    sw.addEventListener('click', function(e){
      e.stopPropagation();
      document.getElementById('c-ac').value  = color;
      document.getElementById('c-acH').value = color;
      updateColors(); showToast('🎨 '+color);
    });
    sw.addEventListener('contextmenu', function(e){
      e.preventDefault(); e.stopPropagation();
      _swatches.splice(i,1); _saveSwatches(); _renderSwatches(); showToast('🗑 Removed');
    });
    c.appendChild(sw);
  });
}
function addSwatch(){
  var inp = document.getElementById('newSwatchColor'); if(!inp) return;
  var c = inp.value;
  if(_swatches.indexOf(c) > -1){ showToast('Already in palette'); return; }
  _swatches.push(c); _saveSwatches(); _renderSwatches(); showToast('🎨 Added '+c);
}
function _saveSwatches(){ try{ localStorage.setItem('a2g-sw',JSON.stringify(_swatches)); }catch(e){} }

/* ══════════════════════════════════════════════
   MOBILE DRAWER SYSTEM
   
   Z-INDEX HIERARCHY:
   mobileBar / mobileToolbar : 1000  (always on top)
   leftPanel / propPanel     : 800   (panels)
   drawerOverlay             : 700   (behind panels)
   canvasArea                : 1     (bottom)
   
   Because panels(800) > overlay(700), taps inside
   a panel are handled by the panel, NOT the overlay.
   
   Additionally, in init() we call stopPropagation()
   on panel touchstart/click as double insurance.
══════════════════════════════════════════════ */

function mobileOpenDrawer(tab){
  if(window.innerWidth >= 768){ setLpTab(tab); return; }

  setLpTab(tab);

  var lp = _lp(), pp = _pp(), ov = _ov();
  var isOpen = lp.classList.contains('open');
  var isSame = (window._mTab === tab);

  /* Toggle: same tab → close */
  if(isOpen && isSame){
    lp.classList.remove('open');
    if(!pp.classList.contains('open')) ov.classList.remove('open');
    window._mTab = null;
    _clearMtBtns();
    return;
  }

  /* Close props if open */
  if(pp.classList.contains('open')){
    pp.classList.remove('open');
    var pb = document.getElementById('mt-props');
    if(pb) pb.classList.remove('active');
  }

  lp.classList.add('open');
  ov.classList.add('open');
  window._mTab = tab;
  _clearMtBtns();
  var tb = document.getElementById('mt-'+tab);
  if(tb) tb.classList.add('active');
}

function mobileToggleProps(){
  var pp = _pp(), lp = _lp(), ov = _ov();
  var btn = document.getElementById('mt-props');

  /* Already open → close */
  if(pp.classList.contains('open')){
    pp.classList.remove('open');
    if(!lp.classList.contains('open')) ov.classList.remove('open');
    if(btn) btn.classList.remove('active');
    return;
  }

  /* Need a selected element */
  if(!selElId){
    showToast('⚠️ Tap an element on the canvas first');
    return;
  }

  /* Close left panel if open */
  if(lp.classList.contains('open')){
    lp.classList.remove('open');
    window._mTab = null;
    _clearMtBtns();
  }

  /* Build and show */
  buildPropPanel(selElId);
  pp.classList.add('open');
  ov.classList.add('open');
  if(btn) btn.classList.add('active');
}

/* Called by overlay tap — closes everything */
function closeMobileDrawers(){
  _lp().classList.remove('open');
  _pp().classList.remove('open');
  _ov().classList.remove('open');
  window._mTab = null;
  _clearMtBtns();
}

function closePropPanel(){
  if(window.innerWidth < 768){
    var pp = _pp(), lp = _lp(), ov = _ov();
    var btn = document.getElementById('mt-props');
    pp.classList.remove('open');
    if(!lp.classList.contains('open')) ov.classList.remove('open');
    if(btn) btn.classList.remove('active');
  } else {
    toggleProps();
  }
}

function _clearMtBtns(){
  ['slides','elements','settings','props'].forEach(function(t){
    var b = document.getElementById('mt-'+t);
    if(b) b.classList.remove('active');
  });
}

/* ─── Desktop toggles ─── */
function togglePanels(){
  var lp = _lp(), btn = document.getElementById('btn-panels');
  var h = (lp.style.display === 'none');
  lp.style.display = h ? 'flex' : 'none';
  if(btn) btn.classList.toggle('active', h);
  zoomFit();
}
function toggleProps(){
  var pp = _pp(), btn = document.getElementById('btn-props');
  var h = (pp.style.display === 'none');
  pp.style.display = h ? 'flex' : 'none';
  if(btn) btn.classList.toggle('active', h);
  zoomFit();
}
function mobileToggleMode(){
  setMode(mode === 'edit' ? 'drag' : 'edit');
}
