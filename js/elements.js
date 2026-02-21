/* ══════════════════════════════════════════════════════
   ELEMENTS.JS  —  60+ elements, 8 categories, search
══════════════════════════════════════════════════════ */

/* ── Master element catalogue ── */
var EL_CATALOGUE = [

  /* ── TEXT ── */
  { type:'text',      icon:'T',   label:'Body Text',      cat:'Text',
    props:{ x:40, y:200, w:460, h:50,  fs:16, text:'Add your text here', color:'#ffffff', font:'Poppins', bold:false, align:'left', label:'Body Text' } },
  { type:'text',      icon:'H1',  label:'Heading',        cat:'Text',
    props:{ x:30, y:130, w:480, h:70,  fs:42, text:'BIG HEADLINE', color:'#ffffff', font:'Poppins', bold:true,  align:'left', label:'Heading' } },
  { type:'text',      icon:'H2',  label:'Sub-heading',    cat:'Text',
    props:{ x:30, y:200, w:400, h:50,  fs:24, text:'Sub-heading here', color:'#ffffff', font:'Poppins', bold:true,  align:'left', label:'Sub-heading' } },
  { type:'text',      icon:'H3',  label:'Caption',        cat:'Text',
    props:{ x:30, y:260, w:380, h:36,  fs:13, text:'Caption or tagline text', color:'rgba(255,255,255,0.6)', font:'Poppins', bold:false, align:'left', label:'Caption' } },
  { type:'text',      icon:'Q"',  label:'Quote',          cat:'Text',
    props:{ x:40, y:160, w:460, h:80,  fs:20, text:'"A great quote goes right here and inspires your audience."', color:'#ffffff', font:'Playfair Display', bold:false, align:'center', italic:true, label:'Quote' } },
  { type:'text',      icon:'①',  label:'Numbered Point', cat:'Text',
    props:{ x:80, y:180, w:380, h:40,  fs:16, text:'01  This is your key point', color:'#ffffff', font:'Poppins', bold:false, align:'left', label:'Numbered Point' } },
  { type:'text',      icon:'•',   label:'Bullet Point',   cat:'Text',
    props:{ x:50, y:180, w:400, h:40,  fs:15, text:'• This is a bullet point', color:'rgba(255,255,255,0.85)', font:'Poppins', bold:false, align:'left', label:'Bullet Point' } },
  { type:'text',      icon:'Aa',  label:'Label Chip',     cat:'Text',
    props:{ x:30, y:85,  w:140, h:28,  fs:10, text:'FEATURED', color:'#000000', font:'Poppins', bold:true, align:'center', bgColor:'#7CFF7C', label:'Label Chip' } },
  { type:'text',      icon:'%',   label:'Stat Number',    cat:'Text',
    props:{ x:120, y:160, w:300, h:120, fs:80, text:'97%', color:'#7CFF7C', font:'Poppins', bold:true, align:'center', label:'Stat Number' } },
  { type:'text',      icon:'#',   label:'Hashtag',        cat:'Text',
    props:{ x:60, y:460, w:380, h:32,  fs:12, text:'#yourhashtag  #topic  #brand', color:'rgba(255,255,255,0.4)', font:'Poppins', bold:false, align:'center', label:'Hashtag' } },
  { type:'text',      icon:'@',   label:'Handle',         cat:'Text',
    props:{ x:160, y:360, w:220, h:30,  fs:13, text:'@yourhandle', color:'rgba(255,255,255,0.5)', font:'Poppins', bold:false, align:'center', label:'Handle' } },
  { type:'text',      icon:'💬',  label:'Testimonial',    cat:'Text',
    props:{ x:40, y:140, w:460, h:100, fs:17, text:'"This changed everything for me. Highly recommend!"', color:'#ffffff', font:'Poppins', bold:false, align:'center', italic:true, label:'Testimonial' } },
  { type:'text',      icon:'📌',  label:'Tip Box Text',   cat:'Text',
    props:{ x:30, y:200, w:480, h:60,  fs:14, text:'💡 PRO TIP: Put your best tip right here', color:'#ffffff', font:'Poppins', bold:false, align:'left', label:'Tip Box Text' } },

  /* ── MEDIA ── */
  { type:'image',     icon:'🖼️',  label:'Image',          cat:'Media',
    props:{ x:120, y:120, w:300, h:300, label:'Image',   radius:0 } },
  { type:'image',     icon:'🪪',  label:'Profile Photo',  cat:'Media',
    props:{ x:205, y:155, w:130, h:130, label:'Profile', radius:65, objectFit:'cover' } },
  { type:'image',     icon:'📸',  label:'Wide Photo',     cat:'Media',
    props:{ x:0,   y:140, w:540, h:260, label:'Wide Photo', radius:0, objectFit:'cover' } },
  { type:'image',     icon:'🔲',  label:'Rounded Image',  cat:'Media',
    props:{ x:160, y:160, w:220, h:220, label:'Rounded Image', radius:20, objectFit:'cover' } },
  { type:'image',     icon:'🧩',  label:'Icon / Badge',   cat:'Media',
    props:{ x:230, y:210, w:80,  h:80,  label:'Icon',    radius:0 } },
  { type:'logo',      icon:'🏷',  label:'Logo',           cat:'Media',
    props:{ x:26,  y:20,  w:110, h:60,  label:'Logo' } },

  /* ── SHAPES ── */
  { type:'rect',      icon:'▬',   label:'Rectangle',      cat:'Shapes',
    props:{ x:100, y:200, w:340, h:140, color:'#7CFF7C', opacity:0.15, radius:0,  label:'Rectangle' } },
  { type:'rect',      icon:'▭',   label:'Rounded Rect',   cat:'Shapes',
    props:{ x:100, y:200, w:340, h:140, color:'#7CFF7C', opacity:0.15, radius:16, label:'Rounded Rect' } },
  { type:'rect',      icon:'🃏',  label:'Card BG',        cat:'Shapes',
    props:{ x:30,  y:100, w:480, h:340, color:'#ffffff', opacity:0.06, radius:20, label:'Card BG' } },
  { type:'rect',      icon:'🎗',  label:'Accent Bar',     cat:'Shapes',
    props:{ x:30,  y:130, w:6,   h:80,  color:'#7CFF7C', opacity:1,    radius:3,  label:'Accent Bar' } },
  { type:'rect',      icon:'🟩',  label:'Tag Pill',       cat:'Shapes',
    props:{ x:30,  y:86,  w:120, h:30,  color:'#7CFF7C', opacity:1,    radius:15, label:'Tag Pill' } },
  { type:'rect',      icon:'🌅',  label:'Gradient Rect',  cat:'Shapes',
    props:{ x:0,   y:300, w:540, h:240, color:'#7CFF7C', color2:'#060c08', fillType:'gradient', gradDir:'to bottom', opacity:0.8, radius:0, label:'Gradient Rect' } },
  { type:'circle',    icon:'◯',   label:'Circle',         cat:'Shapes',
    props:{ x:195, y:195, w:150, h:150, color:'#7CFF7C', opacity:0.15, label:'Circle' } },
  { type:'circle',    icon:'⬤',   label:'Filled Dot',     cat:'Shapes',
    props:{ x:250, y:250, w:40,  h:40,  color:'#7CFF7C', opacity:1,    label:'Filled Dot' } },
  { type:'circle',    icon:'💠',  label:'Glow Circle',    cat:'Shapes',
    props:{ x:120, y:120, w:300, h:300, color:'#7CFF7C', opacity:0.08, label:'Glow Circle' } },
  { type:'rect',      icon:'🔷',  label:'Diamond',        cat:'Shapes',
    props:{ x:210, y:210, w:120, h:120, color:'#7CFF7C', opacity:0.2, radius:6, label:'Diamond', transform:'rotate(45deg)' } },

  /* ── LINES & DIVIDERS ── */
  { type:'line',      icon:'—',   label:'Line',           cat:'Lines',
    props:{ x:30,  y:270, w:480, h:2,  color:'#7CFF7C', opacity:0.5, label:'Line' } },
  { type:'divider',   icon:'═',   label:'Divider',        cat:'Lines',
    props:{ x:30,  y:168, w:480, h:2,  color:'#7CFF7C', opacity:1,   label:'Divider' } },
  { type:'line',      icon:'╌',   label:'Dashed Line',    cat:'Lines',
    props:{ x:30,  y:270, w:480, h:2,  color:'#7CFF7C', opacity:0.4, dash:true, label:'Dashed Line' } },
  { type:'line',      icon:'┄',   label:'Short Line',     cat:'Lines',
    props:{ x:160, y:270, w:220, h:2,  color:'#7CFF7C', opacity:0.6, label:'Short Line' } },
  { type:'line',      icon:'║',   label:'Vertical Line',  cat:'Lines',
    props:{ x:270, y:80,  w:2,   h:380, color:'#7CFF7C', opacity:0.4, label:'Vertical Line' } },

  /* ── UI COMPONENTS ── */
  { type:'button',    icon:'🔘',  label:'Button',         cat:'UI',
    props:{ x:148, y:280, w:244, h:52,  fs:13, text:'CLICK HERE',  label:'Button' } },
  { type:'button',    icon:'⬛',  label:'Ghost Button',   cat:'UI',
    props:{ x:148, y:280, w:244, h:52,  fs:13, text:'LEARN MORE',  label:'Ghost Button' } },
  { type:'button',    icon:'→',   label:'Arrow Button',   cat:'UI',
    props:{ x:148, y:280, w:200, h:44,  fs:12, text:'READ MORE →', label:'Arrow Button' } },
  { type:'dots',      icon:'⚫',  label:'Progress Dots',  cat:'UI',
    props:{ x:30,  y:510, w:80,  h:16,  label:'Progress Dots' } },
  { type:'arrow',     icon:'➡️',  label:'Nav Arrow',      cat:'UI',
    props:{ x:493, y:496, w:36,  h:36,  label:'Nav Arrow' } },
  { type:'frame',     icon:'⬜',  label:'Frame Border',   cat:'UI',
    props:{ x:0,   y:0,   w:540, h:540, label:'Frame Border' } },

  /* ── NUMBERS & STEPS ── */
  { type:'stepnum',   icon:'①',  label:'Step Number',    cat:'Steps',
    props:{ x:30,  y:28,  w:140, h:130, fs:108, label:'Step Number' } },
  { type:'text',      icon:'1.',  label:'Step 1 Label',   cat:'Steps',
    props:{ x:30,  y:40,  w:80,  h:40,  fs:14, text:'STEP 01', color:'#7CFF7C', font:'Poppins', bold:true,  align:'left', label:'Step Label' } },
  { type:'text',      icon:'✔',   label:'Check Item',     cat:'Steps',
    props:{ x:50,  y:180, w:420, h:36,  fs:14, text:'✅  This is a completed step', color:'#ffffff', font:'Poppins', bold:false, align:'left', label:'Check Item' } },
  { type:'text',      icon:'⏱',  label:'Time / Date',    cat:'Steps',
    props:{ x:30,  y:90,  w:200, h:30,  fs:12, text:'📅  Jan 2025', color:'rgba(255,255,255,0.5)', font:'Poppins', bold:false, align:'left', label:'Date Label' } },

  /* ── STATS & DATA ── */
  { type:'text',      icon:'📊',  label:'Big Stat',       cat:'Stats',
    props:{ x:30,  y:140, w:480, h:140, fs:80, text:'10K+', color:'#7CFF7C', font:'Poppins', bold:true,  align:'center', label:'Big Stat' } },
  { type:'text',      icon:'📈',  label:'Stat Label',     cat:'Stats',
    props:{ x:60,  y:290, w:420, h:36,  fs:14, text:'FOLLOWERS GAINED IN 30 DAYS', color:'rgba(255,255,255,0.6)', font:'Poppins', bold:false, align:'center', label:'Stat Label' } },
  { type:'text',      icon:'VS',  label:'VS Comparison',  cat:'Stats',
    props:{ x:220, y:220, w:100, h:100, fs:36, text:'VS', color:'#7CFF7C', font:'Poppins', bold:true,  align:'center', label:'VS Badge' } },
  { type:'text',      icon:'⭐',  label:'Star Rating',    cat:'Stats',
    props:{ x:160, y:250, w:220, h:50,  fs:28, text:'★★★★★', color:'#FFD93D', font:'Poppins', bold:false, align:'center', label:'Star Rating' } },
  { type:'text',      icon:'💯',  label:'Percentage',     cat:'Stats',
    props:{ x:100, y:160, w:340, h:150, fs:90, text:'85%', color:'#ffffff', font:'Poppins', bold:true,  align:'center', label:'Percentage' } },
  { type:'text',      icon:'↑',   label:'Growth Arrow',   cat:'Stats',
    props:{ x:200, y:220, w:140, h:100, fs:60, text:'↑', color:'#7CFF7C', font:'Poppins', bold:true,  align:'center', label:'Growth Arrow' } },

  /* ── BRANDING ── */
  { type:'text',      icon:'🏷',  label:'Brand Name',     cat:'Brand',
    props:{ x:30,  y:22,  w:300, h:40,  fs:18, text:'BRAND NAME', color:'#7CFF7C', font:'Poppins', bold:true,  align:'left', letterSpacing:3, label:'Brand Name' } },
  { type:'text',      icon:'💼',  label:'Tagline',        cat:'Brand',
    props:{ x:30,  y:490, w:360, h:26,  fs:11, text:'Your tagline · @handle · website.com', color:'rgba(255,255,255,0.35)', font:'Poppins', bold:false, align:'left', label:'Tagline' } },
  { type:'text',      icon:'🌐',  label:'Website URL',    cat:'Brand',
    props:{ x:150, y:490, w:240, h:26,  fs:11, text:'www.yourwebsite.com', color:'rgba(255,255,255,0.4)', font:'Poppins', bold:false, align:'center', label:'Website URL' } },
  { type:'text',      icon:'📩',  label:'CTA Text',       cat:'Brand',
    props:{ x:40,  y:440, w:460, h:40,  fs:15, text:'DM me "START" to begin 🚀', color:'rgba(255,255,255,0.8)', font:'Poppins', bold:false, align:'center', label:'CTA Text' } },
  { type:'text',      icon:'🎯',  label:'Offer Badge',    cat:'Brand',
    props:{ x:350, y:30,  w:160, h:60,  fs:13, text:'FREE\nGUIDE', color:'#000000', font:'Poppins', bold:true,  align:'center', bgColor:'#7CFF7C', label:'Offer Badge' } },
  { type:'text',      icon:'🔖',  label:'Swipe Prompt',   cat:'Brand',
    props:{ x:180, y:498, w:180, h:24,  fs:11, text:'← SWIPE FOR MORE →', color:'rgba(255,255,255,0.35)', font:'Poppins', bold:false, align:'center', label:'Swipe Prompt' } },
];

