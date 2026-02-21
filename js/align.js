function alignEl(direction) {
  if (!selElId) return;
  var slide=getActive(); if(!slide) return;
  var el=slide.elements[selElId]; if(!el) return;
  var w=el.w||100, h=el.h||60;
  pushHistory();
  switch(direction) {
    case 'left':   el.x=0; break;
    case 'right':  el.x=CANVAS_SIZE-w; break;
    case 'cx':     el.x=(CANVAS_SIZE-w)/2; break;
    case 'top':    el.y=0; break;
    case 'bottom': el.y=CANVAS_SIZE-h; break;
    case 'cy':     el.y=(CANVAS_SIZE-h)/2; break;
    case 'center': el.x=(CANVAS_SIZE-w)/2; el.y=(CANVAS_SIZE-h)/2; break;
  }
  renderActiveSlide();
  setTimeout(function() {
    var dom=document.querySelector('[data-eid="'+selElId+'"]');
    if(dom) selectDomEl(dom,selElId);
  },30);
}
