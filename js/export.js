var EXPORT_PRESETS = [
  { id:'ig-post',  label:'Instagram Post',  icon:'📸', w:1080, h:1080, desc:'1080×1080 · Square' },
  { id:'ig-story', label:'Instagram Story', icon:'📱', w:1080, h:1920, desc:'1080×1920 · 9:16' },
  { id:'ig-land',  label:'IG Landscape',    icon:'🖼️', w:1080, h:566,  desc:'1080×566 · 1.91:1' },
  { id:'hd',       label:'Full HD',         icon:'🎬', w:1920, h:1080, desc:'1920×1080 · 16:9' },
  { id:'twitter',  label:'Twitter / X',     icon:'🐦', w:1200, h:675,  desc:'1200×675' },
  { id:'linkedin', label:'LinkedIn',        icon:'💼', w:1200, h:627,  desc:'1200×627' },
  { id:'custom',   label:'Custom Size',     icon:'⚙️', w:1080, h:1080, desc:'Your dimensions' },
];

var _expCfg = { presetId:'ig-post', w:1080, h:1080, format:'png', quality:100, scope:'current', filename:'slide' };
var _expModal = null;

function exportCurrent() { _expCfg.scope = 'current'; _openExportModal(); }
function exportAll()     { _expCfg.scope = 'all';     _openExportModal(); }

function _openExportModal() {
  if (_expModal) { _expModal.remove(); _expModal = null; }
  var ov = document.createElement('div');
  ov.id = 'exportModal';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9000;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;padding:20px;';
  ov.onclick = function(e) { if (e.target === ov) { ov.remove(); _expModal = null; } };
  document.body.appendChild(ov);
  _expModal = ov;
  _rebuildModal();
}

