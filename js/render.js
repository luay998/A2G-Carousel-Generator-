/* ══════════════════════════════════
   RENDER.JS — Full Slide Renderer
   All 20 functions, zero truncation.
══════════════════════════════════ */

/* ── Main render entry point ── */
function renderActiveSlide() {
  var container = document.getElementById('currentCanvas');
  if (!container) return;
  container.innerHTML = '';

  var slide = getActive();
  if (!slide) {
    container.innerHTML =
      '<div style="color:#333;padding:60px 20px;font-size:12px;' +
      'text-align:center;line-height:2;font-family:Poppins,sans-serif;">' +
      'No slides yet.<br>Click ＋ Intro / ＋ Step / ＋ CTA / ＋ Blank</div>';
    return;
  }

  var canvas = document.createElement('div');
  canvas.className = 'slide-canvas';
  canvas.style.cssText =
    'position:relative;' +
    'width:'  + CANVAS_SIZE + 'px;' +
    'height:' + CANVAS_SIZE + 'px;' +
    'overflow:hidden;' +
    'flex-shrink:0;' +
    'background-color:' + BG + ';';

  /* BG image / pattern — fully guarded */
  try {
    var bgUrl = bgDataUrl || (typeof getBgSvg === 'function' ? getBgSvg() : null);
    if (bgUrl) {
      var bgDiv = document.createElement('div');
      bgDiv.style.cssText =
        'position:absolute;inset:0;' +
        'background-image:url("' + bgUrl + '");' +
        'background-size:' + (bgDataUrl ? 'cover' : 'auto') + ';' +
        'z-index:0;pointer-events:none;';
      canvas.appendChild(bgDiv);
    }
  } catch(e) {
    console.warn('BG render error', e);
  }

  /* Elements — each in its own try/catch */
  Object.values(slide.elements).forEach(function(el) {
    if (el.hidden) return;
    try {
      var dom = _buildElDom(el, slide);
      if (dom) canvas.appendChild(dom);
    } catch(err) {
      console.warn('Element render error:', el.type, el.id, err.message);
    }
  });

  /* Grid overlay */
  _addGrid(canvas);

  container.appendChild(canvas);
  _applyModeClasses();

  /* Restore selection highlight after re-render */
  if (selElId) {
    var resel = document.querySelector('[data-eid="' + selElId + '"]');
    if (resel) { selEl = resel; resel.classList.add('selected'); }
    else        { selEl = null; selElId = null; }
  }
}

/* ── Grid SVG overlay ── */
function _addGrid(canvas) {
  var sz = CANVAS_SIZE, step = 30;
  var lines = '';
  for (var x = step; x < sz; x += step) {
    var cx = (x === sz / 2);
    lines +=
      '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + sz + '"' +
      ' stroke="' + (cx ? 'rgba(124,255,124,.6)' : 'rgba(124,255,124,.18)') + '"' +
      ' stroke-width="1"' + (cx ? ' stroke-dasharray="4 4"' : '') + '/>';
  }
  for (var y = step; y < sz; y += step) {
    var cy = (y === sz / 2);
    lines +=
      '<line x1="0" y1="' + y + '" x2="' + sz + '" y2="' + y + '"' +
      ' stroke="' + (cy ? 'rgba(124,255,124,.6)' : 'rgba(124,255,124,.18)') + '"' +
      ' stroke-width="1"' + (cy ? ' stroke-dasharray="4 4"' : '') + '/>';
  }
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width',  sz);
  svg.setAttribute('height', sz);
  svg.setAttribute('class',  'slide-grid-overlay');
  svg.style.cssText =
    'position:absolute;inset:0;pointer-events:none;z-index:1;' +
    'display:' + (showGrid ? 'block' : 'none') + ';';
  svg.innerHTML = lines;
  canvas.appendChild(svg);
}

/* ── Toggle grid visibility ── */
function toggleGrid() {
  showGrid = !showGrid;
  var btn = document.getElementById('m-grid');
  if (btn) btn.classList.toggle('active', showGrid);
  document.querySelectorAll('.slide-grid-overlay').forEach(function(o) {
    o.style.display = showGrid ? 'block' : 'none';
  });
}

/* ── Apply drag/edit mode classes to all elements ── */
function _applyModeClasses() {
  document.querySelectorAll('.drel').forEach(function(d) {
    d.classList.toggle('drag-mode', mode === 'drag');
  });
}

/* ── Safe fill getter ── */
function _getFill(el) {
  if (el.fillType === 'gradient' && el.color2) {
    return 'linear-gradient(' +
      (el.gradDir || 'to right') + ',' +
      (el.color || AC) + ',' +
      el.color2 + ')';
  }
  return el.color || AC;
}