/* ══ Category order ══ */
var EL_CATS = ['Text','Media','Shapes','Lines','UI','Steps','Stats','Brand'];

/* ══ State ══ */
var _elSearch  = '';
var _elCatOpen = {};
EL_CATS.forEach(function(c) { _elCatOpen[c] = false; });
_elCatOpen['Text'] = true;

/* ══ Build palette ══ */
function buildElPalette() {
  var container = document.getElementById('elPalette');
  if (!container) return;
  container.innerHTML = '';
  container.style.cssText = 'display:flex;flex-direction:column;gap:4px;';

  /* ── Search bar ── */
  var sb = document.createElement('div');
  sb.style.cssText = 'position:relative;margin-bottom:6px;';
  sb.innerHTML =
    '<span style="position:absolute;left:8px;top:50%;transform:translateY(-50%);' +
    'color:#333;font-size:12px;pointer-events:none;">🔍</span>' +
    '<input type="text" id="elSearch" placeholder="Search elements…" ' +
    'style="padding:7px 9px 7px 28px;width:100%;background:#111;border:1px solid #1a1a1a;' +
    'border-radius:6px;color:#ccc;font-size:11px;font-family:Poppins,sans-serif;outline:none;">';
  container.appendChild(sb);

  document.getElementById('elSearch').addEventListener('input', function() {
    _elSearch = this.value.trim().toLowerCase();
    _renderPalette(container);
  });

  _renderPalette(container);
}

