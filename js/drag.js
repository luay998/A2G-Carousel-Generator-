/* ══════════════════════════════════════
   DRAG.JS — Mouse + Touch unified
══════════════════════════════════════ */

var _dragging    = false;
var _resizing    = false;
var _dragEl      = null;
var _dragElId    = null;
var _dragStartX  = 0;
var _dragStartY  = 0;
var _elStartX    = 0;
var _elStartY    = 0;
var _resizeDir   = '';
var _resizeEl    = null;
var _resizeElId  = null;
var _resStartX   = 0;
var _resStartY   = 0;
var _resElX      = 0;
var _resElY      = 0;
var _resElW      = 0;
var _resElH      = 0;

/* ── Attach move events to a .drel wrapper ── */
function _attachMoveEvents(el, eid) {
  /* Mouse */
  el.addEventListener('mousedown',  function(e) { _onDragStart(e, el, eid); });
  /* Touch */
  el.addEventListener('touchstart', function(e) { _onDragStart(e, el, eid); }, { passive: false });
}

/* ── Start resize from handle ── */
function _startResize(e, wrap, eid, dir) {
  e.preventDefault();
  e.stopPropagation();

  var pos = _getEventPos(e);
  _resizing  = true;
  _resizeEl  = wrap;
  _resizeElId= eid;
  _resizeDir = dir;
  _resStartX = pos.x;
  _resStartY = pos.y;
  _resElX    = parseInt(wrap.style.left)  || 0;
  _resElY    = parseInt(wrap.style.top)   || 0;
  _resElW    = parseInt(wrap.style.width) || 100;
  _resElH    = parseInt(wrap.style.height)|| 60;

  selectDomEl(wrap, eid);
  _addDocListeners();
}

/* ── Drag start ── */
function _onDragStart(e, el, eid) {
  if (el.dataset.locked === '1') return;
  /* In edit mode only start drag if user explicitly moves */
  if (mode === 'edit') {
    /* Still allow selecting in edit mode */
    selectDomEl(el, eid);
    /* Only drag if target is the element itself (not a child control) */
    if (e.target.closest('.etb-btn') || e.target.closest('.rh') ||
        e.target.closest('input')    || e.target.closest('textarea') ||
        e.target.closest('select')   || e.target.closest('.upload-area')) return;
  }
  if (mode !== 'drag' && mode !== 'edit') return;

  e.preventDefault();
  e.stopPropagation();

  var pos = _getEventPos(e);
  _dragging   = true;
  _dragEl     = el;
  _dragElId   = eid;
  _dragStartX = pos.x;
  _dragStartY = pos.y;
  _elStartX   = parseInt(el.style.left) || 0;
  _elStartY   = parseInt(el.style.top)  || 0;

  selectDomEl(el, eid);
  _addDocListeners();
}

/* ── Unified move ── */
function _onMove(e) {
  if (!_dragging && !_resizing) return;
  e.preventDefault();
  var pos = _getEventPos(e);

  if (_dragging && _dragEl) {
    var dx = pos.x - _dragStartX;
    var dy = pos.y - _dragStartY;
    var scale = _getCanvasScale();
    var nx = _elStartX + dx / scale;
    var ny = _elStartY + dy / scale;

    if (snapEnabled) {
      nx = _snap(nx);
      ny = _snap(ny);
    }
    nx = Math.max(0, Math.min(nx, CANVAS_SIZE - 10));
    ny = Math.max(0, Math.min(ny, CANVAS_SIZE - 10));

    _dragEl.style.left = nx + 'px';
    _dragEl.style.top  = ny + 'px';
    _updateStatus('x:' + Math.round(nx) + ' y:' + Math.round(ny));
  }

  if (_resizing && _resizeEl) {
    var scale2 = _getCanvasScale();
    var rdx = (pos.x - _resStartX) / scale2;
    var rdy = (pos.y - _resStartY) / scale2;
    var nx2 = _resElX, ny2 = _resElY;
    var nw  = _resElW, nh  = _resElH;
    var MIN = 20;

    switch(_resizeDir) {
      case 'br': nw = Math.max(MIN, _resElW + rdx); nh = Math.max(MIN, _resElH + rdy); break;
      case 'bl': nx2=_resElX+rdx; nw=Math.max(MIN,_resElW-rdx); nh=Math.max(MIN,_resElH+rdy); break;
      case 'tr': nw=Math.max(MIN,_resElW+rdx); ny2=_resElY+rdy; nh=Math.max(MIN,_resElH-rdy); break;
      case 'tl': nx2=_resElX+rdx; ny2=_resElY+rdy; nw=Math.max(MIN,_resElW-rdx); nh=Math.max(MIN,_resElH-rdy); break;
      case 'mr': nw=Math.max(MIN,_resElW+rdx); break;
      case 'ml': nx2=_resElX+rdx; nw=Math.max(MIN,_resElW-rdx); break;
      case 'bm': nh=Math.max(MIN,_resElH+rdy); break;
      case 'tm': ny2=_resElY+rdy; nh=Math.max(MIN,_resElH-rdy); break;
    }
    if (snapEnabled) { nw=_snap(nw); nh=_snap(nh); nx2=_snap(nx2); ny2=_snap(ny2); }

    _resizeEl.style.left   = nx2 + 'px';
    _resizeEl.style.top    = ny2 + 'px';
    _resizeEl.style.width  = nw  + 'px';
    _resizeEl.style.height = nh  + 'px';
    _updateStatus('w:' + Math.round(nw) + ' h:' + Math.round(nh));
  }
}

