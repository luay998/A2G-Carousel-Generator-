var _clipboardEl = null;

function isTyping() {
  var t = document.activeElement;
  if (!t) return false;
  var tag = t.tagName.toLowerCase();
  return tag==='input'||tag==='textarea'||tag==='select'||t.isContentEditable;
}

document.addEventListener('keydown', function(e) {
  // Undo/Redo — always
  if ((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key==='z') { e.preventDefault(); undo(); return; }
  if ((e.ctrlKey||e.metaKey) && (e.key==='y'||(e.shiftKey&&e.key==='Z'))) { e.preventDefault(); redo(); return; }

  if (isTyping()) return;

  var slide = getActive();

  // Save
  if ((e.ctrlKey||e.metaKey) && e.key==='s') { e.preventDefault(); saveProject(); return; }

  // Copy
  if ((e.ctrlKey||e.metaKey) && e.key==='c' && selElId && slide) {
    e.preventDefault();
    _clipboardEl = JSON.parse(JSON.stringify(slide.elements[selElId]));
    showToast('📋 Copied'); return;
  }
  // Paste
  if ((e.ctrlKey||e.metaKey) && e.key==='v' && _clipboardEl && slide) {
    e.preventDefault();
    pushHistory();
    var nid=newElId();
    slide.elements[nid]=JSON.parse(JSON.stringify(_clipboardEl));
    slide.elements[nid].id=nid;
    slide.elements[nid].x=(_clipboardEl.x||0)+20;
    slide.elements[nid].y=(_clipboardEl.y||0)+20;
    renderActiveSlide(); buildElTable(); showToast('📋 Pasted'); return;
  }
  // Duplicate
  if ((e.ctrlKey||e.metaKey) && e.key==='d' && selElId) {
    e.preventDefault(); duplicateEl(selElId); return;
  }
  // Select all
  if ((e.ctrlKey||e.metaKey) && e.key==='a' && slide) {
    e.preventDefault();
    Object.keys(slide.elements).forEach(function(id){ _multiSel.add(id); });
    document.querySelectorAll('.drel').forEach(function(d){ d.classList.add('multi-sel','selected'); });
    return;
  }

  switch(e.key) {
    case 'Escape':
      if (selEl) { selEl.classList.remove('selected'); selEl=null; selElId=null; }
      clearMultiSel(); clearPropPanel(); removeContextMenu(); break;
    case 'Delete': case 'Backspace':
      if (selElId && slide && slide.elements[selElId]) {
        e.preventDefault(); pushHistory();
        delete slide.elements[selElId];
        selEl=null; selElId=null;
        renderActiveSlide(); buildElTable(); clearPropPanel();
      } break;
    case 'ArrowLeft': case 'ArrowRight': case 'ArrowUp': case 'ArrowDown':
      if (selElId && slide && slide.elements[selElId]) {
        e.preventDefault();
        var el=slide.elements[selElId], step=e.shiftKey?10:1;
        if(e.key==='ArrowLeft')  el.x-=step;
        if(e.key==='ArrowRight') el.x+=step;
        if(e.key==='ArrowUp')    el.y-=step;
        if(e.key==='ArrowDown')  el.y+=step;
        var dom=document.querySelector('[data-eid="'+selElId+'"]');
        if(dom){ dom.style.left=el.x+'px'; dom.style.top=el.y+'px'; }
        syncPropPos(el);
      } break;
    case 'e': case 'E': setMode('edit'); break;
    case 'm': case 'M': setMode('drag'); break;
    case 'g': case 'G': toggleGrid(); break;
    case 'n': case 'N': toggleSnap(); break;
    case '+': case '=': if(typeof zoomIn==='function') zoomIn(); break;
    case '-':           if(typeof zoomOut==='function') zoomOut(); break;
    case '0':           if(typeof zoomFit==='function') zoomFit(); break;
  }
}, true);
