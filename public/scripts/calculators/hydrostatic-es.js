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
    statusEl.innerHTML = '<span class="status-badge status-danger">\u{1F6A8} SUBBALANCEADO \u2014 Riesgo de Surgencia</span>';
  } else if (hp > fp) {
    statusEl.innerHTML = '<span class="status-badge status-danger">\u26D4 SOBREBALANCEADO \u2014 Riesgo de P\xE9rdida de Circ.</span>';
  } else if (ob < 100) {
    statusEl.innerHTML = '<span class="status-badge status-caution">\u26A0 Sobrebalance Muy Bajo</span>';
  } else if (ob > 1500) {
    statusEl.innerHTML = '<span class="status-badge status-warn">\u26A0 Sobrebalance Alto \u2014 Vigilar ECD</span>';
  } else {
    statusEl.innerHTML = '<span class="status-badge status-safe">\u2705 Ventana de Perforaci\xF3n Segura</span>';
  }
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