/* ── End drag / resize ── */
function _onEnd(e) {
  if (!_dragging && !_resizing) return;

  if (_dragging && _dragEl && _dragElId) {
    var slide = getActive();
    if (slide && slide.elements[_dragElId]) {
      var el = slide.elements[_dragElId];
      el.x = parseInt(_dragEl.style.left) || 0;
      el.y = parseInt(_dragEl.style.top)  || 0;
      pushHistory();
    }
  }

  if (_resizing && _resizeEl && _resizeElId) {
    var slide2 = getActive();
    if (slide2 && slide2.elements[_resizeElId]) {
      var el2 = slide2.elements[_resizeElId];
      el2.x = parseInt(_resizeEl.style.left)   || 0;
      el2.y = parseInt(_resizeEl.style.top)    || 0;
      el2.w = parseInt(_resizeEl.style.width)  || el2.w;
      el2.h = parseInt(_resizeEl.style.height) || el2.h;
      pushHistory();
      buildElTable();
    }
  }

  _dragging  = false;
  _resizing  = false;
  _dragEl    = null;
  _dragElId  = null;
  _resizeEl  = null;
  _resizeElId= null;
  _removeDocListeners();
  _updateStatus('');
}

/* ── Document-level listeners ── */
function _addDocListeners() {
  document.addEventListener('mousemove',  _onMove,   { passive: false });
  document.addEventListener('mouseup',    _onEnd);
  document.addEventListener('touchmove',  _onMove,   { passive: false });
  document.addEventListener('touchend',   _onEnd);
  document.addEventListener('touchcancel',_onEnd);
}
function _removeDocListeners() {
  document.removeEventListener('mousemove',  _onMove);
  document.removeEventListener('mouseup',    _onEnd);
  document.removeEventListener('touchmove',  _onMove);
  document.removeEventListener('touchend',   _onEnd);
  document.removeEventListener('touchcancel',_onEnd);
}

/* ── Get unified pointer position ── */
function _getEventPos(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

/* ── Get canvas CSS scale from zoom ── */
function _getCanvasScale() {
  var wrap = document.getElementById('canvasWrap');
  if (!wrap) return 1;
  var m = wrap.style.transform.match(/scale\(([^)]+)\)/);
  return m ? parseFloat(m[1]) : 1;
}

/* ── Select a DOM element ── */
function selectDomEl(domEl, eid) {
  /* Deselect previous */
  if (selEl && selEl !== domEl) selEl.classList.remove('selected');
  selEl   = domEl;
  selElId = eid;
  if (domEl) domEl.classList.add('selected');
  if (eid && typeof buildPropPanel === 'function') buildPropPanel(eid);
  _updateStatus('');
}

/* ── Deselect on canvas click ── */
function _initCanvasClick() {
  var area = document.getElementById('canvasArea');
  if (!area) return;
  area.addEventListener('mousedown', function(e) {
    if (!e.target.closest('.drel')) {
      if (selEl) selEl.classList.remove('selected');
      selEl = null; selElId = null;
      if (typeof clearPropPanel === 'function') clearPropPanel();
    }
  });
  area.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.drel')) {
      if (selEl) selEl.classList.remove('selected');
      selEl = null; selElId = null;
      if (typeof clearPropPanel === 'function') clearPropPanel();
    }
  }, { passive: true });
}

/* ── Duplicate element ── */
function duplicateEl(eid) {
  var slide = getActive(); if (!slide) return;
  var src   = slide.elements[eid]; if (!src) return;
  pushHistory();
  var copy  = JSON.parse(JSON.stringify(src));
  copy.id   = newElId();
  copy.x    = (copy.x || 0) + 15;
  copy.y    = (copy.y || 0) + 15;
  slide.elements[copy.id] = copy;
  renderActiveSlide();
  buildElTable();
  setTimeout(function() {
    var dom = document.querySelector('[data-eid="' + copy.id + '"]');
    if (dom) selectDomEl(dom, copy.id);
  }, 50);
  showToast('⧉ Duplicated');
}

function _updateStatus(msg) {
  var sb = document.getElementById('statusBar');
  if (sb) sb.textContent = msg || 'Ready';
}