function _rebuildModal() {
  if (!_expModal) return;
  var c = _expCfg;
  _expModal.innerHTML =
    '<div style="background:#0e0e0e;border:1px solid #1e1e1e;border-radius:12px;width:100%;max-width:560px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.8);">' +
      '<div style="padding:16px 20px;border-bottom:1px solid #1a1a1a;display:flex;align-items:center;justify-content:space-between;">' +
        '<div><div style="color:#7CFF7C;font-weight:700;font-size:14px;letter-spacing:1px;">⬇ EXPORT</div>' +
        '<div style="color:#444;font-size:10px;margin-top:2px;">Choose format, size and quality</div></div>' +
        '<button id="expCloseBtn" style="background:none;border:1px solid #222;border-radius:6px;color:#555;cursor:pointer;width:28px;height:28px;font-size:14px;">✕</button>' +
      '</div>' +
      '<div style="overflow-y:auto;flex:1;padding:16px 20px;">' +

        '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:8px;">SCOPE</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:16px;">' +
          '<button id="scope-current" style="' + _scopeStyle('current') + '">🎞 Current Slide</button>' +
          '<button id="scope-all"     style="' + _scopeStyle('all')     + '">📦 All Slides (' + slides.length + ')</button>' +
        '</div>' +

        '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:8px;">SIZE PRESET</div>' +
        '<div id="expPresetGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px;"></div>' +

        '<div id="expCustomRow" style="display:' + (c.presetId === 'custom' ? 'block' : 'none') + ';margin-bottom:16px;">' +
          '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:8px;">CUSTOM DIMENSIONS</div>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<div style="flex:1"><label style="font-size:10px;color:#555;display:block;margin-bottom:3px;">Width (px)</label>' +
            '<input type="number" id="exp-cw" value="' + c.w + '" min="100" max="8000" style="width:100%;padding:7px 9px;background:#141414;border:1px solid #1e1e1e;border-radius:5px;color:#fff;font-size:12px;font-family:Poppins,sans-serif;outline:none;box-sizing:border-box;"></div>' +
            '<div style="color:#333;margin-top:16px;">×</div>' +
            '<div style="flex:1"><label style="font-size:10px;color:#555;display:block;margin-bottom:3px;">Height (px)</label>' +
            '<input type="number" id="exp-ch" value="' + c.h + '" min="100" max="8000" style="width:100%;padding:7px 9px;background:#141414;border:1px solid #1e1e1e;border-radius:5px;color:#fff;font-size:12px;font-family:Poppins,sans-serif;outline:none;box-sizing:border-box;"></div>' +
          '</div>' +
        '</div>' +

        '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:8px;">FORMAT</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:16px;">' +
          '<button id="fmt-png"  style="' + _fmtStyle('png')  + '"><div style="font-size:15px;margin-bottom:2px;">🔷</div><div style="font-weight:600;">PNG</div><div style="font-size:8px;color:#555;">Lossless</div></button>' +
          '<button id="fmt-jpg"  style="' + _fmtStyle('jpg')  + '"><div style="font-size:15px;margin-bottom:2px;">🔶</div><div style="font-weight:600;">JPG</div><div style="font-size:8px;color:#555;">Smaller</div></button>' +
          '<button id="fmt-webp" style="' + _fmtStyle('webp') + '"><div style="font-size:15px;margin-bottom:2px;">🟣</div><div style="font-weight:600;">WebP</div><div style="font-size:8px;color:#555;">Best ratio</div></button>' +
        '</div>' +

        '<div id="expQualityRow" style="display:' + (c.format === 'png' ? 'none' : 'block') + ';margin-bottom:16px;">' +
          '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:6px;">QUALITY — <span id="expQV">' + c.quality + '</span>%</div>' +
          '<input type="range" id="expQSlider" min="10" max="100" value="' + c.quality + '" style="width:100%;accent-color:#7CFF7C;">' +
        '</div>' +

        '<div style="font-size:9px;color:#7CFF7C;letter-spacing:2px;margin-bottom:6px;">FILENAME PREFIX</div>' +
        '<input type="text" id="expFilename" value="' + c.filename + '" style="width:100%;padding:7px 9px;background:#141414;border:1px solid #1e1e1e;border-radius:5px;color:#fff;font-size:12px;font-family:Poppins,sans-serif;outline:none;box-sizing:border-box;margin-bottom:14px;">' +

        '<div id="expPreview" style="background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:12px 14px;"></div>' +
      '</div>' +

      '<div style="padding:14px 20px;border-top:1px solid #1a1a1a;display:flex;gap:8px;background:#0b0b0b;">' +
        '<button id="expCancelBtn" style="flex:1;padding:10px;background:#141414;border:1px solid #222;border-radius:7px;color:#666;font-size:11px;font-family:Poppins,sans-serif;cursor:pointer;">Cancel</button>' +
        '<button id="expRunBtn"    style="flex:2;padding:10px;background:#7CFF7C;border:none;border-radius:7px;color:#000;font-size:12px;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;">⬇ Export</button>' +
      '</div>' +
    '</div>';

  // Wire up events after innerHTML is set
  document.getElementById('expCloseBtn').onclick  = function() { _expModal.remove(); _expModal = null; };
  document.getElementById('expCancelBtn').onclick = function() { _expModal.remove(); _expModal = null; };
  document.getElementById('expRunBtn').onclick    = function() { _runExport(); };
  document.getElementById('scope-current').onclick = function() { _setExpScope('current'); };
  document.getElementById('scope-all').onclick     = function() { _setExpScope('all'); };
  document.getElementById('fmt-png').onclick  = function() { _setExpFmt('png'); };
  document.getElementById('fmt-jpg').onclick  = function() { _setExpFmt('jpg'); };
  document.getElementById('fmt-webp').onclick = function() { _setExpFmt('webp'); };
  document.getElementById('expQSlider').oninput = function() {
    _expCfg.quality = parseInt(this.value) || 100;
    var qv = document.getElementById('expQV');
    if (qv) qv.textContent = this.value;
  };
  document.getElementById('expFilename').oninput = function() {
    _expCfg.filename = this.value || 'slide';
    _updateExpPreview();
  };
  var cwi = document.getElementById('exp-cw');
  var chi = document.getElementById('exp-ch');
  if (cwi) cwi.oninput = function() { _expCfg.w = parseInt(this.value) || 1080; _updateExpPreview(); };
  if (chi) chi.oninput = function() { _expCfg.h = parseInt(this.value) || 1080; _updateExpPreview(); };

  _buildPresetGrid();
  _updateExpPreview();
}