function _renderPalette(container) {
  /* Remove all children except search bar (first child) */
  while (container.children.length > 1) container.removeChild(container.lastChild);

  if (_elSearch) {
    /* ── Search results mode ── */
    var results = EL_CATALOGUE.filter(function(el) {
      return (
        el.label.toLowerCase().indexOf(_elSearch) > -1 ||
        el.cat.toLowerCase().indexOf(_elSearch) > -1 ||
        el.type.toLowerCase().indexOf(_elSearch) > -1
      );
    });
    if (!results.length) {
      var none = document.createElement('div');
      none.style.cssText = 'font-size:11px;color:#333;text-align:center;padding:20px 0;';
      none.textContent = 'No elements found';
      container.appendChild(none);
      return;
    }
    var grid = _makeGrid();
    results.forEach(function(def) { grid.appendChild(_makeElCard(def)); });
    container.appendChild(grid);
    return;
  }

  /* ── Category accordion mode ── */
  EL_CATS.forEach(function(cat) {
    var items = EL_CATALOGUE.filter(function(el) { return el.cat === cat; });
    if (!items.length) return;

    /* Category header */
    var hdr = document.createElement('button');
    hdr.type = 'button';
    hdr.style.cssText =
      'width:100%;display:flex;align-items:center;justify-content:space-between;' +
      'background:#111;border:1px solid #1a1a1a;border-radius:6px;' +
      'padding:7px 10px;cursor:pointer;transition:all .15s;';
    hdr.innerHTML =
      '<span style="font-size:10px;color:#7CFF7C;letter-spacing:1.5px;font-family:Poppins,sans-serif;font-weight:600;">' +
        _catIcon(cat) + '  ' + cat.toUpperCase() +
      '</span>' +
      '<span style="display:flex;align-items:center;gap:6px;">' +
        '<span style="font-size:9px;color:#333;font-family:Poppins,sans-serif;">' + items.length + '</span>' +
        '<span id="caret-' + cat + '" style="font-size:10px;color:#555;transition:transform .2s;' +
          'display:inline-block;transform:' + (_elCatOpen[cat] ? 'rotate(90deg)' : 'rotate(0deg)') + ';">▶</span>' +
      '</span>';
    hdr.onmouseenter = function() { hdr.style.borderColor = '#7CFF7C44'; };
    hdr.onmouseleave = function() { hdr.style.borderColor = '#1a1a1a'; };
    hdr.onclick = function() {
      _elCatOpen[cat] = !_elCatOpen[cat];
      var caret = document.getElementById('caret-' + cat);
      var body  = document.getElementById('catbody-' + cat);
      if (caret) caret.style.transform = _elCatOpen[cat] ? 'rotate(90deg)' : 'rotate(0deg)';
      if (body)  body.style.display    = _elCatOpen[cat] ? 'grid' : 'none';
    };
    container.appendChild(hdr);

    /* Category grid */
    var body = _makeGrid();
    body.id  = 'catbody-' + cat;
    body.style.display = _elCatOpen[cat] ? 'grid' : 'none';
    body.style.marginBottom = '4px';
    items.forEach(function(def) { body.appendChild(_makeElCard(def)); });
    container.appendChild(body);
  });
}

