/* ══════════════════════════════════════
   SNAP.JS
══════════════════════════════════════ */
var SNAP_SIZE = 10;

function _snap(val) {
  if (!snapEnabled) return val;
  return Math.round(val / SNAP_SIZE) * SNAP_SIZE;
}

function toggleSnap() {
  snapEnabled = !snapEnabled;
  var btn  = document.getElementById('m-snap');
  var mbtn = document.getElementById('mt-snap');
  if (btn)  btn.classList.toggle('active', snapEnabled);
  if (mbtn) mbtn.classList.toggle('active', snapEnabled);
  showToast(snapEnabled ? '🧲 Snap ON' : '🧲 Snap OFF');
}