function _scopeStyle(s) {
  var active = _expCfg.scope === s;
  return 'flex:1;padding:8px;border-radius:6px;border:1.5px solid ' + (active ? '#7CFF7C' : '#1e1e1e') + ';background:' + (active ? 'rgba(124,255,124,.1)' : '#141414') + ';color:' + (active ? '#7CFF7C' : '#555') + ';font-size:11px;font-family:Poppins,sans-serif;cursor:pointer;';
}

function _fmtStyle(f) {
  var active = _expCfg.format === f;
  return 'flex:1;padding:9px 6px;border-radius:6px;border:1.5px solid ' + (active ? '#7CFF7C' : '#1e1e1e') + ';background:' + (active ? 'rgba(124,255,124,.1)' : '#141414') + ';color:' + (active ? '#7CFF7C' : '#666') + ';font-size:11px;font-family:Poppins,sans-serif;cursor:pointer;text-align:center;';
}

function _buildPresetGrid() {
  var g = document.getElementById('expPresetGrid'); if (!g) return;
  g.innerHTML = '';
  EXPORT_PRESETS.forEach(function(p) {
    var active = _expCfg.presetId === p.id;
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:8px 4px;border-radius:7px;border:1.5px solid ' + (active ? '#7CFF7C' : '#1e1e1e') + ';background:' + (active ? 'rgba(124,255,124,.1)' : '#141414') + ';color:' + (active ? '#7CFF7C' : '#666') + ';font-size:10px;font-family:Poppins,sans-serif;cursor:pointer;text-align:center;';
    btn.innerHTML = '<div style="font-size:16px;margin-bottom:3px">' + p.icon + '</div><div style="font-weight:600;margin-bottom:1px">' + p.label + '</div><div style="font-size:8px;color:#444">' + p.desc + '</div>';
    btn.onclick = function() { _selectPreset(p.id); };
    g.appendChild(btn);
  });
}

function _selectPreset(id) {
  var p = EXPORT_PRESETS.find(function(x) { return x.id === id; });
  if (!p) return;
  _expCfg.presetId = id; _expCfg.w = p.w; _expCfg.h = p.h;
  var cr = document.getElementById('expCustomRow');
  if (cr) cr.style.display = id === 'custom' ? 'block' : 'none';
  _buildPresetGrid();
  _updateExpPreview();
}

function _setExpScope(s) {
  _expCfg.scope = s;
  var bc = document.getElementById('scope-current');
  var ba = document.getElementById('scope-all');
  if (bc) bc.style.cssText = _scopeStyle('current');
  if (ba) ba.style.cssText = _scopeStyle('all');
  var rb = document.getElementById('expRunBtn');
  if (rb) rb.textContent = '⬇ Export ' + (s === 'all' ? 'All ' + slides.length + ' Slides' : 'Current Slide');
}

function _setExpFmt(fmt) {
  _expCfg.format = fmt;
  ['png','jpg','webp'].forEach(function(f) {
    var b = document.getElementById('fmt-' + f);
    if (b) b.style.cssText = _fmtStyle(f);
  });
  var qr = document.getElementById('expQualityRow');
  if (qr) qr.style.display = fmt === 'png' ? 'none' : 'block';
}

function _updateExpPreview() {
  var el = document.getElementById('expPreview'); if (!el) return;
  var c = _expCfg;
  var mp   = ((c.w * c.h) / 1e6).toFixed(1);
  var count = c.scope === 'all' ? slides.length : 1;
  var q     = c.format === 'png' ? 'lossless' : c.quality + '% quality';
  el.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;">' +
      _pvRow('📐 Dimensions', c.w + '×' + c.h + ' px') +
      _pvRow('📊 Megapixels', mp + ' MP') +
      _pvRow('🗜 Format', c.format.toUpperCase() + ' · ' + q) +
      _pvRow('🎞 Files', count + ' file' + (count > 1 ? 's' : '')) +
      _pvRow('📄 Example', c.filename + '-1.' + c.format) +
      _pvRow('⬜ Aspect', (c.w / c.h).toFixed(2) + ':1') +
    '</div>';
}

function _pvRow(label, val) {
  return '<div><div style="font-size:9px;color:#444;margin-bottom:1px">' + label + '</div><div style="font-size:11px;color:#aaa;font-weight:600">' + val + '</div></div>';
}

