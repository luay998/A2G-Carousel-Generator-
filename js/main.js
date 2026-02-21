(function init() {
  buildBgGrid();
  buildElPalette();
  _initSwatches();
  _initContextMenu();
  _initCanvasClick();

  /* Wire file inputs */
  var logoInp = document.getElementById('logoFileInput');
  if (logoInp) logoInp.onchange = function(e) { uploadLogo(e); };
  var bgInp = document.getElementById('bgFileInput');
  if (bgInp) bgInp.onchange = function(e) { uploadBg(e); };

  /* Default slides */
  addSlide('intro');
  addSlide('step');
  addSlide('cta');
  pushHistory();

  /* UI state */
  var snapBtn = document.getElementById('m-snap');
  if (snapBtn) snapBtn.classList.add('active');
  updateHistoryUI();
  zoomFit();

  /* Auto-fit on resize */
  window.addEventListener('resize', function() {
    zoomFit();
    if (window.innerWidth >= 768) {
      var lp=document.getElementById('leftPanel');
      var pp=document.getElementById('propPanel');
      var ov=document.getElementById('drawerOverlay');
      if(lp) lp.classList.remove('open');
      if(pp) pp.classList.remove('open');
      if(ov) ov.classList.remove('open');
    }
  });

  window.addEventListener('orientationchange', function() {
    setTimeout(zoomFit, 300);
  });

  /* Suppress context menu on canvas background */
  var area = document.getElementById('canvasArea');
  if (area) {
    area.addEventListener('contextmenu', function(e) {
      if (!e.target.closest('.drel')) e.preventDefault();
    });
  }

  console.log('%cA2G v2.2 ready ✅','color:#7CFF7C;font-weight:bold;font-size:14px;');
})();

/* ── Toast ── */
function showToast(msg) {
  var t = document.getElementById('a2g-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'a2g-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(12px)';
  }, 2200);
}

/* ── Brand swatches ── */
var _swatches = [];
function _initSwatches() {
  try { _swatches = JSON.parse(localStorage.getItem('a2g-sw') || 'null') || ['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff']; }
  catch(e) { _swatches = ['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff']; }
  _renderSwatches();
}
function _renderSwatches() {
  var c = document.getElementById('brandSwatches'); if (!c) return;
  c.innerHTML = '';
  _swatches.forEach(function(color, i) {
    var sw = document.createElement('div');
    sw.title = color + ' · tap=apply · long-press=remove';
    sw.style.cssText = 'width:28px;height:28px;border-radius:6px;background:'+color+';cursor:pointer;border:2px solid rgba(255,255,255,.1);flex-shrink:0;transition:transform .15s;';
    sw.onmouseenter = function(){ sw.style.transform='scale(1.2)'; };
    sw.onmouseleave = function(){ sw.style.transform='scale(1)'; };
    sw.onclick = function() {
      var ac=document.getElementById('c-ac'); if(ac) ac.value=color;
      var acH=document.getElementById('c-acH'); if(acH) acH.value=color;
      updateColors(); showToast('🎨 Accent → '+color);
    };
    sw.oncontextmenu = function(e) {
      e.preventDefault(); _swatches.splice(i,1); _saveSwatches(); _renderSwatches(); showToast('🗑 Removed');
    };
    c.appendChild(sw);
  });
}
function addSwatch() {
  var inp = document.getElementById('newSwatchColor'); if (!inp) return;
  var color = inp.value;
  if (_swatches.indexOf(color) > -1) { showToast('Already in palette'); return; }
  _swatches.push(color); _saveSwatches(); _renderSwatches(); showToast('🎨 Added '+color);
}
function _saveSwatches() {
  try { localStorage.setItem('a2g-sw', JSON.stringify(_swatches)); } catch(e) {}
}

/* ── Mobile drawer helpers ── */
function mobileOpenDrawer(tab) {
  var lp = document.getElementById('leftPanel');
  var ov = document.getElementById('drawerOverlay');
  var isMobile = window.innerWidth < 768;
  setLpTab(tab);
  if (isMobile) {
    var isOpen    = lp.classList.contains('open');
    var isSameTab = window._currentMobileTab === tab;
    if (isOpen && isSameTab) { closeMobileDrawers(); return; }
    lp.classList.add('open');
    ov.classList.add('open');
    window._currentMobileTab = tab;
  }
  ['slides','elements','settings'].forEach(function(t) {
    var btn = document.getElementById('mt-'+t);
    if (btn) btn.classList.toggle('active', t===tab && lp.classList.contains('open'));
  });
}
function closeMobileDrawers() {
  var lp=document.getElementById('leftPanel');
  var pp=document.getElementById('propPanel');
  var ov=document.getElementById('drawerOverlay');
  if(lp) lp.classList.remove('open');
  if(pp) pp.classList.remove('open');
  if(ov) ov.classList.remove('open');
  window._currentMobileTab = null;
  ['slides','elements','settings','props'].forEach(function(t) {
    var btn=document.getElementById('mt-'+t); if(btn) btn.classList.remove('active');
  });
}
function mobileToggleProps() {
  var pp=document.getElementById('propPanel');
  var ov=document.getElementById('drawerOverlay');
  var btn=document.getElementById('mt-props');
  if (!pp) return;
  var isOpen = pp.classList.contains('open');
  if (isOpen) {
    pp.classList.remove('open');
    if(!document.getElementById('leftPanel').classList.contains('open')) {
      if(ov) ov.classList.remove('open');
    }
    if(btn) btn.classList.remove('active');
  } else {
    var lp=document.getElementById('leftPanel');
    if(lp) { lp.classList.remove('open'); window._currentMobileTab=null; }
    pp.classList.add('open');
    if(ov) ov.classList.add('open');
    if(btn) btn.classList.add('active');
  }
}
function closePropPanel() {
  if (window.innerWidth < 768) mobileToggleProps();
  else toggleProps();
}
function mobileToggleMode() {
  var newMode = mode==='edit'?'drag':'edit';
  setMode(newMode);
  var icon=document.getElementById('mt-mode-icon');
  var label=document.getElementById('mt-mode-label');
  var btn=document.getElementById('mt-mode');
  if(icon)  icon.textContent  = newMode==='drag'?'🖱':'✏️';
  if(label) label.textContent = newMode==='drag'?'Move':'Edit';
  if(btn)   btn.classList.toggle('active', newMode==='drag');
}
