function saveProject() {
  var data = { version:'2.1', savedAt:new Date().toISOString(), AC:AC, BG:BG, logoUrl:logoUrl, bgDataUrl:bgDataUrl, activeBgPreset:activeBgPreset, slides:slides, slideCounter:slideCounter, elCounter:elCounter };
  var blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a'); a.href=url; a.download='a2g-project-'+Date.now()+'.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  showToast('💾 Project saved!');
}

function loadProject() {
  var fi=document.createElement('input'); fi.type='file'; fi.accept='.json,application/json';
  fi.onchange=function(e) {
    var file=e.target.files[0]; if(!file) return;
    var r=new FileReader();
    r.onload=function(ev){
      try {
        var d=JSON.parse(ev.target.result);
        if(!d.slides) throw new Error('Not a valid A2G project file.');
        if(!confirm('Load "'+file.name+'"? This replaces your current work.')) return;
        AC=d.AC||'#7CFF7C'; BG=d.BG||'#060c08';
        logoUrl=d.logoUrl||null; bgDataUrl=d.bgDataUrl||null;
        activeBgPreset=d.activeBgPreset||0;
        slides=d.slides; slideCounter=d.slideCounter||slides.length; elCounter=d.elCounter||100;
        activeSlideIdx=0; selEl=null; selElId=null;
        var ac=document.getElementById('c-ac'); if(ac) ac.value=AC;
        var acH=document.getElementById('c-acH'); if(acH) acH.value=AC;
        var bg=document.getElementById('c-bg'); if(bg) bg.value=BG;
        var bgH=document.getElementById('c-bgH'); if(bgH) bgH.value=BG;
        if(logoUrl){ var pv=document.getElementById('pv-logo'); if(pv){pv.src=logoUrl;pv.style.display='block';} document.getElementById('lhint').textContent='✅ Loaded'; }
        buildBgGrid(); buildSlideList(); buildTabsBar();
        renderActiveSlide(); buildElTable(); clearPropPanel(); pushHistory();
        showToast('📂 Project loaded!');
      } catch(err){ alert('Load failed: '+err.message); }
    };
    r.readAsText(file);
  };
  document.body.appendChild(fi); fi.click(); document.body.removeChild(fi);
}

function showToast(msg, dur) {
  dur = dur||2200;
  var t=document.getElementById('a2g-toast');
  if (!t) {
    t=document.createElement('div'); t.id='a2g-toast';
    t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:#111;border:1px solid #7CFF7C44;border-radius:8px;color:#7CFF7C;font-size:12px;font-family:Poppins,sans-serif;font-weight:600;padding:9px 18px;z-index:10000;opacity:0;transition:all .25s ease;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  requestAnimationFrame(function(){ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  clearTimeout(t._tmr);
  t._tmr=setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(10px)'; }, dur);
}
