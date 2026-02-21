var _dragging=false,_resizing=false;
var _dragEl=null,_dragElId=null;
var _dragStartX=0,_dragStartY=0,_elStartX=0,_elStartY=0;
var _resizeDir='',_resizeEl=null,_resizeElId=null;
var _resStartX=0,_resStartY=0,_resElX=0,_resElY=0,_resElW=0,_resElH=0;
var _touchMoved=false,_touchTimer=null,_LONG_PRESS_MS=550;

function _attachMoveEvents(el,eid){
  el.addEventListener('mousedown', function(e){ _onMouseDown(e,el,eid); });
  el.addEventListener('touchstart',function(e){ _onTouchStart(e,el,eid); },{passive:false});
  el.addEventListener('touchmove', function(e){
    _touchMoved=true; clearTimeout(_touchTimer);
    if(_dragging||_resizing){ e.preventDefault(); }
  },{passive:false});
  el.addEventListener('touchend',  function(e){ _onTouchEnd(e,el,eid); });
}

function _onMouseDown(e,el,eid){
  if(e.target.closest('.etb-btn')||e.target.closest('.rh')) return;
  e.preventDefault();
  selectDomEl(el,eid);
  if(mode!=='edit'&&mode!=='drag') return;
  _startDrag({x:e.clientX,y:e.clientY},el,eid);
}

function _onTouchStart(e,el,eid){
  if(e.target.closest('.etb-btn')||e.target.closest('.rh')) return;
  _touchMoved=false;
  var t=e.touches[0];

  /* Long press → open properties */
  clearTimeout(_touchTimer);
  _touchTimer=setTimeout(function(){
    if(!_touchMoved){
      selectDomEl(el,eid);
      if(typeof buildPropPanel==='function'){
        _openPropsMobile();
        buildPropPanel(eid);
        showToast('⚙️ Long-press: Properties');
      }
    }
  },_LONG_PRESS_MS);

  /* Always select on tap */
  selectDomEl(el,eid);

  /* Only drag in move mode */
  if(mode==='drag'){
    e.preventDefault();
    _startDrag({x:t.clientX,y:t.clientY},el,eid);
  }
}

function _onTouchEnd(e,el,eid){
  clearTimeout(_touchTimer);
  if(_dragging||_resizing) _endInteraction();
}

function _startDrag(pos,el,eid){
  _dragging=true; _dragEl=el; _dragElId=eid;
  _dragStartX=pos.x; _dragStartY=pos.y;
  _elStartX=parseInt(el.style.left)||0;
  _elStartY=parseInt(el.style.top)||0;
  _addDocListeners();
}

function _startResize(e,wrap,eid,dir){
  e.preventDefault(); e.stopPropagation();
  clearTimeout(_touchTimer);
  var pos=e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};
  _resizing=true; _resizeEl=wrap; _resizeElId=eid; _resizeDir=dir;
  _resStartX=pos.x; _resStartY=pos.y;
  _resElX=parseInt(wrap.style.left)||0;
  _resElY=parseInt(wrap.style.top)||0;
  _resElW=parseInt(wrap.style.width)||100;
  _resElH=parseInt(wrap.style.height)||60;
  selectDomEl(wrap,eid);
  _addDocListeners();
}

function _doMove(pos){
  if(_dragging&&_dragEl){
    var sc=_getCanvasScale();
    var nx=_elStartX+(pos.x-_dragStartX)/sc;
    var ny=_elStartY+(pos.y-_dragStartY)/sc;
    if(snapEnabled){nx=_snap(nx);ny=_snap(ny);}
    nx=Math.max(0,Math.min(nx,CANVAS_SIZE-10));
    ny=Math.max(0,Math.min(ny,CANVAS_SIZE-10));
    _dragEl.style.left=nx+'px'; _dragEl.style.top=ny+'px';
    _updateStatus('x:'+Math.round(nx)+' y:'+Math.round(ny));
  }
  if(_resizing&&_resizeEl){
    var sc2=_getCanvasScale();
    var rdx=(pos.x-_resStartX)/sc2,rdy=(pos.y-_resStartY)/sc2;
    var nx2=_resElX,ny2=_resElY,nw=_resElW,nh=_resElH,MIN=20;
    switch(_resizeDir){
      case 'br': nw=Math.max(MIN,_resElW+rdx);nh=Math.max(MIN,_resElH+rdy);break;
      case 'bl': nx2=_resElX+rdx;nw=Math.max(MIN,_resElW-rdx);nh=Math.max(MIN,_resElH+rdy);break;
      case 'tr': nw=Math.max(MIN,_resElW+rdx);ny2=_resElY+rdy;nh=Math.max(MIN,_resElH-rdy);break;
      case 'tl': nx2=_resElX+rdx;ny2=_resElY+rdy;nw=Math.max(MIN,_resElW-rdx);nh=Math.max(MIN,_resElH-rdy);break;
      case 'mr': nw=Math.max(MIN,_resElW+rdx);break;
      case 'ml': nx2=_resElX+rdx;nw=Math.max(MIN,_resElW-rdx);break;
      case 'bm': nh=Math.max(MIN,_resElH+rdy);break;
      case 'tm': ny2=_resElY+rdy;nh=Math.max(MIN,_resElH-rdy);break;
    }
    if(snapEnabled){nw=_snap(nw);nh=_snap(nh);nx2=_snap(nx2);ny2=_snap(ny2);}
    _resizeEl.style.left=nx2+'px';_resizeEl.style.top=ny2+'px';
    _resizeEl.style.width=nw+'px';_resizeEl.style.height=nh+'px';
    _updateStatus('w:'+Math.round(nw)+' h:'+Math.round(nh));
  }
}

