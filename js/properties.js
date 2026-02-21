/* ══════════════════════════════════════
   PROPERTIES.JS
══════════════════════════════════════ */
function buildPropPanel(eid) {
  var slide = getActive(); if (!slide) return;
  var el    = slide.elements[eid]; if (!el) return;
  var body  = document.getElementById('ppBody');
  var title = document.getElementById('ppTitle');
  if (!body) return;
  if (title) title.textContent = (el.label || el.type).toUpperCase();

  /* On mobile, open the prop panel automatically */
  if (window.innerWidth < 768) {
    var pp = document.getElementById('propPanel');
    var ov = document.getElementById('drawerOverlay');
    if (pp && !pp.classList.contains('open')) {
      pp.classList.add('open');
      if (ov) ov.classList.add('open');
      var btn = document.getElementById('mt-props');
      if (btn) btn.classList.add('active');
    }
  }

  body.innerHTML = '';

  /* ── Position & Size ── */
  _ppSection(body, '📐 Position & Size');
  _ppRow2(body, [
    { label:'X', id:'pp-x', type:'number', val: el.x||0 },
    { label:'Y', id:'pp-y', type:'number', val: el.y||0 }
  ]);
  _ppRow2(body, [
    { label:'W', id:'pp-w', type:'number', val: el.w||100 },
    { label:'H', id:'pp-h', type:'number', val: el.h||60  }
  ]);

  /* ── Label ── */
  _ppSection(body, '🏷 Label');
  _ppInput(body, 'Label', 'pp-label', 'text', el.label || el.type);

  /* ── Opacity ── */
  _ppSection(body, '👁 Visibility');
  _ppRange(body, 'Opacity', 'pp-gopac', el.globalOpacity != null ? el.globalOpacity : 1, 0, 1, 0.05);

  /* ── Type-specific props ── */
  if (el.type === 'text' || el.type === 'button' || el.type === 'stepnum') {
    _ppSection(body, '✏️ Text');
    _ppTextarea(body, 'pp-text', el.text || '');
    _ppRow2(body, [
      { label:'Size', id:'pp-fs',  type:'number', val: el.fs||16 },
      { label:'LH',  id:'pp-lh',  type:'number', val: el.lineHeight||1.15, step:0.05 }
    ]);
    _ppRow2(body, [
      { label:'Spacing', id:'pp-ls', type:'number', val: el.letterSpacing||0, step:0.5 },
      { label:'Color',   id:'pp-color', type:'color', val: el.color||'#ffffff' }
    ]);
    /* Font */
    _ppSection(body, '🔤 Font');
    _ppFontGrid(body, el.font || 'Poppins', eid);
    /* Style toggles */
    _ppCheckbox(body, 'pp-bold',   'Bold',      el.bold   || false);
    _ppCheckbox(body, 'pp-italic', 'Italic',    el.italic || false);
    _ppCheckbox(body, 'pp-under',  'Underline', el.underline || false);
    if (el.type === 'text') _ppCheckbox(body, 'pp-cl2', 'Line 2 Accent Color', el.colorLine2 || false);
    /* Alignment */
    _ppSection(body, '⬛ Alignment');
    _ppAlignGroup(body, el.align || 'left', eid);
    /* Shadow */
    _ppSection(body, '💧 Shadow');
    _ppRow2(body, [
      { label:'X',    id:'pp-shx', type:'number', val: el.shadowX||0 },
      { label:'Y',    id:'pp-shy', type:'number', val: el.shadowY||0 }
    ]);
    _ppRow2(body, [
      { label:'Blur', id:'pp-shb', type:'number', val: el.shadowBlur||0 },
      { label:'Color',id:'pp-shc', type:'color',  val: el.shadowColor||'#000000' }
    ]);
  }

  if (el.type === 'rect' || el.type === 'circle') {
    _ppSection(body, '🎨 Fill');
    _ppRow2(body, [
      { label:'Color', id:'pp-color', type:'color', val: el.color||AC },
      { label:'Opacity',id:'pp-opac', type:'number', val: el.opacity!=null?el.opacity:0.2, step:0.05 }
    ]);
    _ppSelect(body, 'Fill Type', 'pp-filltype',
      ['solid','gradient'], el.fillType||'solid');
    var c2row = _ppRow2(body, [
      { label:'Color 2', id:'pp-color2', type:'color', val: el.color2||AC },
      { label:'Direction', id:'pp-graddir', type:'select', val: el.gradDir||'to right',
        options:['to right','to left','to bottom','to top','to bottom right','to bottom left'] }
    ]);
    _ppRow2(body, [
      { label:'Radius', id:'pp-radius', type:'number', val: el.radius||0 },
      { label:'Stroke W', id:'pp-sw', type:'number', val: el.strokeWidth||0 }
    ]);
    _ppRow2(body, [
      { label:'Stroke C', id:'pp-sc', type:'color', val: el.strokeColor||'#ffffff' },
      { label:'', id:'_', type:'text', val:'' }
    ]);
  }

  if (el.type === 'line' || el.type === 'divider') {
    _ppSection(body, '🎨 Style');
    _ppRow2(body, [
      { label:'Color', id:'pp-color', type:'color', val: el.color||AC },
      { label:'Opacity', id:'pp-opac', type:'number', val: el.opacity!=null?el.opacity:1, step:0.05 }
    ]);
  }

  if (el.type === 'image') {
    _ppSection(body, '🖼 Image');
    _ppRow2(body, [
      { label:'Radius', id:'pp-radius', type:'number', val: el.radius||0 },
      { label:'Fit',    id:'pp-fit',    type:'select', val: el.objectFit||'cover',
        options:['cover','contain','fill','none'] }
    ]);
  }

  /* ── Align buttons ── */
  _ppSection(body, '📌 Align to Canvas');
  var alignRow = document.createElement('div');
  alignRow.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:6px;';
  [
    ['Left','left'],['Center H','cx'],['Right','right'],
    ['Top','top'],  ['Center V','cy'],['Bottom','bottom'],
    ['',''],        ['⊕ Both','center'],['']
  ].forEach(function(pair) {
    var b = document.createElement('button');
    b.type = 'button';
    if (!pair[0]) { b.style.visibility='hidden'; alignRow.appendChild(b); return; }
    b.style.cssText =
      'padding:8px 4px;background:#151515;border:1.5px solid #222;' +
      'border-radius:7px;color:#aaa;font-size:10px;font-weight:700;' +
      'font-family:Poppins,sans-serif;cursor:pointer;transition:all .15s;';
    b.textContent = pair[0];
    b.onclick = function() { alignEl(pair[1]); };
    b.onmouseenter = function() { b.style.borderColor='#7CFF7C66'; b.style.color='#7CFF7C'; };
    b.onmouseleave = function() { b.style.borderColor='#222'; b.style.color='#aaa'; };
    alignRow.appendChild(b);
  });
  body.appendChild(alignRow);

  /* ── Apply button ── */
  var applyBtn = document.createElement('button');
  applyBtn.type      = 'button';
  applyBtn.className = 'pp-apply-btn';
  applyBtn.textContent = '✅ Apply Changes';
  applyBtn.onclick = function() { _applyProps(eid); };
  body.appendChild(applyBtn);

  /* ── Delete button ── */
  var delBtn = document.createElement('button');
  delBtn.type      = 'button';
  delBtn.className = 'pp-del-btn';
  delBtn.textContent = '🗑 Delete Element';
  delBtn.onclick = function() {
    if (!confirm('Delete this element?')) return;
    var s = getActive(); if (!s) return;
    pushHistory();
    delete s.elements[eid];
    selEl=null; selElId=null;
    renderActiveSlide(); buildElTable(); clearPropPanel();
  };
  body.appendChild(delBtn);
}

