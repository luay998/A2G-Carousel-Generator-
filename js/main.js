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
