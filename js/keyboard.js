var _copyBuffer=null;

document.addEventListener('keydown',function(e){
  var tag=document.activeElement?document.activeElement.tagName:'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
  var ctrl=e.ctrlKey||e.metaKey;
  if(!ctrl){
    if(e.key==='e'||e.key==='E'){setMode('edit');return;}
    if(e.key==='m'||e.key==='M'){setMode('drag');return;}
    if(e.key==='g'||e.key==='G'){toggleGrid();return;}
    if(e.key==='n'||e.key==='N'){toggleSnap();return;}
    if(e.key==='0'){zoomFit();return;}
    if(e.key==='+'||e.key==='='){zoomIn();return;}
    if(e.key==='-'){zoomOut();return;}
  }
  if(ctrl){
    if(e.key==='z'||e.key==='Z'){e.preventDefault();undo();return;}
    if(e.key==='y'||e.key==='Y'){e.preventDefault();redo();return;}
    if(e.key==='s'||e.key==='S'){e.preventDefault();saveProject();return;}
    if(e.key==='c'||e.key==='C'){e.preventDefault();_copyEl();return;}
    if(e.key==='v'||e.key==='V'){e.preventDefault();_pasteEl();return;}
    if(e.key==='d'||e.key==='D'){e.preventDefault();if(selElId)duplicateEl(selElId);return;}
  }
  if((e.key==='Delete'||e.key==='Backspace')&&selElId){
    e.preventDefault();
    var slide=getActive();if(!slide)return;
    if(!slide.elements[selElId])return;
    pushHistory();delete slide.elements[selElId];
    selEl=null;selElId=null;renderActiveSlide();buildElTable();
    if(typeof clearPropPanel==='function')clearPropPanel();
    return;
  }
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)>-1&&selElId){
    e.preventDefault();
    var sl2=getActive();if(!sl2)return;
    var el=sl2.elements[selElId];if(!el)return;
    var step=e.shiftKey?10:1;
    if(e.key==='ArrowLeft') el.x-=step;
    if(e.key==='ArrowRight')el.x+=step;
    if(e.key==='ArrowUp')   el.y-=step;
    if(e.key==='ArrowDown') el.y+=step;
    pushHistory();renderActiveSlide();
    setTimeout(function(){
      var dom=document.querySelector('[data-eid="'+selElId+'"]');
      if(dom)selectDomEl(dom,selElId);
    },20);
  }
});

function _copyEl(){
  if(!selElId)return;
  var slide=getActive();if(!slide)return;
  var el=slide.elements[selElId];if(!el)return;
  _copyBuffer=JSON.parse(JSON.stringify(el));
  showToast('📋 Copied');
}
function _pasteEl(){
  if(!_copyBuffer)return;
  var slide=getActive();if(!slide)return;
  pushHistory();
  var copy=JSON.parse(JSON.stringify(_copyBuffer));
  copy.id=newElId();copy.x=(copy.x||0)+20;copy.y=(copy.y||0)+20;
  slide.elements[copy.id]=copy;
  renderActiveSlide();buildElTable();
  setTimeout(function(){
    var dom=document.querySelector('[data-eid="'+copy.id+'"]');
    if(dom)selectDomEl(dom,copy.id);
  },50);
  showToast('📋 Pasted');
}
