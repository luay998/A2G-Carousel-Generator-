var BG_PATTERNS = [
  { label: 'None' },
  { label: 'Dots',    svg: function(ac) { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="1.2" fill="' + ac + '" opacity=".18"/></svg>'); } },
  { label: 'Grid',    svg: function(ac) { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M30 0H0v30" fill="none" stroke="' + ac + '" stroke-width=".4" opacity=".2"/></svg>'); } },
  { label: 'Lines',   svg: function(ac) { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><line x1="0" y1="15" x2="30" y2="15" stroke="' + ac + '" stroke-width=".5" opacity=".15"/></svg>'); } },
  { label: 'Crosses', svg: function(ac) { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><line x1="20" y1="14" x2="20" y2="26" stroke="' + ac + '" stroke-width=".8" opacity=".2"/><line x1="14" y1="20" x2="26" y2="20" stroke="' + ac + '" stroke-width=".8" opacity=".2"/></svg>'); } },
  { label: 'Diag',    svg: function(ac) { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="0" y1="20" x2="20" y2="0" stroke="' + ac + '" stroke-width=".5" opacity=".15"/></svg>'); } },
];

function getBgSvg() {
  if (bgDataUrl) return bgDataUrl;
  var p = BG_PATTERNS[activeBgPreset];
  if (!p || !p.svg) return null;
  try { return p.svg(AC); } catch(e) { return null; }
}

function buildBgGrid() {
  var g = document.getElementById('bgGrid'); if (!g) return;
  g.innerHTML = '';
  BG_PATTERNS.forEach(function(p, i) {
    var btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'bg-pat-btn' + (i === activeBgPreset ? ' active' : '');
    btn.textContent = p.label;
    btn.onclick = function() {
      activeBgPreset = i;
      bgDataUrl = null;
      var rmBtn = document.getElementById('btn-rm-bg');
      if (rmBtn) rmBtn.style.display = 'none';
      var pv = document.getElementById('pv-bg');
      if (pv) { pv.src = ''; pv.style.display = 'none'; }
      var bh = document.getElementById('bg-hint');
      if (bh) bh.textContent = '📁 Upload BG';
      buildBgGrid();
      renderActiveSlide();
    };
    g.appendChild(btn);
  });
}

function uploadLogo(ev) {
  var file = ev.target.files[0]; if (!file) return;
  var r = new FileReader();
  r.onload = function(e) {
    logoUrl = e.target.result;
    var pv = document.getElementById('pv-logo');
    if (pv) { pv.src = logoUrl; pv.style.display = 'block'; }
    var lh = document.getElementById('lhint');
    if (lh) lh.textContent = '✅ Logo loaded';
    renderActiveSlide();
    pushHistory();
    showToast('🏷 Logo uploaded');
  };
  r.readAsDataURL(file);
}

function uploadBg(ev) {
  var file = ev.target.files[0]; if (!file) return;
  var r = new FileReader();
  r.onload = function(e) {
    bgDataUrl = e.target.result;
    var pv = document.getElementById('pv-bg');
    if (pv) { pv.src = bgDataUrl; pv.style.display = 'block'; }
    var bh = document.getElementById('bg-hint');
    if (bh) bh.textContent = '✅ BG loaded';
    var rmBtn = document.getElementById('btn-rm-bg');
    if (rmBtn) rmBtn.style.display = 'block';
    activeBgPreset = 0;
    buildBgGrid();
    renderActiveSlide();
    pushHistory();
    showToast('🖼 BG uploaded');
  };
  r.readAsDataURL(file);
}

function removeBg() {
  bgDataUrl = null;
  var pv = document.getElementById('pv-bg');
  if (pv) { pv.src = ''; pv.style.display = 'none'; }
  var bh = document.getElementById('bg-hint');
  if (bh) bh.textContent = '📁 Upload BG';
  var rmBtn = document.getElementById('btn-rm-bg');
  if (rmBtn) rmBtn.style.display = 'none';
  renderActiveSlide();
  pushHistory();
}

function updateColors() {
  var ac  = document.getElementById('c-ac');
  var bg  = document.getElementById('c-bg');
  var acH = document.getElementById('c-acH');
  var bgH = document.getElementById('c-bgH');
  if (ac)  { AC = ac.value;  if (acH) acH.value = AC; }
  if (bg)  { BG = bg.value;  if (bgH) bgH.value = BG; }
  renderActiveSlide();
  pushHistory();
}

function syncCol(which) {
  if (which === 'ac') {
    var v = document.getElementById('c-acH'); if (!v) return;
    AC = v.value;
    try { document.getElementById('c-ac').value = AC; } catch(e) {}
  } else {
    var v2 = document.getElementById('c-bgH'); if (!v2) return;
    BG = v2.value;
    try { document.getElementById('c-bg').value = BG; } catch(e) {}
  }
  renderActiveSlide();
}
