function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function calc() {
  const mw = num("mw"), tvd = num("tvd"), ppg = num("ppg_input"), fg = num("fg_input");
  const statusEl = document.getElementById("out-status");
  if (!mw || !tvd || !ppg || !fg) {
    document.getElementById("out-hp").textContent = "\u2014";
    document.getElementById("out-pp").textContent = "\u2014";
    document.getElementById("out-fp").textContent = "\u2014";
    document.getElementById("out-ob").textContent = "\u2014";
    statusEl.textContent = "\u2014";
    return;
  }
  const hp = 0.052 * mw * tvd;
  const pp = ppg * tvd;
  const fp = fg * tvd;
  const ob = hp - pp;
  document.getElementById("out-hp").textContent = hp.toFixed(0) + " psi";
  document.getElementById("out-pp").textContent = pp.toFixed(0) + " psi";
  document.getElementById("out-fp").textContent = fp.toFixed(0) + " psi";
  document.getElementById("out-ob").textContent = ob.toFixed(0) + " psi";
  if (hp < pp) {
    statusEl.innerHTML = '<span class="status-badge status-danger">\u{1F6A8} UNDERBALANCED \u2014 Kick Risk</span>';
  } else if (hp > fp) {
    statusEl.innerHTML = '<span class="status-badge status-danger">\u26D4 OVERBALANCED \u2014 Lost Circ. Risk</span>';
  } else if (ob < 100) {
    statusEl.innerHTML = '<span class="status-badge status-caution">\u26A0 Very Low Overbalance</span>';
  } else if (ob > 1500) {
    statusEl.innerHTML = '<span class="status-badge status-warn">\u26A0 High Overbalance \u2014 Monitor ECD</span>';
  } else {
    statusEl.innerHTML = '<span class="status-badge status-safe">\u2705 Safe Drilling Window</span>';
  }
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
