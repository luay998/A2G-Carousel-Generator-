var zoomLevel=1.0, panX=0, panY=0;
var _panning=false, _panStart=null, _spaceHeld=false;
var ZOOM_STEPS=[0.25,0.33,0.5,0.67,0.75,1,1.25,1.5,2,2.5,3,4];

function applyZoom() {
  var w=document.getElementById('canvasWrap'); if(!w) return;
  w.style.transform='translate('+panX+'px,'+panY+'px) scale('+zoomLevel+')';
  w.style.transformOrigin='center center';
  var d=document.getElementById('zoomDisplay'); if(d) d.textContent=Math.round(zoomLevel*100)+'%';
}

function zoomIn()  { _stepZoom(1); }
function zoomOut() { _stepZoom(-1); }
function zoomFit() { zoomLevel=1; panX=0; panY=0; applyZoom(); }

function _stepZoom(dir) {
  var cur=ZOOM_STEPS.findIndex(function(z){ return z>=zoomLevel-0.001; });
  if(cur<0) cur=ZOOM_STEPS.length-1;
  var next=Math.max(0,Math.min(ZOOM_STEPS.length-1,cur+dir));
  zoomLevel=ZOOM_STEPS[next]; applyZoom();
}

document.addEventListener('wheel',function(e){
  var a=document.getElementById('canvasArea');
  if(!a||!a.contains(e.target)) return;
  if(e.ctrlKey||e.metaKey){ e.preventDefault(); _stepZoom(e.deltaY>0?-1:1); }
},{passive:false});

document.addEventListener('keydown',function(e){
  if(e.code==='Space'&&!isTyping()){ _spaceHeld=true; var a=document.getElementById('canvasArea'); if(a) a.style.cursor='grab'; e.preventDefault(); }
});
document.addEventListener('keyup',function(e){
  if(e.code==='Space'){ _spaceHeld=false; var a=document.getElementById('canvasArea'); if(a) a.style.cursor=''; }
});
document.addEventListener('mousedown',function(e){
  if(e.button===1||(e.button===0&&_spaceHeld)){
    var a=document.getElementById('canvasArea');
    if(!a||!a.contains(e.target)) return;
    _panning=true; _panStart={x:e.clientX-panX,y:e.clientY-panY};
    a.style.cursor='grabbing'; e.preventDefault();
  }
});
document.addEventListener('mousemove',function(e){
  if(!_panning||!_panStart) return;
  panX=e.clientX-_panStart.x; panY=e.clientY-_panStart.y; applyZoom();
});
document.addEventListener('mouseup',function(){
  if(_panning){ _panning=false; _panStart=null; var a=document.getElementById('canvasArea'); if(a) a.style.cursor=_spaceHeld?'grab':''; }
});
