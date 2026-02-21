/* ══════════════════════════════════════
   ZOOM.JS
══════════════════════════════════════ */
var _zoom = 1.0;
var ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

function zoomIn() {
  var idx = _nearestZoomIdx();
  if (idx < ZOOM_STEPS.length - 1) _setZoom(ZOOM_STEPS[idx + 1]);
}
function zoomOut() {
  var idx = _nearestZoomIdx();
  if (idx > 0) _setZoom(ZOOM_STEPS[idx - 1]);
}
function zoomFit() {
  var area = document.getElementById('canvasArea');
  if (!area) return;
  var aw = area.clientWidth  - 40;
  var ah = area.clientHeight - 40;
  var scale = Math.min(aw / CANVAS_SIZE, ah / CANVAS_SIZE, 2.0);
  _setZoom(Math.max(0.2, scale));
}
function _setZoom(z) {
  _zoom = z;
  applyZoom();
}
function applyZoom() {
  var wrap = document.getElementById('canvasWrap');
  var disp = document.getElementById('zoomDisplay');
  if (wrap) wrap.style.transform = 'scale(' + _zoom + ')';
  if (disp) disp.textContent = Math.round(_zoom * 100) + '%';
}
function _nearestZoomIdx() {
  var best = 0, bestD = Infinity;
  ZOOM_STEPS.forEach(function(z, i) {
    var d = Math.abs(z - _zoom);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