function _applyProps(eid) {
  var slide = getActive(); if (!slide) return;
  var el    = slide.elements[eid]; if (!el) return;

  function gv(id) {
    var inp = document.getElementById(id);
    return inp ? inp.value : null;
  }
  function gn(id) { var v=gv(id); return v!==null && v!=='' ? parseFloat(v) : null; }
  function gc(id) { var inp=document.getElementById(id); return inp&&inp.type==='checkbox'?inp.checked:null; }

  var x=gn('pp-x'), y=gn('pp-y'), w=gn('pp-w'), h=gn('pp-h');
  if (x!==null) el.x=x;
  if (y!==null) el.y=y;
  if (w!==null) el.w=w;
  if (h!==null) el.h=h;

  var lbl=gv('pp-label'); if (lbl!==null&&lbl!=='') el.label=lbl;

  var opac=gn('pp-gopac'); if (opac!==null) el.globalOpacity=opac;

  if (el.type==='text'||el.type==='button'||el.type==='stepnum') {
    var txt=gv('pp-text'); if (txt!==null) el.text=txt;
    var fs=gn('pp-fs');    if (fs!==null)  el.fs=fs;
    var lh=gn('pp-lh');    if (lh!==null)  el.lineHeight=lh;
    var ls=gn('pp-ls');    if (ls!==null)  el.letterSpacing=ls;
    var col=gv('pp-color');if (col)        el.color=col;
    var bl=gc('pp-bold');  if (bl!==null)  el.bold=bl;
    var it=gc('pp-italic');if (it!==null)  el.italic=it;
    var un=gc('pp-under'); if (un!==null)  el.underline=un;
    var cl2=gc('pp-cl2');  if (cl2!==null) el.colorLine2=cl2;
    var shx=gn('pp-shx');  if (shx!==null) el.shadowX=shx;
    var shy=gn('pp-shy');  if (shy!==null) el.shadowY=shy;
    var shb=gn('pp-shb');  if (shb!==null) el.shadowBlur=shb;
    var shc=gv('pp-shc');  if (shc)        el.shadowColor=shc;
  }

  if (el.type==='rect'||el.type==='circle') {
    var c=gv('pp-color');    if(c)         el.color=c;
    var op=gn('pp-opac');    if(op!==null) el.opacity=op;
    var ft=gv('pp-filltype');if(ft)        el.fillType=ft;
    var c2=gv('pp-color2');  if(c2)        el.color2=c2;
    var gd=gv('pp-graddir'); if(gd)        el.gradDir=gd;
    var rr=gn('pp-radius');  if(rr!==null) el.radius=rr;
    var sw2=gn('pp-sw');     if(sw2!==null)el.strokeWidth=sw2;
    var sc2=gv('pp-sc');     if(sc2)       el.strokeColor=sc2;
  }
  if (el.type==='line'||el.type==='divider') {
    var lc=gv('pp-color');  if(lc)         el.color=lc;
    var lo=gn('pp-opac');   if(lo!==null)  el.opacity=lo;
  }
  if (el.type==='image') {
    var ir=gn('pp-radius'); if(ir!==null)  el.radius=ir;
    var ifit=gv('pp-fit');  if(ifit)       el.objectFit=ifit;
  }

  pushHistory();
  renderActiveSlide();
  buildElTable();
  setTimeout(function() {
    var dom=document.querySelector('[data-eid="'+eid+'"]');
    if(dom) selectDomEl(dom,eid);
  },30);
  showToast('✅ Applied');
}

