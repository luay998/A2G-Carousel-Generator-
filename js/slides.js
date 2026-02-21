function addSlide(type) {
  slideCounter++;
  var labels = { intro:'Intro', step:'Step', cta:'CTA', blank:'Blank' };
  var slide = {
    id: 'slide_' + slideCounter,
    type: type,
    label: labels[type] || type,
    elements: {},
    imgUrls: {}
  };
  populateDefaults(slide);
  slides.push(slide);
  activeSlideIdx = slides.length - 1;
  buildSlideList();
  buildTabsBar();
  renderActiveSlide();
  buildElTable();
}

function setActiveSlide(idx) {
  activeSlideIdx = idx;
  selEl = null; selElId = null;
  buildSlideList();
  buildTabsBar();
  renderActiveSlide();
  buildElTable();
  clearPropPanel();
}

function deleteSlide(idx) {
  if (slides.length <= 1) { showToast('Cannot delete the last slide'); return; }
  if (!confirm('Delete slide "' + slides[idx].label + '"?')) return;
  pushHistory();
  slides.splice(idx, 1);
  activeSlideIdx = Math.min(activeSlideIdx, slides.length - 1);
  buildSlideList(); buildTabsBar();
  renderActiveSlide(); buildElTable(); clearPropPanel();
}

function buildSlideList() {
  var c = document.getElementById('slideList'); if (!c) return;
  c.innerHTML = '';
  var typeColor = { intro:'#7CFF7C', step:'#4D96FF', cta:'#FF6B6B', blank:'#555' };
  slides.forEach(function(s, i) {
    var card = document.createElement('div');
    card.className = 'slide-card' + (i === activeSlideIdx ? ' active' : '');
    card.draggable = true;
    card.dataset.idx = i;
    var tc = typeColor[s.type] || '#555';
    card.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<div style="width:7px;height:7px;border-radius:50%;background:' + tc + ';flex-shrink:0;margin-top:1px;"></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div class="sc-label">' + (i+1) + '. ' + s.label + '</div>' +
          '<div class="sc-type">' + s.type + '</div>' +
        '</div>' +
        '<button class="sc-del" type="button" title="Delete">✕</button>' +
      '</div>';
    card.onclick = function(e) {
      if (e.target.classList.contains('sc-del')) return;
      setActiveSlide(i);
    };
    card.querySelector('.sc-del').onclick = function(e) {
      e.stopPropagation(); deleteSlide(i);
    };
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', String(i));
      setTimeout(function() { card.style.opacity = '.4'; }, 0);
    });
    card.addEventListener('dragend', function() { card.style.opacity = ''; });
    card.addEventListener('dragover', function(e) {
      e.preventDefault(); card.style.background = 'rgba(124,255,124,.05)';
    });
    card.addEventListener('dragleave', function() { card.style.background = ''; });
    card.addEventListener('drop', function(e) {
      e.preventDefault(); card.style.background = '';
      var from = parseInt(e.dataTransfer.getData('text/plain'));
      var to   = parseInt(card.dataset.idx);
      if (isNaN(from) || isNaN(to) || from === to) return;
      pushHistory();
      var moved = slides.splice(from, 1)[0];
      slides.splice(to, 0, moved);
      activeSlideIdx = to;
      buildSlideList(); buildTabsBar(); renderActiveSlide();
    });
    c.appendChild(card);
  });
}

function buildTabsBar() {
  var bar = document.getElementById('slideTabsBar'); if (!bar) return;
  bar.innerHTML = '';
  slides.forEach(function(s, i) {
    var btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'slide-tab-btn' + (i === activeSlideIdx ? ' active' : '');
    btn.textContent = (i+1) + '. ' + s.label;
    btn.onclick = function() { setActiveSlide(i); };
    bar.appendChild(btn);
  });
}

function togglePanels() {
  var lp  = document.getElementById('leftPanel');
  var btn = document.getElementById('btn-panels');
  if (!lp) return;
  var hidden = lp.style.display === 'none';
  lp.style.display = hidden ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', hidden);
}

function toggleProps() {
  var pp  = document.getElementById('propPanel');
  var btn = document.getElementById('btn-props');
  if (!pp) return;
  var hidden = pp.style.display === 'none';
  pp.style.display = hidden ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', hidden);
}

/* FIXED: restores as 'flex' not 'block' — lp-body is a flex container */
function setLpTab(tab) {
  ['slides','elements','settings'].forEach(function(t) {
    var body = document.getElementById('lpb-' + t);
    var btn  = document.getElementById('lpt-' + t);
    var active = (t === tab);
    if (body) body.style.display = active ? 'flex' : 'none';
    if (btn)  btn.classList.toggle('active', active);
  });
  if (tab === 'elements') buildElTable();
}