/* ══ EXPORT RUNNER ══ */
function _runExport() {
  if (_expModal) { _expModal.remove(); _expModal = null; }
  var c = _expCfg;
  var w = c.w, h = c.h, fmt = c.format, q = c.quality / 100, fn = c.filename;

  if (c.scope === 'current') {
    var slide = getActive(); if (!slide) return;
    _showOv('Exporting "' + slide.label + '"...');
    setTimeout(function() {
      try {
        _renderToCanvas(slide, w, h, function(cv) {
          _hideOv();
          _dlCanvas(cv, fn + '-' + (activeSlideIdx + 1) + '.' + fmt, fmt, q);
          showToast('✅ Exported!');
        });
      } catch(err) { _hideOv(); alert('Export failed: ' + err.message); }
    }, 80);

  } else {
    var idx = 0;
    function exportNext() {
      if (idx >= slides.length) { _hideOv(); showToast('✅ All ' + slides.length + ' slides exported!'); return; }
      _showOv('Exporting ' + (idx + 1) + ' / ' + slides.length + ': ' + slides[idx].label);
      var si = idx; idx++;
      setTimeout(function() {
        try {
          _renderToCanvas(slides[si], w, h, function(cv) {
            _dlCanvas(cv, fn + '-' + (si + 1) + '-' + _slug(slides[si].label) + '.' + fmt, fmt, q);
            setTimeout(exportNext, 300);
          });
        } catch(err2) { console.warn('export error slide', si, err2); setTimeout(exportNext, 100); }
      }, 60);
    }
    exportNext();
  }
}

/* ══ CANVAS RENDERER ══ */
function _renderToCanvas(slide, outW, outH, callback) {
  var cv  = document.createElement('canvas');
  cv.width = outW; cv.height = outH;
  var ctx = cv.getContext('2d');
  var scX = outW / CANVAS_SIZE, scY = outH / CANVAS_SIZE;

  // 1. BG color
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, outW, outH);

  // 2. BG image or pattern
  var bgUrl = bgDataUrl || getBgSvg();
  var els   = Object.values(slide.elements).filter(function(e) { return !e.hidden; });
  var elIdx = 0;

  function drawElements() {
    if (elIdx >= els.length) { callback(cv); return; }
    var el = els[elIdx++];
    ctx.save();
    ctx.globalAlpha = el.globalOpacity != null ? el.globalOpacity : 1;
    try {
      var done = _drawElSync(ctx, el, slide, scX, scY, function() {
        ctx.globalAlpha = 1; ctx.restore();
        drawElements();
      });
      if (done) { ctx.globalAlpha = 1; ctx.restore(); drawElements(); }
    } catch(e) {
      console.warn('draw error', el.type, e.message);
      ctx.globalAlpha = 1; ctx.restore();
      drawElements();
    }
  }

  if (bgUrl) {
    _loadAndDraw(ctx, bgUrl, 0, 0, outW, outH, 'cover', 0, 1, drawElements);
  } else {
    drawElements();
  }
}

// Returns true if synchronous (no image load needed), false if async (calls cb when done)
function _drawElSync(ctx, el, slide, scX, scY, cb) {
  switch(el.type) {
    case 'frame':   _canvasFrame(ctx, scX, scY); return true;
    case 'text':    _canvasText(ctx, el, slide, scX, scY); return true;
    case 'stepnum': _canvasStepNum(ctx, el, slide, scX, scY); return true;
    case 'button':  _canvasButton(ctx, el, scX, scY); return true;
    case 'rect':    _canvasRect(ctx, el, scX, scY); return true;
    case 'circle':  _canvasCircle(ctx, el, scX, scY); return true;
    case 'line':
    case 'divider': _canvasLine(ctx, el, scX, scY); return true;
    case 'dots':    _canvasDots(ctx, el, slide, scX, scY); return true;
    case 'arrow':   _canvasArrow(ctx, el, scX, scY); return true;
    case 'logo':
      if (!logoUrl) return true;
      _loadAndDraw(ctx, logoUrl, el.x*scX, el.y*scY, (el.w||110)*scX, (el.h||60)*scY, 'contain', 0, 1, cb);
      return false;
    case 'image':
      var url = slide.imgUrls && slide.imgUrls[el.id];
      if (!url) return true;
      _loadAndDraw(ctx, url, el.x*scX, el.y*scY, (el.w||180)*scX, (el.h||180)*scY, 'cover', (el.radius||0)*scX, 1, cb);
      return false;
    default: return true;
  }
}

