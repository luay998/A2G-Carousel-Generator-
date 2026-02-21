var _ctxMenu = null;

function showContextMenu(e, eid) {
  e.preventDefault(); e.stopPropagation();
  removeContextMenu();
  var slide = getActive(); if (!slide) return;
  var el = slide.elements[eid]; if (!el) return;
  var menu = document.createElement('div');
  menu.id = 'ctxMenu';
  menu.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;background:#111;border:1px solid #222;border-radius:8px;z-index:9000;min-width:175px;padding:4px 0;box-shadow:0 8px 30px rgba(0,0,0,.8);font-family:Poppins,sans-serif;';
  var items = [
    {icon:'⚙', label:'Properties',    fn:function(){ selectDomEl(document.querySelector('[data-eid="'+eid+'"]'),eid); buildPropPanel(eid); }},
    {icon:'⧉', label:'Duplicate',     fn:function(){ duplicateEl(eid); }},
    {sep:true},
    {icon:'⬆', label:'Bring Forward', fn:function(){ bringForward(eid); }},
    {icon:'⬇', label:'Send Backward', fn:function(){ sendBackward(eid); }},
    {icon:'⏫', label:'Bring to Front',fn:function(){ bringToFront(eid); }},
    {icon:'⏬', label:'Send to Back',  fn:function(){ sendToBack(eid); }},
    {sep:true},
    {icon:el.locked?'🔓':'🔒', label:el.locked?'Unlock':'Lock', fn:function(){ el.locked=!el.locked; pushHistory(); renderActiveSlide(); buildElTable(); }},
    {icon:'👁',  label:el.hidden?'Show':'Hide', fn:function(){ el.hidden=!el.hidden; pushHistory(); renderActiveSlide(); buildElTable(); }},
    {sep:true},
    {icon:'✕', label:'Delete', danger:true, fn:function(){
      if(!confirm('Delete "'+( el.label||el.type)+'"?')) return;
      pushHistory(); delete slide.elements[eid];
      selEl=null; selElId=null;
      renderActiveSlide(); buildElTable(); clearPropPanel();
    }}
  ];
  items.forEach(function(item){
    if (item.sep){ var hr=document.createElement('div'); hr.style.cssText='height:1px;background:#1a1a1a;margin:3px 0;'; menu.appendChild(hr); return; }
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:9px;padding:7px 12px;font-size:11px;color:'+(item.danger?'#ff7070':'#aaa')+';cursor:pointer;';
    row.innerHTML='<span style="width:15px;text-align:center;font-size:13px">'+item.icon+'</span><span>'+item.label+'</span>';
    row.onmouseenter=function(){ row.style.background=item.danger?'rgba(255,80,80,.08)':'#1a1a1a'; };
    row.onmouseleave=function(){ row.style.background=''; };
    row.onclick=function(){ item.fn(); removeContextMenu(); };
    menu.appendChild(row);
  });
  document.body.appendChild(menu);
  _ctxMenu = menu;
  requestAnimationFrame(function(){
    var r=menu.getBoundingClientRect();
    if(r.right>window.innerWidth)  menu.style.left=(window.innerWidth -r.width -8)+'px';
    if(r.bottom>window.innerHeight) menu.style.top=(window.innerHeight-r.height-8)+'px';
  });
}

function removeContextMenu() {
  if (_ctxMenu) { _ctxMenu.remove(); _ctxMenu=null; }
}

function duplicateEl(eid) {
  var slide=getActive(); if(!slide) return;
  var orig=slide.elements[eid]; if(!orig) return;
  pushHistory();
  var nid=newElId();
  slide.elements[nid]=JSON.parse(JSON.stringify(orig));
  slide.elements[nid].id=nid;
  slide.elements[nid].x=(orig.x||0)+20;
  slide.elements[nid].y=(orig.y||0)+20;
  slide.elements[nid].label=(orig.label||orig.type)+' copy';
  renderActiveSlide(); buildElTable();
  showToast('⧉ Duplicated');
}

document.addEventListener('mousedown', function(e){
  if (_ctxMenu && !_ctxMenu.contains(e.target)) removeContextMenu();
});
document.addEventListener('keydown', function(e){
  if (e.key==='Escape') removeContextMenu();
});