function _endInteraction(){
  if(_dragging&&_dragEl&&_dragElId){
    var sl=getActive();
    if(sl&&sl.elements[_dragElId]){
      sl.elements[_dragElId].x=parseInt(_dragEl.style.left)||0;
      sl.elements[_dragElId].y=parseInt(_dragEl.style.top)||0;
      pushHistory();
    }
  }
  if(_resizing&&_resizeEl&&_resizeElId){
    var sl2=getActive();
    if(sl2&&sl2.elements[_resizeElId]){
      var e2=sl2.elements[_resizeElId];
      e2.x=parseInt(_resizeEl.style.left)||0;
      e2.y=parseInt(_resizeEl.style.top)||0;
      e2.w=parseInt(_resizeEl.style.width)||e2.w;
      e2.h=parseInt(_resizeEl.style.height)||e2.h;
      pushHistory(); buildElTable();
    }
  }
  _dragging=false;_resizing=false;
  _dragEl=null;_dragElId=null;_resizeEl=null;_resizeElId=null;
  _removeDocListeners();_updateStatus('');
}

function _docMouseMove(e){_doMove({x:e.clientX,y:e.clientY});}
function _docTouchMove(e){
  _touchMoved=true;clearTimeout(_touchTimer);
  if(!_dragging&&!_resizing)return;
  e.preventDefault();
  _doMove({x:e.touches[0].clientX,y:e.touches[0].clientY});
}
function _addDocListeners(){
  document.addEventListener('mousemove',  _docMouseMove,{passive:false});
  document.addEventListener('mouseup',    _endInteraction);
  document.addEventListener('touchmove',  _docTouchMove,{passive:false});
  document.addEventListener('touchend',   _endInteraction);
  document.addEventListener('touchcancel',_endInteraction);
}
function _removeDocListeners(){
  document.removeEventListener('mousemove',  _docMouseMove);
  document.removeEventListener('mouseup',    _endInteraction);
  document.removeEventListener('touchmove',  _docTouchMove);
  document.removeEventListener('touchend',   _endInteraction);
  document.removeEventListener('touchcancel',_endInteraction);
}
function _getCanvasScale(){
  var w=document.getElementById('canvasWrap');if(!w)return 1;
  var m=w.style.transform.match(/scale\(([^)]+)\)/);
  return m?parseFloat(m[1]):1;
}
function selectDomEl(domEl,eid){
  if(selEl&&selEl!==domEl)selEl.classList.remove('selected');
  selEl=domEl;selElId=eid;
  if(domEl)domEl.classList.add('selected');
  if(window.innerWidth>=768&&eid&&typeof buildPropPanel==='function'){
    var pp=document.getElementById('propPanel');
    if(pp&&pp.style.display!=='none')buildPropPanel(eid);
  }
  _updateStatus('');
}
function _initCanvasClick(){
  var area=document.getElementById('canvasArea');if(!area)return;
  function _desel(e){
    if(!e.target.closest('.drel')){
      if(selEl)selEl.classList.remove('selected');
      selEl=null;selElId=null;
      if(typeof clearPropPanel==='function')clearPropPanel();
    }
  }
  area.addEventListener('mousedown',_desel);
  area.addEventListener('touchstart',function(e){
    if(!e.target.closest('.drel'))_desel(e);
  },{passive:true});
}
function duplicateEl(eid){
  var slide=getActive();if(!slide)return;
  var src=slide.elements[eid];if(!src)return;
  pushHistory();
  var copy=JSON.parse(JSON.stringify(src));
  copy.id=newElId();copy.x=(copy.x||0)+15;copy.y=(copy.y||0)+15;
  slide.elements[copy.id]=copy;
  renderActiveSlide();buildElTable();
  setTimeout(function(){
    var dom=document.querySelector('[data-eid="'+copy.id+'"]');
    if(dom)selectDomEl(dom,copy.id);
  },50);
  showToast('⧉ Duplicated');
}
function _updateStatus(msg){
  var sb=document.getElementById('statusBar');
  if(sb)sb.textContent=msg||'Ready';
}
