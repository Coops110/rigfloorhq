function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function clearOutputs() {
  document.getElementById("out-window").textContent = "\u2014";
  document.getElementById("out-margin-low").textContent = "\u2014";
  document.getElementById("out-margin-high").textContent = "\u2014";
  document.getElementById("out-position").textContent = "\u2014";
  document.getElementById("mww-visual").style.display = "none";
}
function calc() {
  const current = num("mww-current"), pp = num("mww-pp"), fg = num("mww-fg");
  if (!current || !pp || !fg || fg <= pp) {
    clearOutputs();
    return;
  }
  const window = fg - pp;
  const marginLow = current - pp;
  const marginHigh = fg - current;
  document.getElementById("out-window").textContent = window.toFixed(2) + " ppg";
  document.getElementById("out-margin-low").textContent = marginLow.toFixed(2) + " ppg";
  document.getElementById("out-margin-high").textContent = marginHigh.toFixed(2) + " ppg";
  const statusEl = document.getElementById("out-position");
  if (current < pp) {
    statusEl.innerHTML = '<span class="status-badge status-danger">\u{1F6A8} Bajo la Presi\xF3n de Poro</span>';
  } else if (current > fg) {
    statusEl.innerHTML = '<span class="status-badge status-danger">\u26D4 Sobre la Presi\xF3n de Fractura</span>';
  } else if (marginLow < 0.3 || marginHigh < 0.3) {
    statusEl.innerHTML = '<span class="status-badge status-caution">\u26A0 Margen Estrecho</span>';
  } else {
    statusEl.innerHTML = '<span class="status-badge status-safe">\u2705 Dentro de la Ventana Segura</span>';
  }
  const pct = Math.max(0, Math.min(100, (current - pp) / window * 100));
  const marker = document.getElementById("mww-marker");
  marker.style.left = `calc(${pct}% - 1.5px)`;
  document.getElementById("mww-visual").style.display = "block";
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
clearOutputs();
