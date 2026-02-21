function alignEl(dir) {
  var slide = getActive(); if (!slide) return;
  var ids = getSelectedIds(); if (!ids.length) return;
  pushHistory();
  ids.forEach(function(eid) {
    var el = slide.elements[eid]; if (!el) return;
    var w=el.w||0, h=el.h||0;
    if (dir==='left')     el.x=0;
    if (dir==='center-h') el.x=(CANVAS_SIZE-w)/2;
    if (dir==='right')    el.x=CANVAS_SIZE-w;
    if (dir==='top')      el.y=0;
    if (dir==='middle-v') el.y=(CANVAS_SIZE-h)/2;
    if (dir==='bottom')   el.y=CANVAS_SIZE-h;
  });
  renderActiveSlide();
}

function distributeEls(axis) {
  var slide = getActive(); if (!slide) return;
  var ids = getSelectedIds(); if (ids.length < 3) { showToast('Select 3+ elements to distribute'); return; }
  pushHistory();
  var els = ids.map(function(id){ return slide.elements[id]; }).filter(Boolean);
  if (axis==='h') {
    els.sort(function(a,b){ return a.x-b.x; });
    var first=els[0].x, last=els[els.length-1].x+(els[els.length-1].w||0);
    var tw=els.reduce(function(s,e){ return s+(e.w||0); },0);
    var gap=(last-first-tw)/(els.length-1); var cx=first;
    els.forEach(function(e){ e.x=Math.round(cx); cx+=(e.w||0)+gap; });
  } else {
    els.sort(function(a,b){ return a.y-b.y; });
    var first2=els[0].y, last2=els[els.length-1].y+(els[els.length-1].h||0);
    var th=els.reduce(function(s,e){ return s+(e.h||0); },0);
    var gap2=(last2-first2-th)/(els.length-1); var cy=first2;
    els.forEach(function(e){ e.y=Math.round(cy); cy+=(e.h||0)+gap2; });
  }
  renderActiveSlide();
}

function bringForward(eid) { _reorder(eid, 1); }
function sendBackward(eid) { _reorder(eid,-1); }

function _reorder(eid, dir) {
  var slide = getActive(); if (!slide) return;
  var keys = Object.keys(slide.elements);
  var idx  = keys.indexOf(eid); if (idx<0) return;
  var ni   = idx + dir;
  if (ni<0 || ni>=keys.length) return;
  pushHistory();
  var tmp=keys[idx]; keys[idx]=keys[ni]; keys[ni]=tmp;
  var r={}; keys.forEach(function(k){ r[k]=slide.elements[k]; });
  slide.elements=r; renderActiveSlide();
}

function bringToFront(eid) {
  var slide=getActive(); if(!slide) return;
  pushHistory();
  var el=slide.elements[eid]; delete slide.elements[eid]; slide.elements[eid]=el;
  renderActiveSlide();
}

function sendToBack(eid) {
  var slide=getActive(); if(!slide) return;
  pushHistory();
  var el=slide.elements[eid]; delete slide.elements[eid];
  var r={}; r[eid]=el; Object.assign(r,slide.elements); slide.elements=r;
  renderActiveSlide();
}
