/* ══════════════════════════════════════
   CONTEXT_MENU.JS
══════════════════════════════════════ */
var _ctxEid = null;

function _initContextMenu() {
  /* Create menu element if missing */
  if (!document.getElementById('ctxMenu')) {
    var m = document.createElement('div');
    m.id = 'ctxMenu';
    document.body.appendChild(m);
  }

  document.addEventListener('contextmenu', function(e) {
    var drel = e.target.closest('.drel');
    if (!drel) return;
    e.preventDefault();
    _ctxEid = drel.dataset.eid;
    selectDomEl(drel, _ctxEid);
    _showCtx(e.clientX, e.clientY, _ctxEid);
  });

  /* Long-press for mobile context menu */
  var _lpTimer = null;
  document.addEventListener('touchstart', function(e) {
    var drel = e.target.closest('.drel');
    if (!drel) return;
    _lpTimer = setTimeout(function() {
      _ctxEid = drel.dataset.eid;
      selectDomEl(drel, _ctxEid);
      var t = e.touches[0];
      _showCtx(t.clientX, t.clientY, _ctxEid);
    }, 600);
  }, { passive: true });
  document.addEventListener('touchend',   function() { clearTimeout(_lpTimer); });
  document.addEventListener('touchmove',  function() { clearTimeout(_lpTimer); });

  document.addEventListener('click', _hideCtx);
  document.addEventListener('touchstart', _hideCtxOnOutside, { passive: true });
}

function _showCtx(x, y, eid) {
  var slide = getActive(); if (!slide) return;
  var el    = eid ? slide.elements[eid] : null;
  var menu  = document.getElementById('ctxMenu');
  if (!menu) return;

  var locked = el && el.locked;
  var hidden = el && el.hidden;

  menu.innerHTML =
    (el ? '<div class="ctx-item" onclick="_ctxDo(\'prop\')">⚙️ Properties</div>' : '') +
    (el ? '<div class="ctx-item" onclick="_ctxDo(\'dup\')">⧉ Duplicate</div>' : '') +
    (el ? '<div class="ctx-item" onclick="_ctxDo(\'lock\')">' + (locked ? '🔓 Unlock' : '🔒 Lock') + '</div>' : '') +
    (el ? '<div class="ctx-item" onclick="_ctxDo(\'vis\')">'  + (hidden ? '👁 Show'   : '🙈 Hide')  + '</div>' : '') +
    '<div class="ctx-sep"></div>' +
    '<div class="ctx-item" onclick="_ctxDo(\'alCX\')">↔ Center Horizontal</div>' +
    '<div class="ctx-item" onclick="_ctxDo(\'alCY\')">↕ Center Vertical</div>' +
    '<div class="ctx-item" onclick="_ctxDo(\'alC\')">⊕ Center Both</div>' +
    '<div class="ctx-sep"></div>' +
    (el ? '<div class="ctx-item danger" onclick="_ctxDo(\'del\')">🗑 Delete</div>' : '');

  /* Clamp to viewport */
  var vw = window.innerWidth, vh = window.innerHeight;
  var mx = Math.min(x, vw - 210);
  var my = Math.min(y, vh - menu.scrollHeight - 20);

  menu.style.cssText =
    'display:block;left:' + mx + 'px;top:' + my + 'px;position:fixed;';
}

function _hideCtx() {
  var m = document.getElementById('ctxMenu');
  if (m) m.style.display = 'none';
}
function _hideCtxOnOutside(e) {
  var m = document.getElementById('ctxMenu');
  if (m && m.style.display === 'block' && !m.contains(e.target)) _hideCtx();
}

function _ctxDo(action) {
  _hideCtx();
  var slide = getActive();
  var el    = slide && _ctxEid ? slide.elements[_ctxEid] : null;
  switch(action) {
    case 'prop': if (typeof buildPropPanel==='function') buildPropPanel(_ctxEid); break;
    case 'dup':  if (_ctxEid) duplicateEl(_ctxEid); break;
    case 'lock':
      if (el) { pushHistory(); el.locked = !el.locked; renderActiveSlide(); buildElTable(); } break;
    case 'vis':
      if (el) { pushHistory(); el.hidden = !el.hidden; renderActiveSlide(); buildElTable(); } break;
    case 'del':
      if (el && confirm('Delete this element?')) {
        pushHistory(); delete slide.elements[_ctxEid];
        selEl=null; selElId=null; renderActiveSlide(); buildElTable();
        if(typeof clearPropPanel==='function') clearPropPanel();
      } break;
    case 'alCX': alignEl('cx');     break;
    case 'alCY': alignEl('cy');     break;
    case 'alC':  alignEl('center'); break;
  }
}
