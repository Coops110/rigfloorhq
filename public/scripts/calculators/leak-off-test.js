function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n, d) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: d, maximumFractionDigits: d });
}
function set(id, text) {
  document.getElementById(id).textContent = text;
}
function calc() {
  const mw = num("lot-mw"), tvd = num("lot-tvd"), lp = num("lot-pressure");
  const emw = tvd > 0 ? mw + lp / (0.052 * tvd) : 0;
  const fgPsiFt = tvd > 0 ? (lp + mw * 0.052 * tvd) / tvd : 0;
  set("out-emw", fmt(emw, 2) + " ppg");
  set("out-fg", fmt(fgPsiFt, 4) + " psi/ft");

  const targetEmw = num("fit-target-emw"), fitMw = num("fit-mw"), fitTvd = num("fit-tvd");
  const targetPressure = fitTvd > 0 ? (targetEmw - fitMw) * 0.052 * fitTvd : 0;
  set("out-fit-pressure", fmt(targetPressure, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