function _makeGrid() {
  var g = document.createElement('div');
  g.style.cssText =
    'display:grid;grid-template-columns:repeat(3,1fr);' +
    'gap:4px;padding:4px 0;';
  return g;
}

function _makeElCard(def) {
  var d = document.createElement('div');
  d.title = def.label + ' · ' + def.cat;
  d.style.cssText =
    'background:#111;border:1px solid #1a1a1a;border-radius:6px;' +
    'padding:9px 4px 7px;text-align:center;cursor:pointer;' +
    'transition:all .15s;';
  d.innerHTML =
    '<div style="font-size:15px;margin-bottom:4px;line-height:1;' +
    'font-family:Poppins,sans-serif;font-weight:700;color:#7CFF7C;">' +
      def.icon + '</div>' +
    '<div style="font-size:8.5px;color:#555;font-family:Poppins,sans-serif;' +
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 2px;">' +
      def.label + '</div>';
  d.onmouseenter = function() {
    d.style.borderColor = '#7CFF7C44';
    d.style.background  = '#151515';
  };
  d.onmouseleave = function() {
    d.style.borderColor = '#1a1a1a';
    d.style.background  = '#111';
  };
  d.onclick = function() { _addElFromDef(def); };
  return d;
}

function _catIcon(cat) {
  var icons = {
    Text:'T', Media:'🖼️', Shapes:'◼', Lines:'—',
    UI:'🔘', Steps:'①', Stats:'📊', Brand:'🏷'
  };
  return icons[cat] || '◉';
}

