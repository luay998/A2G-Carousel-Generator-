var snapEnabled = true;
var _snapLines  = [];
var SNAP_THRESH = 6;

function getSnapTargets(excludeId) {
  var t = [];
  t.push({x:0},{x:CANVAS_SIZE},{x:CANVAS_SIZE/2});
  t.push({y:0},{y:CANVAS_SIZE},{y:CANVAS_SIZE/2});
  var slide = getActive(); if (!slide) return t;
  Object.values(slide.elements).forEach(function(el) {
    if (el.id === excludeId || el.hidden) return;
    var w = el.w||0, h = el.h||0;
    t.push({x:el.x},{x:el.x+w},{x:el.x+w/2});
    t.push({y:el.y},{y:el.y+h},{y:el.y+h/2});
  });
  return t;
}

function snapPosition(el, nx, ny) {
  var targets = getSnapTargets(el.id);
  var w = el.w||0, h = el.h||0;
  var sx = nx, sy = ny, gx, gy;
  var bx = SNAP_THRESH, by = SNAP_THRESH;
  targets.forEach(function(t) {
    if (t.x != null) {
      [{v:nx,type:'l'},{v:nx+w/2,type:'c'},{v:nx+w,type:'r'}].forEach(function(e) {
        var d = Math.abs(t.x - e.v);
        if (d < bx) {
          bx = d; gx = t.x;
          if (e.type==='l') sx = t.x;
          if (e.type==='c') sx = t.x - w/2;
          if (e.type==='r') sx = t.x - w;
        }
      });
    }
    if (t.y != null) {
      [{v:ny,type:'t'},{v:ny+h/2,type:'c'},{v:ny+h,type:'b'}].forEach(function(e) {
        var d = Math.abs(t.y - e.v);
        if (d < by) {
          by = d; gy = t.y;
          if (e.type==='t') sy = t.y;
          if (e.type==='c') sy = t.y - h/2;
          if (e.type==='b') sy = t.y - h;
        }
      });
    }
  });
  return { x: sx, y: sy, guideX: gx, guideY: gy };
}

function showSnapGuides(gx, gy) {
  clearSnapGuides();
  var canvas = document.querySelector('.slide-canvas'); if (!canvas) return;
  if (gx != null) {
    var l = document.createElement('div');
    l.style.cssText = 'position:absolute;left:' + gx + 'px;top:0;width:1px;height:100%;background:#7CFF7C;opacity:.7;pointer-events:none;z-index:500;';
    canvas.appendChild(l); _snapLines.push(l);
  }
  if (gy != null) {
    var l2 = document.createElement('div');
    l2.style.cssText = 'position:absolute;top:' + gy + 'px;left:0;height:1px;width:100%;background:#7CFF7C;opacity:.7;pointer-events:none;z-index:500;';
    canvas.appendChild(l2); _snapLines.push(l2);
  }
}

function clearSnapGuides() {
  _snapLines.forEach(function(l){ l.remove(); });
  _snapLines = [];
}

function toggleSnap() {
  snapEnabled = !snapEnabled;
  var btn = document.getElementById('m-snap');
  if (btn) btn.classList.toggle('active', snapEnabled);
  showToast(snapEnabled ? '🧲 Snap ON' : '🧲 Snap OFF');
}
