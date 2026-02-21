function saveProject(){
  try{
    var data=JSON.stringify({v:2,slides:slides,AC:AC,BG:BG,activeBgPreset:activeBgPreset,slideCounter:slideCounter,elCounter:elCounter},null,2);
    var blob=new Blob([data],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a'); a.href=url; a.download='a2g-project.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
    showToast('💾 Project saved');
  }catch(e){alert('Save failed: '+e.message);}
}
function loadProject(){
  var inp=document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
  inp.onchange=function(e){
    var file=e.target.files[0]; if(!file) return;
    var r=new FileReader();
    r.onload=function(ev){
      try{
        var data=JSON.parse(ev.target.result);
        if(!data.slides||!Array.isArray(data.slides)) throw new Error('Invalid project file');
        pushHistory();
        slides=data.slides; AC=data.AC||'#7CFF7C'; BG=data.BG||'#060c08';
        activeBgPreset=data.activeBgPreset||0;
        slideCounter=data.slideCounter||slides.length;
        elCounter=data.elCounter||100;
        activeSlideIdx=0; selEl=null; selElId=null;
        var ac=document.getElementById('c-ac');   if(ac)  ac.value=AC;
        var acH=document.getElementById('c-acH'); if(acH) acH.value=AC;
        var bg=document.getElementById('c-bg');   if(bg)  bg.value=BG;
        var bgH=document.getElementById('c-bgH'); if(bgH) bgH.value=BG;
        buildBgGrid(); buildSlideList(); buildTabsBar(); renderActiveSlide(); buildElTable();
        if(typeof clearPropPanel==='function') clearPropPanel();
        showToast('📂 Project loaded');
      }catch(err){alert('Load failed: '+err.message);}
    };
    r.readAsText(file);
  };
  document.body.appendChild(inp); inp.click(); document.body.removeChild(inp);
}