/* ══ Add element to active slide ══ */
function _addElFromDef(def) {
  var slide = getActive(); if (!slide) return;
  var props = JSON.parse(JSON.stringify(def.props)); // deep copy
  props.id  = newElId();
  // Apply current AC color if color is default green placeholder
  if (props.color === '#7CFF7C') props.color = AC;
  slide.elements[props.id] = Object.assign({ type: def.type, hidden: false, locked: false }, props);
  pushHistory();
  renderActiveSlide();
  buildElTable();
  /* Auto-select new element */
  setTimeout(function() {
    var dom = document.querySelector('[data-eid="' + props.id + '"]');
    if (dom) selectDomEl(dom, props.id);
  }, 50);
  showToast('➕ ' + def.label + ' added');
}

/* ══ Default props for programmatic ae() usage ══ */
function _defaultProps(type) {
  var found = EL_CATALOGUE.find(function(d) { return d.type === type; });
  return found ? JSON.parse(JSON.stringify(found.props)) : { x:100, y:100, w:100, h:60, label:type };
}

/* ══ ae() — add element to slide object (used by populateDefaults) ══ */
function ae(slide, type, props) {
  var eid = newElId();
  slide.elements[eid] = Object.assign(
    { id:eid, type:type, hidden:false, locked:false }, props
  );
  return eid;
}

