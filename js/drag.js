var _multiSel = new Set();
var _spaceDown = false;

function setMode(m) {
  mode = m;
  var edit = document.getElementById('m-edit');
  var drag = document.getElementById('m-drag');
  if (edit) edit.classList.toggle('active', m==='edit');
  if (drag) drag.classList.toggle('active', m==='drag');
  document.querySelectorAll('.drel').forEach(function(d){
    d.classList.toggle('drag-mode', m==='drag');
  });
}

function selectDomEl(dom, eid) {
  if (selEl && selEl !== dom) selEl.classList.remove('selected');
  selEl = dom; selElId = eid;
  dom.classList.add('selected');
  if (typeof buildPropPanel === 'function') buildPropPanel(eid);
  if (typeof buildElTable   === 'function') buildElTable();
  var slide = getActive();
  if (slide && slide.elements[eid]) updateStatusBar(slide.elements[eid]);
}

function updateStatusBar(el) {
  var sb = document.getElementById('statusBar'); if (!sb) return;
  if (!el) { sb.textContent = ''; return; }
  sb.textContent = 'X:' + Math.round(el.x||0) + '  Y:' + Math.round(el.y||0) + '  W:' + Math.round(el.w||0) + '  H:' + Math.round(el.h||0) + '  — ' + (el.label||el.type);
}

function _attachMoveEvents(w, eid) {
  w.addEventListener('mousedown', function(e) {
    if (mode !== 'drag') return;
    if (e.target.classList.contains('rh')) return;
    if (e.target.classList.contains('etb-btn')) return;
    if (e.target.tagName === 'INPUT') return;
    var slide = getActive();
    var el = slide && slide.elements[eid];
    if (!el || el.locked) return;
    e.preventDefault(); e.stopPropagation();
    selectDomEl(w, eid);
    var ox=el.x, oy=el.y, sx=e.clientX, sy=e.clientY;
    var zl = typeof zoomLevel !== 'undefined' ? zoomLevel : 1;
    function mv(ev) {
      var nx = ox + (ev.clientX - sx)/zl;
      var ny = oy + (ev.clientY - sy)/zl;
      if (snapEnabled && !ev.altKey) {
        var s = snapPosition(el, nx, ny);
        nx = s.x; ny = s.y;
        showSnapGuides(s.guideX, s.guideY);
      } else { clearSnapGuides(); }
      el.x = Math.round(nx); el.y = Math.round(ny);
      w.style.left = el.x + 'px'; w.style.top = el.y + 'px';
      if (typeof syncPropPos === 'function') syncPropPos(el);
      updateStatusBar(el);
    }
    function up() {
      document.removeEventListener('mousemove', mv);
      document.removeEventListener('mouseup', up);
      clearSnapGuides(); pushHistory();
    }
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });

  w.addEventListener('click', function(e) {
    if (e.target.classList.contains('rh')) return;
    if (e.target.classList.contains('etb-btn')) return;
    if (e.shiftKey) {
      _multiSel.has(eid) ? (_multiSel.delete(eid), w.classList.remove('multi-sel')) : (_multiSel.add(eid), w.classList.add('multi-sel'));
      return;
    }
    selectDomEl(w, eid);
  });

  w.addEventListener('contextmenu', function(e) {
    selectDomEl(w, eid);
    if (typeof showContextMenu === 'function') showContextMenu(e, eid);
  });
}

function _startResize(e, w, eid, pos) {
  if (mode !== 'drag') return;
  var slide = getActive();
  var el = slide && slide.elements[eid];
  if (!el || el.locked) return;
  e.preventDefault(); e.stopPropagation();
  selectDomEl(w, eid);
  var sx=e.clientX, sy=e.clientY;
  var sw=el.w||100, sh=el.h||60;
  var ox=el.x, oy=el.y, ofs=el.fs||16;
  var zl = typeof zoomLevel !== 'undefined' ? zoomLevel : 1;
  function mv(ev) {
    var dx=(ev.clientX-sx)/zl, dy=(ev.clientY-sy)/zl;
    var nw=sw, nh=sh, nx=ox, ny=oy;
    if (pos.indexOf('r')>-1) nw=Math.max(10,sw+dx);
    if (pos.indexOf('l')>-1){ nw=Math.max(10,sw-dx); nx=ox+dx; }
    if (pos.indexOf('b')>-1) nh=Math.max(4,sh+dy);
    if (pos==='tl'||pos==='tm'||pos==='tr'){ nh=Math.max(4,sh-dy); ny=oy+dy; }
    if (ev.shiftKey && sw>0){ nh=nw*(sh/sw); }
    el.x=Math.round(nx); el.y=Math.round(ny); el.w=Math.round(nw); el.h=Math.round(nh);
    w.style.left=el.x+'px'; w.style.top=el.y+'px'; w.style.width=el.w+'px';
    if (el.fs){ var nfs=Math.max(6,Math.round(ofs*(nw/sw))); el.fs=nfs; var tn=w.querySelector('[data-tn]'); if(tn) tn.style.fontSize=nfs+'px'; }
    w.style.height = el.h + 'px';
    if (typeof syncPropPos==='function') syncPropPos(el);
    updateStatusBar(el);
  }
  function up() {
    document.removeEventListener('mousemove', mv);
    document.removeEventListener('mouseup', up);
    pushHistory();
  }
  document.addEventListener('mousemove', mv);
  document.addEventListener('mouseup', up);
}

function getSelectedIds() {
  var ids = Array.from(_multiSel);
  if (selElId && ids.indexOf(selElId)<0) ids.unshift(selElId);
  return ids;
}

function clearMultiSel() {
  _multiSel.clear();
  document.querySelectorAll('.drel.multi-sel').forEach(function(d){ d.classList.remove('multi-sel'); });
}

// Deselect on canvas background click
document.addEventListener('mousedown', function(e) {
  if (!e.target.closest('.drel') && !e.target.closest('#propPanel') && !e.target.closest('#lpb-elements') && !e.target.closest('#ctxMenu')) {
    if (selEl) { selEl.classList.remove('selected'); selEl=null; selElId=null; }
    clearMultiSel();
    if (typeof clearPropPanel==='function') clearPropPanel();
    updateStatusBar(null);
  }
}, true);
