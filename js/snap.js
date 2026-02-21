var SNAP_SIZE = 10;

function _snap(val) {
  if (!snapEnabled) return val;
  return Math.round(val / SNAP_SIZE) * SNAP_SIZE;
}

function toggleSnap() {
  snapEnabled = !snapEnabled;
  var btn = document.getElementById('m-snap');
  if (btn) btn.classList.toggle('active', snapEnabled);
  showToast(snapEnabled ? '🧲 Snap ON' : '🧲 Snap OFF');
}

function toggleGrid() {
  showGrid = !showGrid;
  var btn = document.getElementById('m-grid');
  if (btn) btn.classList.toggle('active', showGrid);
  renderActiveSlide();
  showToast(showGrid ? '⊞ Grid ON' : '⊞ Grid OFF');
}