/* ══════════════════════════════════
   WRAP HELPER
   Creates the draggable .drel shell,
   adds toolbar + resize handles.
══════════════════════════════════ */
function _wrapEl(el, inner, fixedH) {
  var w = document.createElement('div');
  w.className    = 'drel';
  w.dataset.eid  = el.id;
  w.style.position = 'absolute';
  w.style.left     = (el.x || 0)   + 'px';
  w.style.top      = (el.y || 0)   + 'px';
  w.style.width    = (el.w || 100) + 'px';
  w.style.zIndex   = '10';

  if (fixedH != null)        w.style.height  = fixedH + 'px';
  if (el.globalOpacity != null) w.style.opacity = el.globalOpacity;
  if (el.locked)             w.dataset.locked = '1';

  if (inner) w.appendChild(inner);

  _addElToolbar(w, el.id, el.label || el.type, !!el.locked);
  _addResizeHandles(w, el.id);
  _attachMoveEvents(w, el.id);   /* defined in drag.js */

  return w;
}

/* ══════════════════════════════════
   ELEMENT TOOLBAR  ⚙ ⧉ 🔓 ✕
══════════════════════════════════ */
function _addElToolbar(w, eid, label, locked) {
  var tb = document.createElement('div');
  tb.className = 'el-toolbar';

  var lbl = document.createElement('span');
  lbl.className   = 'etb-lbl';
  lbl.textContent = label || '';
  tb.appendChild(lbl);

  function mkBtn(title, html, extraClass, fn) {
    var b = document.createElement('button');
    b.className = 'etb-btn' + (extraClass ? ' ' + extraClass : '');
    b.title     = title;
    b.innerHTML = html;
    b.onclick   = function(e) { e.stopPropagation(); fn(); };
    tb.appendChild(b);
  }

  /* Properties */
  mkBtn('Properties', '⚙', '', function() {
    selectDomEl(w, eid);
    if (typeof buildPropPanel === 'function') buildPropPanel(eid);
  });

  /* Duplicate */
  mkBtn('Duplicate', '⧉', '', function() {
    if (typeof duplicateEl === 'function') duplicateEl(eid);
  });

  /* Lock / Unlock */
  mkBtn(locked ? 'Unlock' : 'Lock', locked ? '🔒' : '🔓', '', function() {
    var slide = getActive(); if (!slide) return;
    var el    = slide.elements[eid]; if (!el) return;
    el.locked = !el.locked;
    pushHistory();
    renderActiveSlide();
    buildElTable();
  });

  /* Remove */
  mkBtn('Remove', '✕', 'del', function() {
    if (!confirm('Remove "' + label + '"?')) return;
    var slide = getActive(); if (!slide) return;
    pushHistory();
    delete slide.elements[eid];
    selEl = null; selElId = null;
    renderActiveSlide();
    buildElTable();
    clearPropPanel();
  });

  w.appendChild(tb);
}

/* ══════════════════════════════════
   RESIZE HANDLES
   8-point: tl tm tr ml mr bl bm br
══════════════════════════════════ */
function _addResizeHandles(w, eid) {
  ['tl','tm','tr','ml','mr','bl','bm','br'].forEach(function(pos) {
    var h = document.createElement('div');
    h.className = 'rh ' + pos;
    h.addEventListener('mousedown', function(e) {
      _startResize(e, w, eid, pos); /* defined in drag.js */
    });
    w.appendChild(h);
  });
}

/* ══════════════════════════════════
   ELEMENT DISPATCHER
══════════════════════════════════ */
function _buildElDom(el, slide) {
  switch (el.type) {
    case 'frame':   return _buildFrame(el);
    case 'logo':    return _buildLogo(el);
    case 'text':    return _buildText(el);
    case 'stepnum': return _buildStepNum(el, slide);
    case 'image':   return _buildImage(el, slide);
    case 'rect':    return _buildRect(el);
    case 'circle':  return _buildCircle(el);
    case 'line':
    case 'divider': return _buildLine(el);
    case 'button':  return _buildButton(el);
    case 'dots':    return _buildDots(el, slide);
    case 'arrow':   return _buildArrow(el);
    default:        return null;
  }
}

/* ══════════════════════════════════
   INDIVIDUAL BUILDERS
══════════════════════════════════ */

