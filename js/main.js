(function init(){
  buildBgGrid();
  buildElPalette();
  _initSwatches();
  _initContextMenu();
  _initCanvasClick();

  var logoInp=document.getElementById('logoFileInput');
  if(logoInp) logoInp.onchange=uploadLogo;
  var bgInp=document.getElementById('bgFileInput');
  if(bgInp)   bgInp.onchange=uploadBg;

  addSlide('intro');
  addSlide('step');
  addSlide('cta');
  activeSlideIdx=0;
  pushHistory();
  updateHistoryUI();

  var snapBtn=document.getElementById('m-snap');
  if(snapBtn) snapBtn.classList.add('active');

  setTimeout(zoomFit,100);

  window.addEventListener('resize',function(){
    zoomFit();
    if(window.innerWidth>=768) _resetMobileState();
  });
  window.addEventListener('orientationchange',function(){ setTimeout(zoomFit,300); });

  console.log('%cA2G v2.3 ✅','color:#7CFF7C;font-weight:bold;font-size:14px;');
})();

function _resetMobileState(){
  var lp=document.getElementById('leftPanel');
  var pp=document.getElementById('propPanel');
  var ov=document.getElementById('drawerOverlay');
  if(lp) lp.classList.remove('open');
  if(pp) pp.classList.remove('open');
  if(ov) ov.classList.remove('open');
  window._currentMobileTab=null;
}

/* ── Toast ── */
function showToast(msg){
  var t=document.getElementById('a2g-toast');
  if(!t){t=document.createElement('div');t.id='a2g-toast';document.body.appendChild(t);}
  t.textContent=msg;
  t.style.opacity='1';
  t.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer=setTimeout(function(){
    t.style.opacity='0';
    t.style.transform='translateX(-50%) translateY(12px)';
  },2200);
}

/* ── Brand swatches ── */
var _swatches=[];
function _initSwatches(){
  try{_swatches=JSON.parse(localStorage.getItem('a2g-sw')||'null')||['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff'];}
  catch(e){_swatches=['#7CFF7C','#FF6B6B','#FFD93D','#4D96FF','#ffffff'];}
  _renderSwatches();
}
function _renderSwatches(){
  var c=document.getElementById('brandSwatches');if(!c)return;
  c.innerHTML='';
  _swatches.forEach(function(color,i){
    var sw=document.createElement('div');
    sw.title=color;
    sw.style.cssText='width:30px;height:30px;border-radius:7px;background:'+color+';cursor:pointer;border:2px solid rgba(255,255,255,.1);flex-shrink:0;transition:transform .15s;';
    sw.onmouseenter=function(){sw.style.transform='scale(1.15)';};
    sw.onmouseleave=function(){sw.style.transform='scale(1)';};
    sw.onclick=function(){
      var ac=document.getElementById('c-ac');   if(ac)  ac.value=color;
      var acH=document.getElementById('c-acH'); if(acH) acH.value=color;
      updateColors(); showToast('🎨 Accent → '+color);
    };
    sw.oncontextmenu=function(e){
      e.preventDefault();_swatches.splice(i,1);_saveSwatches();_renderSwatches();showToast('🗑 Removed');
    };
    c.appendChild(sw);
  });
}
function addSwatch(){
  var inp=document.getElementById('newSwatchColor');if(!inp)return;
  var color=inp.value;
  if(_swatches.indexOf(color)>-1){showToast('Already in palette');return;}
  _swatches.push(color);_saveSwatches();_renderSwatches();showToast('🎨 Added '+color);
}
function _saveSwatches(){
  try{localStorage.setItem('a2g-sw',JSON.stringify(_swatches));}catch(e){}
}

/* ── Mobile drawers ── */
function mobileOpenDrawer(tab){
  var lp=document.getElementById('leftPanel');
  var ov=document.getElementById('drawerOverlay');
  if(!lp)return;
  setLpTab(tab);
  if(window.innerWidth>=768) return;
  var isOpen=lp.classList.contains('open');
  var isSame=window._currentMobileTab===tab;
  if(isOpen&&isSame){
    lp.classList.remove('open');
    ov.classList.remove('open');
    window._currentMobileTab=null;
    _clearMobileBtns(); return;
  }
  var pp=document.getElementById('propPanel');
  if(pp){pp.classList.remove('open');var mpb=document.getElementById('mt-props');if(mpb)mpb.classList.remove('active');}
  lp.classList.add('open');
  ov.classList.add('open');
  window._currentMobileTab=tab;
  _clearMobileBtns();
  var btn=document.getElementById('mt-'+tab);if(btn)btn.classList.add('active');
}
function closeMobileDrawers(){
  var lp=document.getElementById('leftPanel');
  var pp=document.getElementById('propPanel');
  var ov=document.getElementById('drawerOverlay');
  if(lp)lp.classList.remove('open');
  if(pp)pp.classList.remove('open');
  if(ov)ov.classList.remove('open');
  window._currentMobileTab=null;
  _clearMobileBtns();
}
function mobileToggleProps(){
  var pp=document.getElementById('propPanel');
  var ov=document.getElementById('drawerOverlay');
  var btn=document.getElementById('mt-props');
  if(!pp)return;
  if(pp.classList.contains('open')){
    pp.classList.remove('open');
    var lp=document.getElementById('leftPanel');
    if(!lp||!lp.classList.contains('open')) if(ov)ov.classList.remove('open');
    if(btn)btn.classList.remove('active');
  }else{
    if(!selElId){showToast('Tap an element first');return;}
    var lp2=document.getElementById('leftPanel');
    if(lp2){lp2.classList.remove('open');window._currentMobileTab=null;_clearMobileBtns();}
    buildPropPanel(selElId);
    pp.classList.add('open');
    if(ov)ov.classList.add('open');
    if(btn)btn.classList.add('active');
  }
}
function closePropPanel(){
  if(window.innerWidth<768){
    var pp=document.getElementById('propPanel');
    var ov=document.getElementById('drawerOverlay');
    var btn=document.getElementById('mt-props');
    var lp=document.getElementById('leftPanel');
    if(pp)pp.classList.remove('open');
    if(!lp||!lp.classList.contains('open'))if(ov)ov.classList.remove('open');
    if(btn)btn.classList.remove('active');
  }else{
    toggleProps();
  }
}
function _clearMobileBtns(){
  ['slides','elements','settings','props'].forEach(function(t){
    var b=document.getElementById('mt-'+t);if(b)b.classList.remove('active');
  });
}
function togglePanels(){
  var lp=document.getElementById('leftPanel');
  var btn=document.getElementById('btn-panels');
  if(!lp)return;
  var hidden=lp.style.display==='none';
  lp.style.display=hidden?'flex':'none';
  if(btn)btn.classList.toggle('active',hidden);
  zoomFit();
}
function toggleProps(){
  var pp=document.getElementById('propPanel');
  var btn=document.getElementById('btn-props');
  if(!pp)return;
  var hidden=pp.style.display==='none';
  pp.style.display=hidden?'flex':'none';
  if(btn)btn.classList.toggle('active',hidden);
  zoomFit();
}
