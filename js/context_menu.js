var _ctxEid=null;

function _initContextMenu(){
  document.addEventListener('contextmenu',function(e){
    var drel=e.target.closest('.drel');if(!drel)return;
    e.preventDefault();
    _ctxEid=drel.dataset.eid;
    selectDomEl(drel,_ctxEid);
    _showCtx(e.clientX,e.clientY);
  });
  var _lpt=null;
  document.addEventListener('touchstart',function(e){
    var drel=e.target.closest('.drel');if(!drel)return;
    var t=e.touches[0];
    _lpt=setTimeout(function(){
      _ctxEid=drel.dataset.eid;
      selectDomEl(drel,_ctxEid);
      _showCtx(t.clientX,t.clientY);
    },700);
  },{passive:true});
  document.addEventListener('touchend',  function(){clearTimeout(_lpt);});
  document.addEventListener('touchmove', function(){clearTimeout(_lpt);});
  document.addEventListener('click',_hideCtx);
}

function _showCtx(x,y){
  var menu=document.getElementById('ctxMenu');if(!menu)return;
  var slide=getActive();
  var el=slide&&_ctxEid?slide.elements[_ctxEid]:null;
  var locked=el&&el.locked,hidden=el&&el.hidden;
  menu.innerHTML=
    (el?'<div class="ctx-item" onclick="_ctxDo(\'prop\')">⚙️ Properties</div>':'')+
    (el?'<div class="ctx-item" onclick="_ctxDo(\'dup\')">⧉ Duplicate</div>':'')+
    (el?'<div class="ctx-item" onclick="_ctxDo(\'lock\')">'+(locked?'🔓 Unlock':'🔒 Lock')+'</div>':'')+
    (el?'<div class="ctx-item" onclick="_ctxDo(\'vis\')">'+(hidden?'👁 Show':'🙈 Hide')+'</div>':'')+
    '<div class="ctx-sep"></div>'+
    '<div class="ctx-item" onclick="_ctxDo(\'alCX\')">↔ Center H</div>'+
    '<div class="ctx-item" onclick="_ctxDo(\'alCY\')">↕ Center V</div>'+
    '<div class="ctx-item" onclick="_ctxDo(\'alC\')">⊕ Center Both</div>'+
    (el?'<div class="ctx-sep"></div><div class="ctx-item danger" onclick="_ctxDo(\'del\')">🗑 Delete</div>':'');
  var vw=window.innerWidth,vh=window.innerHeight;
  menu.style.cssText='display:block;left:'+Math.min(x,vw-210)+'px;top:'+Math.min(y,vh-300)+'px;position:fixed;';
}
function _hideCtx(){var m=document.getElementById('ctxMenu');if(m)m.style.display='none';}
function _ctxDo(action){
  _hideCtx();
  var slide=getActive();
  var el=slide&&_ctxEid?slide.elements[_ctxEid]:null;
  switch(action){
    case 'prop': if(typeof buildPropPanel==='function')buildPropPanel(_ctxEid); break;
    case 'dup':  duplicateEl(_ctxEid); break;
    case 'lock':
      if(el){pushHistory();el.locked=!el.locked;renderActiveSlide();buildElTable();} break;
    case 'vis':
      if(el){pushHistory();el.hidden=!el.hidden;renderActiveSlide();buildElTable();} break;
    case 'del':
      if(el&&confirm('Delete this element?')){
        pushHistory();delete slide.elements[_ctxEid];
        selEl=null;selElId=null;renderActiveSlide();buildElTable();
        if(typeof clearPropPanel==='function')clearPropPanel();
      } break;
    case 'alCX': alignEl('cx'); break;
    case 'alCY': alignEl('cy'); break;
    case 'alC':  alignEl('center'); break;
  }
}