function clearPropPanel() {
  var body  = document.getElementById('ppBody');
  var title = document.getElementById('ppTitle');
  if (body)  body.innerHTML  = '<div class="pp-empty">Tap any element<br>to edit its properties</div>';
  if (title) title.textContent = 'PROPERTIES';
}

/* ── Builder helpers ── */
function _ppSection(p, txt) {
  var d=document.createElement('div'); d.className='pp-section'; d.textContent=txt; p.appendChild(d);
}
function _ppRow2(p, fields) {
  var row=document.createElement('div'); row.className='pp-row-2';
  fields.forEach(function(f) {
    var wrap=document.createElement('div');
    var lbl=document.createElement('label'); lbl.textContent=f.label; wrap.appendChild(lbl);
    var inp;
    if (f.type==='select') {
      inp=document.createElement('select'); inp.id=f.id;
      (f.options||[]).forEach(function(o){ var opt=document.createElement('option'); opt.value=o; opt.textContent=o; if(o===f.val) opt.selected=true; inp.appendChild(opt); });
    } else {
      inp=document.createElement('input');
      inp.type=f.type||'text'; inp.id=f.id; inp.value=f.val||'';
      if (f.step) inp.step=f.step;
      if (f.type==='number') inp.style.cssText='padding:7px 8px;';
    }
    wrap.appendChild(inp); row.appendChild(wrap);
  });
  p.appendChild(row);
  return row;
}
function _ppInput(p, lbl, id, type, val) {
  var l=document.createElement('label'); l.textContent=lbl; p.appendChild(l);
  var inp=document.createElement('input'); inp.type=type; inp.id=id; inp.value=val||'';
  p.appendChild(inp);
}
function _ppTextarea(p, id, val) {
  var ta=document.createElement('textarea'); ta.id=id; ta.value=val||'';
  ta.style.cssText='font-size:12px;line-height:1.6;min-height:80px;';
  p.appendChild(ta);
}
function _ppRange(p, lbl, id, val, min, max, step) {
  var l=document.createElement('label');
  l.textContent=lbl+' — '; var sp=document.createElement('span'); sp.id=id+'_v'; sp.textContent=val; l.appendChild(sp);
  p.appendChild(l);
  var inp=document.createElement('input'); inp.type='range'; inp.id=id;
  inp.min=min; inp.max=max; inp.step=step||0.05; inp.value=val;
  inp.oninput=function(){ document.getElementById(id+'_v').textContent=parseFloat(this.value).toFixed(2); };
  p.appendChild(inp);
}
function _ppCheckbox(p, id, lbl, checked) {
  var row=document.createElement('label'); row.className='pp-checkbox-row';
  var inp=document.createElement('input'); inp.type='checkbox'; inp.id=id; inp.checked=!!checked;
  var sp=document.createElement('span'); sp.textContent=lbl;
  row.appendChild(inp); row.appendChild(sp); p.appendChild(row);
}
function _ppSelect(p, lbl, id, options, val) {
  var l=document.createElement('label'); l.textContent=lbl; p.appendChild(l);
  var sel=document.createElement('select'); sel.id=id;
  options.forEach(function(o){ var opt=document.createElement('option'); opt.value=o; opt.textContent=o; if(o===val) opt.selected=true; sel.appendChild(opt); });
  p.appendChild(sel);
}
function _ppFontGrid(p, currentFont, eid) {
  var g=document.createElement('div'); g.className='pp-font-grid';
  FONTS.forEach(function(f) {
    var btn=document.createElement('button'); btn.type='button'; btn.className='pp-font-btn'+(f===currentFont?' active':'');
    btn.style.fontFamily="'"+f+"',sans-serif"; btn.textContent=f;
    btn.onclick=function() {
      var s=getActive(); if(!s) return;
      var el=s.elements[eid]; if(!el) return;
      el.font=f; pushHistory(); renderActiveSlide();
      g.querySelectorAll('.pp-font-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      setTimeout(function(){ var d=document.querySelector('[data-eid="'+eid+'"]'); if(d) selectDomEl(d,eid); },30);
    };
    g.appendChild(btn);
  });
  p.appendChild(g);
}
function _ppAlignGroup(p, current, eid) {
  var g=document.createElement('div'); g.className='pp-align-group';
  [['left','⬅'],['center','⬛'],['right','➡']].forEach(function(pair) {
    var btn=document.createElement('button'); btn.type='button';
    btn.className='pp-align-btn'+(pair[0]===current?' active':'');
    btn.textContent=pair[1];
    btn.onclick=function() {
      var s=getActive(); if(!s) return;
      var el=s.elements[eid]; if(!el) return;
      el.align=pair[0]; pushHistory(); renderActiveSlide();
      g.querySelectorAll('.pp-align-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    };
    g.appendChild(btn);
  });
  p.appendChild(g);
}

function setMode(m) {
  mode=m;
  ['edit','drag'].forEach(function(t) {
    var b=document.getElementById('m-'+t); if(b) b.classList.toggle('active',t===m);
  });
  document.querySelectorAll('.drel').forEach(function(d){ d.classList.toggle('drag-mode',m==='drag'); });
  showToast(m==='drag'?'🖱 Move mode':'✏️ Edit mode');
}