function _buildFrame(el) {
  var w = document.createElement('div');
  w.className      = 'drel';
  w.dataset.eid    = el.id;
  if (el.locked) w.dataset.locked = '1';
  w.style.cssText  =
    'position:absolute;left:0;top:0;' +
    'width:'  + CANVAS_SIZE + 'px;' +
    'height:' + CANVAS_SIZE + 'px;' +
    'z-index:2;pointer-events:none;';

  var inner = document.createElement('div');
  inner.style.cssText =
    'position:absolute;inset:12px;' +
    'border:1px solid ' + AC + '18;' +
    'border-radius:2px;pointer-events:none;';

  /* Corner decorations */
  inner.innerHTML =
    '<div style="position:absolute;top:-1px;left:-1px;width:14px;height:14px;' +
    'border-top:2px solid ' + AC + ';border-left:2px solid ' + AC + '"></div>' +
    '<div style="position:absolute;bottom:-1px;right:-1px;width:14px;height:14px;' +
    'border-bottom:2px solid ' + AC + ';border-right:2px solid ' + AC + '"></div>';

  w.appendChild(inner);

  /* Toolbar needs pointer-events even though frame is non-interactive */
  _addElToolbar(w, el.id, el.label || 'Frame', !!el.locked);
  var tb = w.querySelector('.el-toolbar');
  if (tb) tb.style.pointerEvents = 'all';

  return w;
}

function _buildLogo(el) {
  el.w = el.w || 110;
  el.h = el.h || 60;

  if (logoUrl) {
    var img = document.createElement('img');
    img.src = logoUrl;
    img.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;' +
      'object-fit:contain;pointer-events:none;';
    var w = _wrapEl(el, img, el.h);
    w.style.filter = 'drop-shadow(0 0 8px ' + AC + '88)';
    return w;
  }

  /* Placeholder */
  var ph = document.createElement('div');
  ph.style.cssText =
    'color:' + AC + ';font-size:10px;letter-spacing:2px;' +
    'border:1px dashed ' + AC + '33;padding:4px 8px;' +
    'border-radius:4px;opacity:.4;white-space:nowrap;';
  ph.textContent = 'LOGO';
  return _wrapEl(el, ph, el.h);
}

function _buildText(el) {
  var d = document.createElement('div');
  d.setAttribute('data-tn', '1');

  var shadows = [];
  if (el.shadowX || el.shadowY || el.shadowBlur) {
    shadows.push(
      (el.shadowX || 0) + 'px ' +
      (el.shadowY || 0) + 'px ' +
      (el.shadowBlur || 0) + 'px ' +
      (el.shadowColor || '#000')
    );
  }
  if (el.strokeWidth) {
    shadows.push('0 0 0 ' + el.strokeWidth + 'px ' + (el.strokeColor || '#000'));
  }

  d.style.cssText =
    'font-size:'        + (el.fs || 16)               + 'px;' +
    'font-family:\''    + (el.font || 'Poppins')       + '\',sans-serif;' +
    'color:'            + (el.color || '#fff')          + ';' +
    'font-weight:'      + (el.bold   ? '800' : '400')  + ';' +
    'font-style:'       + (el.italic ? 'italic':'normal') + ';' +
    'text-decoration:'  + (el.underline ? 'underline':'none') + ';' +
    'line-height:'      + (el.lineHeight || 1.15)       + ';' +
    'letter-spacing:'   + (el.letterSpacing || 0)       + 'px;' +
    'text-align:'       + (el.align || 'left')          + ';' +
    'white-space:pre-wrap;word-break:break-word;' +
    (shadows.length ? 'text-shadow:' + shadows.join(', ') + ';' : '');

  var lines = (el.text || '').split('\n');
  lines.forEach(function(line, i) {
    var s = document.createElement('span');
    s.textContent = line;
    if (el.colorLine2 && i === 1) s.style.color = AC;
    d.appendChild(s);
    if (i < lines.length - 1) d.appendChild(document.createElement('br'));
  });

  return _wrapEl(el, d, null);
}

function _buildStepNum(el, slide) {
  var d = document.createElement('div');
  d.setAttribute('data-tn', '1');

  var stepSlides = slides.filter(function(s) { return s.type === 'step'; });
  var idx = stepSlides.indexOf(slide);
  var num = idx >= 0 ? idx + 1 : 1;

  d.style.cssText =
    'font-size:' + (el.fs || 108) + 'px;font-weight:900;' +
    'color:' + AC + ';' +
    'text-shadow:0 0 40px ' + AC + '55;' +
    'line-height:1;user-select:none;';
  d.textContent = num;

  return _wrapEl(el, d, null);
}

