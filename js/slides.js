function addSlide(type){
  var id='slide_'+(++slideCounter);
  var label='Slide '+slideCounter;
  if(type==='intro') label='Intro';
  if(type==='step')  label='Step '+slideCounter;
  if(type==='cta')   label='CTA';
  if(type==='blank') label='Slide '+slideCounter;
  pushHistory();
  var sl={id:id,type:type,label:label,elements:{}};
  if(type==='intro'){
    var tid=newElId(),sid=newElId(),lid=newElId();
    sl.elements[tid]={id:tid,type:'text',label:'Title',x:40,y:180,w:460,h:80,text:'Your Title Here',fs:38,font:'Poppins',bold:true,color:'#ffffff',align:'left',lineHeight:1.1,letterSpacing:0};
    sl.elements[sid]={id:sid,type:'text',label:'Subtitle',x:40,y:270,w:420,h:50,text:'Your subtitle or tagline',fs:16,font:'Poppins',bold:false,color:'#aaaaaa',align:'left',lineHeight:1.4,letterSpacing:0};
    sl.elements[lid]={id:lid,type:'rect',label:'Accent Bar',x:40,y:165,w:4,h:80,color:AC,opacity:1,fillType:'solid',radius:2};
  }
  if(type==='step'){
    var nid=newElId(),tid2=newElId(),did=newElId();
    sl.elements[nid]={id:nid,type:'stepnum',label:'Step Num',x:40,y:60,w:72,h:72,text:'01',fs:28,font:'Poppins',bold:true,color:AC,align:'center',lineHeight:1};
    sl.elements[tid2]={id:tid2,type:'text',label:'Step Title',x:130,y:70,w:370,h:56,text:'Step Title',fs:22,font:'Poppins',bold:true,color:'#ffffff',align:'left',lineHeight:1.2,letterSpacing:0};
    sl.elements[did]={id:did,type:'text',label:'Description',x:40,y:160,w:460,h:200,text:'Describe this step in detail. Keep it concise and clear.',fs:15,font:'Poppins',bold:false,color:'#cccccc',align:'left',lineHeight:1.7,letterSpacing:0};
  }
  if(type==='cta'){
    var ctid=newElId(),csid=newElId(),cbid=newElId();
    sl.elements[ctid]={id:ctid,type:'text',label:'CTA Title',x:40,y:160,w:460,h:80,text:'Ready to Get Started?',fs:32,font:'Poppins',bold:true,color:'#ffffff',align:'center',lineHeight:1.2,letterSpacing:0};
    sl.elements[csid]={id:csid,type:'text',label:'CTA Sub',x:60,y:250,w:420,h:50,text:'Follow for more tips and guides',fs:15,font:'Poppins',bold:false,color:'#aaaaaa',align:'center',lineHeight:1.4,letterSpacing:0};
    sl.elements[cbid]={id:cbid,type:'button',label:'CTA Button',x:155,y:320,w:230,h:54,text:'Start Now →',fs:16,font:'Poppins',bold:true,color:'#000000',align:'center',lineHeight:1};
  }
  slides.push(sl);
  activeSlideIdx=slides.length-1;
  selEl=null;selElId=null;
  buildSlideList();buildTabsBar();renderActiveSlide();buildElTable();
  if(typeof clearPropPanel==='function')clearPropPanel();
  showToast('✚ Slide added: '+label);
}

function removeSlide(idx){
  if(slides.length<=1){showToast('⚠️ Need at least one slide');return;}
  if(!confirm('Delete "'+slides[idx].label+'"?'))return;
  pushHistory();
  slides.splice(idx,1);
  activeSlideIdx=Math.min(activeSlideIdx,slides.length-1);
  selEl=null;selElId=null;
  buildSlideList();buildTabsBar();renderActiveSlide();buildElTable();
  if(typeof clearPropPanel==='function')clearPropPanel();
  showToast('🗑 Slide deleted');
}

function selectSlide(idx){
  activeSlideIdx=idx;selEl=null;selElId=null;
  buildSlideList();buildTabsBar();renderActiveSlide();buildElTable();
  if(typeof clearPropPanel==='function')clearPropPanel();
  if(window.innerWidth<768)closeMobileDrawers();
}

function buildSlideList(){
  var list=document.getElementById('slideList');if(!list)return;
  list.innerHTML='';
  slides.forEach(function(sl,i){
    var card=document.createElement('div');
    card.className='slide-card'+(i===activeSlideIdx?' active':'');
    card.innerHTML=
      '<div class="sc-label">'+(i+1)+'. '+sl.label+'</div>'+
      '<div class="sc-type">'+sl.type+'</div>'+
      '<button class="sc-del" onclick="event.stopPropagation();removeSlide('+i+')" title="Delete">✕</button>';
    card.onclick=function(){selectSlide(i);};
    list.appendChild(card);
  });
}

function buildTabsBar(){
  var bar=document.getElementById('slideTabsBar');if(!bar)return;
  bar.innerHTML='';
  slides.forEach(function(sl,i){
    var btn=document.createElement('button');
    btn.className='slide-tab-btn'+(i===activeSlideIdx?' active':'');
    btn.textContent=(i+1)+'. '+sl.label;
    btn.onclick=function(){selectSlide(i);};
    bar.appendChild(btn);
  });
}

function setLpTab(tab){
  ['slides','elements','settings'].forEach(function(t){
    var body=document.getElementById('lpb-'+t);
    var btn=document.getElementById('lpt-'+t);
    if(body)body.style.display=(t===tab)?'flex':'none';
    if(btn) btn.classList.toggle('active',t===tab);
  });
  if(tab==='elements')buildElTable();
}