/* ══ Build element visibility/lock table ══ */
function buildElTable() {
  var tb = document.getElementById('elTableBody'); if (!tb) return;
  tb.innerHTML = '';
  var slide = getActive(); if (!slide) return;
  var els = Object.values(slide.elements);
  if (!els.length) {
    tb.innerHTML =
      '<tr><td colspan="4" style="color:#333;font-size:10px;padding:14px;' +
      'text-align:center;">No elements on this slide</td></tr>';
    return;
  }
  els.forEach(function(el) {
    var hidden = !!el.hidden, locked = !!el.locked;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="' +
        'color:' + (hidden ? '#2a2a2a' : locked ? '#888' : '#aaa') + ';' +
        'text-decoration:' + (hidden ? 'line-through' : 'none') + ';' +
        'cursor:pointer;font-size:10px;padding:5px 6px;' +
        'max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" ' +
        'title="' + (el.label||el.type) + '">' + (el.label||el.type) + '</td>' +
      '<td style="padding:3px;text-align:center;">' +
        '<button type="button" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 4px;" title="Toggle visibility">' +
          (hidden ? '🙈' : '👁') + '</button></td>' +
      '<td style="padding:3px;text-align:center;">' +
        '<button type="button" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 4px;" title="Toggle lock">' +
          (locked ? '🔒' : '🔓') + '</button></td>' +
      '<td style="padding:3px;text-align:center;">' +
        '<button type="button" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 4px;color:#c44;" title="Delete">🗑</button></td>';

    /* Click name → select element */
    tr.querySelector('td').onclick = function() {
      var dom = document.querySelector('[data-eid="' + el.id + '"]');
      if (dom) selectDomEl(dom, el.id);
    };
    var btns = tr.querySelectorAll('button');
    btns[0].onclick = function() {
      el.hidden = !el.hidden; pushHistory(); renderActiveSlide(); buildElTable();
    };
    btns[1].onclick = function() {
      el.locked = !el.locked; pushHistory(); renderActiveSlide(); buildElTable();
    };
    btns[2].onclick = function() {
      if (!confirm('Delete "' + (el.label||el.type) + '"?')) return;
      pushHistory();
      delete slide.elements[el.id];
      if (selElId === el.id) { selEl = null; selElId = null; clearPropPanel(); }
      renderActiveSlide(); buildElTable();
    };
    tb.appendChild(tr);
  });
}