function _buildImage(el, slide) {
  var url = slide.imgUrls && slide.imgUrls[el.id];
  var w   = _wrapEl(el, null, el.h || 180);
  w.style.borderRadius = (el.radius || 0) + 'px';
  w.style.overflow     = 'hidden';

  if (url) {
    var img = document.createElement('img');
    img.src = url;
    img.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;' +
      'object-fit:' + (el.objectFit || 'cover') + ';pointer-events:none;';
    w.insertBefore(img, w.firstChild);
  } else {
    /* Upload placeholder */
    var ph = document.createElement('div');
    ph.style.cssText =
      'position:absolute;inset:0;' +
      'border:1.5px dashed ' + AC + '44;' +
      'border-radius:' + (el.radius || 0) + 'px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'color:' + AC + ';background:rgba(0,0,0,.15);';
    ph.innerHTML =
      '<div style="font-size:22px;pointer-events:none">🖼️</div>' +
      '<div style="font-size:9px;opacity:.5;pointer-events:none">Click to upload</div>';

    var fi = document.createElement('input');
    fi.type   = 'file';
    fi.accept = 'image/*';
    fi.style.cssText =
      'position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;';
    fi.onchange = function(ev) {
      var file = ev.target.files[0]; if (!file) return;
      var r = new FileReader();
      r.onload = function(e2) {
        if (!slide.imgUrls) slide.imgUrls = {};
        slide.imgUrls[el.id] = e2.target.result;
        pushHistory();
        renderActiveSlide();
        buildElTable();
      };
      r.readAsDataURL(file);
    };
    ph.appendChild(fi);
    w.insertBefore(ph, w.firstChild);
  }

  return w;
}

function _buildRect(el) {
  var d = document.createElement('div');
  d.style.cssText =
    'width:100%;' +
    'height:'        + (el.h || 60)                        + 'px;' +
    'background:'    + _getFill(el)                        + ';' +
    'opacity:'       + (el.opacity != null ? el.opacity : 0.2) + ';' +
    'border-radius:' + (el.radius || 0)                    + 'px;' +
    (el.strokeWidth
      ? 'border:' + el.strokeWidth + 'px solid ' + (el.strokeColor || '#fff') + ';'
      : '');
  return _wrapEl(el, d, el.h || 60);
}

function _buildCircle(el) {
  var sz = el.w || 80;
  var d  = document.createElement('div');
  d.style.cssText =
    'width:'         + sz + 'px;' +
    'height:'        + sz + 'px;' +
    'background:'    + _getFill(el)                        + ';' +
    'opacity:'       + (el.opacity != null ? el.opacity : 0.2) + ';' +
    'border-radius:50%;' +
    (el.strokeWidth
      ? 'border:' + el.strokeWidth + 'px solid ' + (el.strokeColor || '#fff') + ';'
      : '');
  return _wrapEl(el, d, sz);
}

function _buildLine(el) {
  var h = el.h || 2;
  var d = document.createElement('div');
  d.style.cssText =
    'width:100%;' +
    'height:'     + h + 'px;' +
    'background:linear-gradient(90deg,' +
      (el.color || AC) + 'aa,' +
      (el.color || AC) + '11);' +
    'opacity:' + (el.opacity != null ? el.opacity : 1) + ';';
  return _wrapEl(el, d, h);
}

function _buildButton(el) {
  var d = document.createElement('div');
  d.setAttribute('data-tn', '1');
  d.style.cssText =
    'font-size:'       + (el.fs || 13)              + 'px;' +
    'font-weight:700;' +
    'letter-spacing:'  + (el.letterSpacing || 1.5)  + 'px;' +
    'text-transform:uppercase;' +
    'padding:11px 24px;' +
    'border-radius:999px;' +
    'border:2px solid ' + AC + ';' +
    'color:'           + AC                          + ';' +
    'white-space:nowrap;display:inline-block;';
  d.textContent = el.text || 'BUTTON';
  return _wrapEl(el, d, el.h || 50);
}

function _buildDots(el, slide) {
  var total  = Math.min(slides.length, 8);
  var active = slides.indexOf(slide);
  var d = document.createElement('div');
  d.style.cssText = 'display:flex;gap:5px;align-items:center;padding:2px 0;';

  for (var i = 0; i < total; i++) {
    var dot = document.createElement('div');
    dot.style.cssText =
      'width:6px;height:6px;border-radius:50%;' +
      'background:' + (i === active ? AC : AC + '33') + ';' +
      (i === active ? 'box-shadow:0 0 5px ' + AC + '88;' : '');
    d.appendChild(dot);
  }
  return _wrapEl(el, d, 16);
}

function _buildArrow(el) {
  var sz = el.w || 36;
  var d  = document.createElement('div');
  d.style.cssText =
    'width:'          + sz + 'px;' +
    'height:'         + sz + 'px;' +
    'border:2px solid ' + AC + '88;' +
    'border-radius:50%;' +
    'display:flex;align-items:center;justify-content:center;';

  var a = document.createElement('div');
  a.style.cssText =
    'width:9px;height:9px;' +
    'border-right:2px solid '  + AC + ';' +
    'border-bottom:2px solid ' + AC + ';' +
    'transform:rotate(-45deg) translate(-2px,2px);';

  d.appendChild(a);
  return _wrapEl(el, d, sz);
}
