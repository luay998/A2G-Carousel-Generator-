(function init() {

  /* 1. Build BG pattern grid */
  buildBgGrid();

  /* 2. Build element palette */
  buildElPalette();

  /* 3. Init brand swatches */
  _initSwatches();

  /* 4. Wire file upload inputs via JS — NEVER use inline onchange */
  var logoInp = document.getElementById('logoFileInput');
  if (logoInp) logoInp.onchange = function(e) { uploadLogo(e); };

  var bgInp = document.getElementById('bgFileInput');
  if (bgInp) bgInp.onchange = function(e) { uploadBg(e); };

  /* 5. Create default slides */
  addSlide('intro');
  addSlide('step');
  addSlide('cta');

  /* 6. Push initial history snapshot */
  pushHistory();

  /* 7. UI defaults */
  var snapBtn = document.getElementById('m-snap');
  if (snapBtn) snapBtn.classList.add('active');
  updateHistoryUI();
  applyZoom();

  /* 8. Keep canvas centered on resize */
  var area = document.getElementById('canvasArea');
  if (area && window.ResizeObserver) {
    new ResizeObserver(function() { applyZoom(); }).observe(area);
  }

  /* 9. Suppress browser right-click on empty canvas */
  if (area) {
    area.addEventListener('contextmenu', function(e) {
      if (!e.target.closest('.drel')) e.preventDefault();
    });
  }

  /* 10. Bottom padding for status bar */
  document.body.style.paddingBottom = '24px';

  console.log(
    '%cA2G Carousel v2.1 ready ✅',
    'color:#7CFF7C;font-weight:bold;font-size:13px;'
  );

})();

/* ══════════════════════════════════
   BRAND SWATCHES
══════════════════════════════════ */
var _swatches = [];

function _initSwatches() {
  try {
    var saved = localStorage.getItem('a2g-sw');
    _swatches = saved
      ? JSON.parse(saved)
      : ['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff'];
  } catch(e) {
    _swatches = ['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff'];
  }
  _renderSwatches();
}

function _renderSwatches() {
  var c = document.getElementById('brandSwatches'); if (!c) return;
  c.innerHTML = '';
  _swatches.forEach(function(color, i) {
    var sw = document.createElement('div');
    sw.title = color + ' · click=apply · right-click=remove';
    sw.style.cssText =
      'width:22px;height:22px;border-radius:4px;' +
      'background:' + color + ';cursor:pointer;' +
      'border:1.5px solid rgba(255,255,255,.1);' +
      'flex-shrink:0;transition:transform .15s;';
    sw.onmouseenter = function() { sw.style.transform = 'scale(1.25)'; };
    sw.onmouseleave = function() { sw.style.transform = 'scale(1)'; };
    sw.onclick = function() {
      var ac  = document.getElementById('c-ac');
      var acH = document.getElementById('c-acH');
      if (ac)  ac.value  = color;
      if (acH) acH.value = color;
      updateColors();
      showToast('🎨 Accent → ' + color);
    };
    sw.oncontextmenu = function(e) {
      e.preventDefault();
      _swatches.splice(i, 1);
      _saveSwatches();
      _renderSwatches();
      showToast('🗑 Removed');
    };
    c.appendChild(sw);
  });
}

function addSwatch() {
  var inp = document.getElementById('newSwatchColor'); if (!inp) return;
  var color = inp.value;
  if (_swatches.indexOf(color) > -1) { showToast('Already in palette'); return; }
  _swatches.push(color);
  _saveSwatches();
  _renderSwatches();
  showToast('🎨 Added ' + color);
}

function _saveSwatches() {
  try { localStorage.setItem('a2g-sw', JSON.stringify(_swatches)); } catch(e) {}
}
/* ══════════════════════════════════════
   MOBILE DRAWER CONTROLS
══════════════════════════════════════ */
function mobileOpenDrawer(tab) {
  var lp      = document.getElementById('leftPanel');
  var overlay = document.getElementById('drawerOverlay');
  var isMobile = window.innerWidth < 768;

  /* Switch to correct tab first */
  setLpTab(tab);

  if (isMobile) {
    var isOpen   = lp.classList.contains('open');
    var isSameTab = (window._currentMobileTab === tab);

    if (isOpen && isSameTab) {
      /* Tap same button again → close */
      closeMobileDrawers();
      return;
    }
    lp.classList.add('open');
    overlay.classList.add('open');
    window._currentMobileTab = tab;
  }

  /* Update bottom toolbar active states */
  ['slides','elements','settings'].forEach(function(t) {
    var btn = document.getElementById('mt-' + t);
    if (btn) btn.classList.toggle('active', t === tab && (window.innerWidth < 768 ? lp.classList.contains('open') : true));
  });
}

function closeMobileDrawers() {
  var lp      = document.getElementById('leftPanel');
  var overlay = document.getElementById('drawerOverlay');
  var pp      = document.getElementById('propPanel');
  lp.classList.remove('open');
  pp.classList.remove('open');
  overlay.classList.remove('open');
  window._currentMobileTab = null;
  ['slides','elements','settings','props'].forEach(function(t) {
    var btn = document.getElementById('mt-' + t);
    if (btn) btn.classList.remove('active');
  });
}

function mobileToggleProps() {
  var pp      = document.getElementById('propPanel');
  var overlay = document.getElementById('drawerOverlay');
  var btn     = document.getElementById('mt-props');
  var isOpen  = pp.classList.contains('open');

  if (isOpen) {
    pp.classList.remove('open');
    overlay.classList.remove('open');
    if (btn) btn.classList.remove('active');
  } else {
    /* Close left drawer first */
    var lp = document.getElementById('leftPanel');
    lp.classList.remove('open');
    window._currentMobileTab = null;

    pp.classList.add('open');
    overlay.classList.add('open');
    if (btn) btn.classList.add('active');
  }
}

function closePropPanel() {
  if (window.innerWidth < 768) {
    mobileToggleProps();
  } else {
    toggleProps();
  }
}

function mobileToggleMode() {
  var newMode = (mode === 'edit') ? 'drag' : 'edit';
  setMode(newMode);
  var icon  = document.getElementById('mt-mode-icon');
  var label = document.getElementById('mt-mode-label');
  var btn   = document.getElementById('mt-mode');
  if (icon)  icon.textContent  = newMode === 'drag' ? '🖱' : '✏️';
  if (label) label.textContent = newMode === 'drag' ? 'Move' : 'Edit';
  if (btn)   btn.classList.toggle('active', newMode === 'drag');
}

/* Auto-fit canvas on orientation change */
window.addEventListener('orientationchange', function() {
  setTimeout(function() { zoomFit(); }, 300);
});
window.addEventListener('resize', function() {
  if (window.innerWidth >= 768) {
    /* Restore desktop layout */
    var lp = document.getElementById('leftPanel');
    var pp = document.getElementById('propPanel');
    var ov = document.getElementById('drawerOverlay');
    lp.classList.remove('open');
    pp.classList.remove('open');
    ov.classList.remove('open');
  }
  zoomFit();
});