/* ── Canvas draw helpers ── */
function _canvasFrame(ctx, scX, scY) {
  var W = CANVAS_SIZE*scX, H = CANVAS_SIZE*scY, ins = 12*scX, cl = 14*scX, lw = 2*scX;
  ctx.strokeStyle = AC + '28'; ctx.lineWidth = scX;
  ctx.strokeRect(ins, ins, W-ins*2, H-ins*2);
  ctx.strokeStyle = AC; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(ins, ins+cl); ctx.lineTo(ins, ins); ctx.lineTo(ins+cl, ins); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W-ins-cl, H-ins); ctx.lineTo(W-ins, H-ins); ctx.lineTo(W-ins, H-ins-cl); ctx.stroke();
}

function _canvasText(ctx, el, slide, scX, scY) {
  var lines = (el.text || '').split('\n');
  var fs = (el.fs || 16) * scX;
  ctx.font = (el.italic?'italic ':'') + (el.bold?'800':'400') + ' ' + fs + 'px \'' + (el.font||'Poppins') + '\',sans-serif';
  ctx.textBaseline = 'top';
  if (el.shadowX||el.shadowY||el.shadowBlur) {
    ctx.shadowOffsetX = (el.shadowX||0)*scX; ctx.shadowOffsetY = (el.shadowY||0)*scY;
    ctx.shadowBlur = (el.shadowBlur||0)*scX; ctx.shadowColor = el.shadowColor||'#000';
  }
  var lh = fs * (el.lineHeight || 1.18);
  var bx = el.x*scX, bw = el.w*scX, ty = el.y*scY;
  lines.forEach(function(line, i) {
    ctx.fillStyle = (el.colorLine2 && i===1) ? AC : (el.color || '#fff');
    var tw = ctx.measureText(line).width;
    var tx = el.align==='center' ? bx+(bw-tw)/2 : el.align==='right' ? bx+bw-tw : bx;
    ctx.fillText(line, tx, ty);
    ty += lh;
  });
  ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowBlur = 0;
}

function _canvasStepNum(ctx, el, slide, scX, scY) {
  var stepSlides = slides.filter(function(s) { return s.type==='step'; });
  var idx = stepSlides.indexOf(slide);
  var num = String(idx >= 0 ? idx+1 : 1);
  var fs  = (el.fs||108) * scX;
  ctx.font = '900 ' + fs + 'px Poppins,sans-serif';
  ctx.textBaseline = 'top'; ctx.fillStyle = AC;
  ctx.shadowColor = AC; ctx.shadowBlur = 40*scX;
  ctx.fillText(num, el.x*scX, el.y*scY);
  ctx.shadowBlur = 0;
}

function _canvasButton(ctx, el, scX, scY) {
  var x=el.x*scX, y=el.y*scY, w=el.w*scX, h=(el.h||50)*scY, r=h/2;
  ctx.strokeStyle = AC; ctx.lineWidth = 2*scX;
  _rrPath(ctx, x, y, w, h, r); ctx.stroke();
  ctx.font = '700 ' + ((el.fs||13)*scX) + 'px Poppins,sans-serif';
  ctx.fillStyle = AC; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText((el.text||'BUTTON').toUpperCase(), x+w/2, y+h/2);
  ctx.textAlign = 'left';
}

function _canvasRect(ctx, el, scX, scY) {
  var x=el.x*scX, y=el.y*scY, w=el.w*scX, h=(el.h||60)*scY;
  ctx.save();
  ctx.globalAlpha *= (el.opacity != null ? el.opacity : 0.2);
  if (el.fillType==='gradient' && el.color2) {
    var grd = ctx.createLinearGradient(x, y, el.gradDir==='to bottom'?x:x+w, el.gradDir==='to bottom'?y+h:y);
    grd.addColorStop(0, el.color||AC); grd.addColorStop(1, el.color2);
    ctx.fillStyle = grd;
  } else { ctx.fillStyle = el.color || AC; }
  _rrPath(ctx, x, y, w, h, (el.radius||0)*scX); ctx.fill();
  if (el.strokeWidth) { ctx.strokeStyle = el.strokeColor||'#fff'; ctx.lineWidth = el.strokeWidth*scX; _rrPath(ctx,x,y,w,h,(el.radius||0)*scX); ctx.stroke(); }
  ctx.restore();
}

