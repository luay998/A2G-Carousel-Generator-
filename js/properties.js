function clearPropPanel() {
  var b = document.getElementById('ppBody');
  var t = document.getElementById('ppTitle');
  if (b) b.innerHTML = '<div class="pp-empty">Click any element<br>to edit its properties</div>';
  if (t) t.textContent = 'PROPERTIES';
  updateStatusBar(null);
}

function syncPropPos(el) {
  ['x','y','w','h'].forEach(function(p){
    var i=document.getElementById('pp-'+p); if(i) i.value=Math.round(el[p]||0);
  });
}

function buildPropPanel(eid) {
  var slide=getActive(); if(!slide) return;
  var el=slide.elements[eid]; if(!el) return;
  var t=document.getElementById('ppTitle');
  var body=document.getElementById('ppBody');
  if(!t||!body) return;
  t.textContent=(el.label||el.type).toUpperCase();
  body.innerHTML='';

  function sl(txt){ var d=document.createElement('div'); d.className='sl'; d.textContent=txt; body.appendChild(d); }
  function lbl(txt){ var l=document.createElement('label'); l.textContent=txt; body.appendChild(l); }
  function numInp(id,val,min,max,step,cb){
    var i=document.createElement('input'); i.type='number'; i.id=id||''; i.value=val; if(min!=null)i.min=min; if(max!=null)i.max=max; if(step!=null)i.step=step;
    i.oninput=function(){ cb(parseFloat(i.value)||0); }; body.appendChild(i); return i;
  }
  function txtInp(val,cb){ var i=document.createElement('input'); i.type='text'; i.value=val||''; i.oninput=function(){ cb(i.value); }; body.appendChild(i); return i; }
  function colorRow(val,cb){
    var row=document.createElement('div'); row.className='color-row';
    var cp=document.createElement('input'); cp.type='color'; try{ cp.value=val&&val.startsWith('#')?val:'#7cff7c'; }catch(e){ cp.value='#7cff7c'; }
    var ct=document.createElement('input'); ct.type='text'; ct.value=val||''; ct.style.flex='1'; ct.placeholder='#hex or rgba(...)';
    cp.oninput=function(){ ct.value=cp.value; cb(cp.value); };
    ct.oninput=function(){ try{cp.value=ct.value;}catch(e){} cb(ct.value); };
    row.appendChild(cp); row.appendChild(ct); body.appendChild(row);
  }
  function selInp(opts,val,cb){
    var s=document.createElement('select');
    opts.forEach(function(o){ var op=document.createElement('option'); op.value=o; op.textContent=o; if(o===val)op.selected=true; s.appendChild(op); });
    s.onchange=function(){ cb(s.value); }; body.appendChild(s); return s;
  }
  function chk(lbl2,val,cb){
    var row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;';
    var c=document.createElement('input'); c.type='checkbox'; c.checked=!!val; c.style.accentColor=AC; c.style.width='14px'; c.style.height='14px';
    c.onchange=function(){ cb(c.checked); };
    var l=document.createElement('label'); l.textContent=lbl2; l.style.color='#888'; l.style.fontSize='11px';
    row.appendChild(c); row.appendChild(l); body.appendChild(row);
  }
  function grid2(children){
    var g=document.createElement('div'); g.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:4px;';
    children.forEach(function(c){ g.appendChild(c); }); body.appendChild(g);
  }
  function mkLabelInput(lbl2,input){
    var d=document.createElement('div'); d.style.cssText='display:flex;flex-direction:column;gap:2px;';
    var l=document.createElement('label'); l.textContent=lbl2; l.style.fontSize='9px'; l.style.color='#444';
    d.appendChild(l); d.appendChild(input); return d;
  }

  // Position & Size
  sl('Position & Size');
  var posInputs = ['x','y','w','h'].map(function(p){
    var i=document.createElement('input'); i.type='number'; i.id='pp-'+p; i.value=Math.round(el[p]||0);
    i.oninput=function(){
      el[p]=parseInt(i.value)||0;
      var d=document.querySelector('[data-eid="'+eid+'"]');
      if(d){ d.style.left=el.x+'px'; d.style.top=el.y+'px'; d.style.width=el.w+'px'; if(el.h) d.style.height=el.h+'px'; }
    };
    return mkLabelInput(p.toUpperCase(), i);
  });
  grid2(posInputs);

  // Label
  sl('Name / Label');
  txtInp(el.label||el.type, function(v){ el.label=v; buildElTable(); });

  // Global opacity
  sl('Opacity');
  var opRow=document.createElement('div'); opRow.style.cssText='display:flex;align-items:center;gap:8px;';
  var opS=document.createElement('input'); opS.type='range'; opS.min=0; opS.max=1; opS.step=0.01; opS.value=el.globalOpacity!=null?el.globalOpacity:1; opS.style.cssText='flex:1;accent-color:'+AC+';';
  var opV=document.createElement('span'); opV.style.cssText='font-size:10px;color:#888;min-width:32px;text-align:right;'; opV.textContent=Math.round((el.globalOpacity!=null?el.globalOpacity:1)*100)+'%';
  opS.oninput=function(){
    el.globalOpacity=parseFloat(opS.value); opV.textContent=Math.round(el.globalOpacity*100)+'%';
    var d=document.querySelector('[data-eid="'+eid+'"]'); if(d) d.style.opacity=el.globalOpacity;
  };
  opRow.appendChild(opS); opRow.appendChild(opV); body.appendChild(opRow);

  // Lock
  sl('Layer');
  var lkBtn=document.createElement('button');
  lkBtn.className=el.locked?'btn-danger':'btn-green'; lkBtn.style.margin='0'; lkBtn.style.width='100%';
  lkBtn.textContent=el.locked?'🔒 Locked — click to unlock':'🔓 Unlocked — click to lock';
  lkBtn.onclick=function(){ el.locked=!el.locked; pushHistory(); buildPropPanel(eid); renderActiveSlide(); buildElTable(); };
  body.appendChild(lkBtn);

  // TEXT props
  if (el.type==='text'||el.type==='button'||el.type==='stepnum') {
    sl('Text');
    if (el.type!=='stepnum') {
      lbl('Content');
      var ta=document.createElement('textarea'); ta.value=el.text||'';
      ta.oninput=function(){ el.text=ta.value; renderActiveSlide(); };
      body.appendChild(ta);
    }
    lbl('Font');
    selInp(FONTS, el.font||'Poppins', function(v){
      el.font=v;
      var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.fontFamily='\''+v+'\',sans-serif';
    });
    lbl('Font Size');
    numInp(null,el.fs||16,4,400,1,function(v){
      el.fs=v;
      var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.fontSize=v+'px';
    });
    lbl('Color');
    colorRow(el.color||'#ffffff',function(v){
      el.color=v;
      var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.color=v;
    });
    if (el.type==='text') {
      lbl('Text Align');
      selInp(['left','center','right'],el.align||'left',function(v){
        el.align=v; var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.textAlign=v;
      });
      chk('Bold',    el.bold,    function(v){ el.bold=v;    renderActiveSlide(); });
      chk('Italic',  el.italic,  function(v){ el.italic=v;  renderActiveSlide(); });
      chk('Underline',el.underline,function(v){ el.underline=v; renderActiveSlide(); });
      chk('2nd line accent color',el.colorLine2,function(v){ el.colorLine2=v; renderActiveSlide(); });
      lbl('Letter Spacing (px)');
      numInp(null,el.letterSpacing||0,-10,50,0.5,function(v){
        el.letterSpacing=v; var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.letterSpacing=v+'px';
      });
      lbl('Line Height');
      numInp(null,el.lineHeight||1.15,0.5,5,0.05,function(v){
        el.lineHeight=v; var tn=document.querySelector('[data-eid="'+eid+'"] [data-tn]'); if(tn) tn.style.lineHeight=v;
      });
      sl('Text Shadow');
      lbl('Shadow Color'); colorRow(el.shadowColor||'#000000',function(v){ el.shadowColor=v; renderActiveSlide(); });
      var shadRow=document.createElement('div'); shadRow.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;';
      ['shadowX','shadowY','shadowBlur'].forEach(function(p,i2){
        var inp=document.createElement('input'); inp.type='number'; inp.value=el[p]||0; inp.style.cssText='width:100%;padding:5px 6px;background:#141414;border:1px solid #1a1a1a;border-radius:4px;color:#fff;font-size:10px;font-family:Poppins,sans-serif;outline:none;';
        inp.oninput=function(){ el[p]=parseInt(inp.value)||0; renderActiveSlide(); };
        var cell=document.createElement('div');
        var ll=document.createElement('label'); ll.textContent=['X','Y','Blur'][i2]; ll.style.cssText='font-size:9px;color:#444;display:block;margin-bottom:2px;';
        cell.appendChild(ll); cell.appendChild(inp); shadRow.appendChild(cell);
      });
      body.appendChild(shadRow);
      sl('Stroke');
      lbl('Stroke Color'); colorRow(el.strokeColor||'#000000',function(v){ el.strokeColor=v; renderActiveSlide(); });
      lbl('Stroke Width'); numInp(null,el.strokeWidth||0,0,30,1,function(v){ el.strokeWidth=v; renderActiveSlide(); });
    }
  }

  // SHAPE props
  if (el.type==='rect'||el.type==='circle'||el.type==='line'||el.type==='divider') {
    sl('Fill');
    lbl('Fill Type');
    selInp(['solid','gradient'],el.fillType||'solid',function(v){ el.fillType=v; buildPropPanel(eid); renderActiveSlide(); });
    lbl('Color'); colorRow(el.color||AC,function(v){ el.color=v; renderActiveSlide(); });
    if ((el.fillType||'solid')==='gradient') {
      lbl('Color 2'); colorRow(el.color2||'#000000',function(v){ el.color2=v; renderActiveSlide(); });
      lbl('Direction'); selInp(['to right','to bottom','to bottom right','to bottom left'],el.gradDir||'to right',function(v){ el.gradDir=v; renderActiveSlide(); });
    }
    lbl('Opacity'); numInp(null,el.opacity!=null?el.opacity:0.2,0,1,0.05,function(v){ el.opacity=v; renderActiveSlide(); });
    if (el.type==='rect') {
      lbl('Border Radius'); numInp(null,el.radius||0,0,270,1,function(v){ el.radius=v; renderActiveSlide(); });
    }
    sl('Stroke');
    lbl('Stroke Color'); colorRow(el.strokeColor||'#ffffff',function(v){ el.strokeColor=v; renderActiveSlide(); });
    lbl('Stroke Width'); numInp(null,el.strokeWidth||0,0,20,1,function(v){ el.strokeWidth=v; renderActiveSlide(); });
  }

  // IMAGE props
  if (el.type==='image') {
    sl('Image');
    if (slide.imgUrls&&slide.imgUrls[eid]) {
      var rb=document.createElement('button'); rb.className='btn-danger'; rb.style.width='100%'; rb.textContent='✕ Remove Image';
      rb.onclick=function(){ delete slide.imgUrls[eid]; renderActiveSlide(); buildPropPanel(eid); };
      body.appendChild(rb);
    }
    lbl('Border Radius'); numInp(null,el.radius||0,0,270,1,function(v){ el.radius=v; renderActiveSlide(); });
    lbl('Object Fit'); selInp(['cover','contain','fill'],el.objectFit||'cover',function(v){ el.objectFit=v; renderActiveSlide(); });
  }

  // Align
  sl('Align on Canvas');
  var ag=document.createElement('div'); ag.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:3px;';
  [['◀','left'],['↔','center-h'],['▶','right'],['▲','top'],['↕','middle-v'],['▼','bottom']].forEach(function(pair){
    var b=document.createElement('button'); b.title=pair[1]; b.textContent=pair[0];
    b.style.cssText='padding:5px;background:#141414;border:1px solid #1a1a1a;border-radius:4px;color:#777;font-size:12px;cursor:pointer;';
    b.onclick=function(){ alignEl(pair[1]); };
    b.onmouseenter=function(){ b.style.color=AC; }; b.onmouseleave=function(){ b.style.color='#777'; };
    ag.appendChild(b);
  });
  body.appendChild(ag);

  // Z-order
  sl('Layer Order');
  var zg=document.createElement('div'); zg.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:4px;';
  [['⬆ Forward','forward'],['⬇ Backward','backward'],['⏫ To Front','front'],['⏬ To Back','back']].forEach(function(pair){
    var b=document.createElement('button'); b.textContent=pair[0];
    b.style.cssText='padding:6px;background:#141414;border:1px solid #1a1a1a;border-radius:4px;color:#777;font-size:9px;cursor:pointer;font-family:Poppins,sans-serif;';
    b.onclick=function(){
      if(pair[1]==='forward') bringForward(eid);
      else if(pair[1]==='backward') sendBackward(eid);
      else if(pair[1]==='front') bringToFront(eid);
      else sendToBack(eid);
    };
    b.onmouseenter=function(){ b.style.color=AC; }; b.onmouseleave=function(){ b.style.color='#777'; };
    zg.appendChild(b);
  });
  body.appendChild(zg);

  // Delete
  sl('Danger Zone');
  var delB=document.createElement('button'); delB.className='btn-danger'; delB.style.width='100%'; delB.textContent='✕ Delete This Element';
  delB.onclick=function(){
    if(!confirm('Delete "'+( el.label||el.type)+'"?')) return;
    pushHistory(); delete slide.elements[eid];
    selEl=null; selElId=null;
    renderActiveSlide(); buildElTable(); clearPropPanel();
  };
  body.appendChild(delB);
}