/* ══ populateDefaults (default slide templates) ══ */
function populateDefaults(slide) {
  var a = AC || '#7CFF7C';
  if (slide.type === 'intro') {
    ae(slide,'logo',    { x:26,  y:20,  w:110, h:60,  label:'Logo' });
    ae(slide,'text',    { x:34,  y:130, w:340, h:130, fs:50, text:'HOW TO\nGET STARTED', color:'#ffffff', font:'Poppins', bold:true, colorLine2:true, label:'Title', align:'left' });
    ae(slide,'text',    { x:34,  y:290, w:300, h:50,  fs:13, text:'Learn your process from A to Z.', color:'rgba(255,255,255,0.6)', font:'Poppins', bold:false, label:'Subtitle', align:'left' });
    ae(slide,'divider', { x:30,  y:122, w:340, h:2,   color:a, opacity:0.5, label:'Divider' });
    ae(slide,'dots',    { x:30,  y:510, w:80,  h:16,  label:'Dots' });
    ae(slide,'arrow',   { x:493, y:496, w:36,  h:36,  label:'Arrow' });
    ae(slide,'frame',   { x:0,   y:0,   w:540, h:540, label:'Frame' });
  } else if (slide.type === 'step') {
    ae(slide,'logo',    { x:26,  y:20,  w:110, h:60,  label:'Logo' });
    ae(slide,'stepnum', { x:30,  y:28,  w:140, h:130, fs:108, label:'Number' });
    ae(slide,'divider', { x:30,  y:168, w:480, h:2,   color:a, opacity:1, label:'Divider' });
    ae(slide,'text',    { x:30,  y:388, w:360, h:38,  fs:21, text:'STEP HEADLINE', color:a, font:'Poppins', bold:true, label:'Headline', align:'left' });
    ae(slide,'text',    { x:30,  y:432, w:340, h:56,  fs:12, text:'Describe this step here.', color:'rgba(255,255,255,0.7)', font:'Poppins', bold:false, label:'Body', align:'left' });
    ae(slide,'dots',    { x:30,  y:510, w:80,  h:16,  label:'Dots' });
    ae(slide,'arrow',   { x:493, y:496, w:36,  h:36,  label:'Arrow' });
    ae(slide,'frame',   { x:0,   y:0,   w:540, h:540, label:'Frame' });
  } else if (slide.type === 'cta') {
    ae(slide,'logo',    { x:26,  y:20,  w:110, h:60,  label:'Logo' });
    ae(slide,'text',    { x:50,  y:148, w:440, h:120, fs:40, text:'READY TO\nUPGRADE?', color:'#ffffff', font:'Poppins', bold:true, colorLine2:true, label:'Title', align:'center' });
    ae(slide,'button',  { x:148, y:294, w:244, h:50,  fs:13, text:'GET IT NOW', label:'Button' });
    ae(slide,'text',    { x:193, y:358, w:154, h:26,  fs:12, text:'@yourhandle', color:'rgba(255,255,255,0.5)', font:'Poppins', bold:false, label:'Handle', align:'center' });
    ae(slide,'dots',    { x:30,  y:510, w:80,  h:16,  label:'Dots' });
    ae(slide,'arrow',   { x:493, y:496, w:36,  h:36,  label:'Arrow' });
    ae(slide,'frame',   { x:0,   y:0,   w:540, h:540, label:'Frame' });
  }
  // blank — no defaults
}