function _canvasCircle(ctx, el, scX, scY) {
  var cx=(el.x+el.w/2)*scX, cy=(el.y+el.w/2)*scY, r=(el.w/2)*scX;
  ctx.save();
  ctx.globalAlpha *= (el.opacity != null ? el.opacity : 0.2);
  ctx.fillStyle = el.color || AC;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  if (el.strokeWidth) { ctx.strokeStyle=el.strokeColor||'#fff'; ctx.lineWidth=el.strokeWidth*scX; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke(); }
  ctx.restore();
}

function _canvasLine(ctx, el, scX, scY) {
  var x=el.x*scX, y=el.y*scY, w=el.w*scX, h=Math.max(1,(el.h||2)*scY);
  ctx.save();
  ctx.globalAlpha *= (el.opacity != null ? el.opacity : 1);
  var g = ctx.createLinearGradient(x, 0, x+w, 0);
  g.addColorStop(0, (el.color||AC) + 'aa'); g.addColorStop(1, (el.color||AC) + '11');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function _canvasDots(ctx, el, slide, scX, scY) {
  var total=Math.min(slides.length,8), active=slides.indexOf(slide);
  var r=3*scX, gap=5*scX, cx=el.x*scX+r, cy=el.y*scY+r;
  for (var i=0;i<total;i++) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fillStyle = i===active ? AC : AC+'33';
    if (i===active) { ctx.shadowColor=AC; ctx.shadowBlur=5*scX; }
    ctx.fill(); ctx.shadowBlur=0;
    cx += r*2 + gap;
  }
}

function _canvasArrow(ctx, el, scX, scY) {
  var cx=(el.x+el.w/2)*scX, cy=(el.y+(el.h||36)/2)*scY, r=(el.w/2)*scX;
  ctx.strokeStyle=AC+'88'; ctx.lineWidth=2*scX;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  var s=5*scX;
  ctx.strokeStyle=AC; ctx.lineWidth=2*scX; ctx.beginPath();
  ctx.moveTo(cx-s*0.5, cy-s*0.5); ctx.lineTo(cx+s*0.5, cy+s*0.5); ctx.stroke();
}

function _loadAndDraw(ctx, src, x, y, w, h, fit, radius, alpha, cb) {
  var img = new Image(); img.crossOrigin = 'anonymous';
  img.onload = function() {
    ctx.save();
    if (radius > 0) { _rrPath(ctx, x, y, w, h, radius); ctx.clip(); }
    var dx=x, dy=y, dw=w, dh=h;
    if (fit === 'cover') {
      var sc = Math.max(w/img.naturalWidth, h/img.naturalHeight);
      dw=img.naturalWidth*sc; dh=img.naturalHeight*sc; dx=x+(w-dw)/2; dy=y+(h-dh)/2;
    } else if (fit === 'contain') {
      var sc2 = Math.min(w/img.naturalWidth, h/img.naturalHeight);
      dw=img.naturalWidth*sc2; dh=img.naturalHeight*sc2; dx=x+(w-dw)/2; dy=y+(h-dh)/2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore(); cb();
  };
  img.onerror = function() { cb(); };
  img.src = src;
}

function _rrPath(ctx, x, y, w, h, r) {
  r = Math.min(r||0, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}

function _dlCanvas(canvas, filename, format, quality) {
  var mime = format==='jpg' ? 'image/jpeg' : format==='webp' ? 'image/webp' : 'image/png';
  canvas.toBlob(function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  }, mime, quality);
}

function _slug(str) { return (str||'slide').replace(/\s+/g,'-').toLowerCase(); }
function _showOv(msg) {
  var o=document.getElementById('ov'); if(o) o.classList.add('show');
  var m=document.getElementById('ov-msg'); if(m) m.textContent=msg;
}
function _hideOv() {
  var o=document.getElementById('ov'); if(o) o.classList.remove('show');
}
