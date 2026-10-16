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
  const lp = num("maasp-lp"), lmw = num("maasp-lmw"), mw = num("maasp-mw"), tvd = num("maasp-tvd");
  const margin = lmw - mw;
  const maasp = lp + margin * 0.052 * tvd;
  set("out-margin", fmt(margin, 1) + " ppg");
  set("out-maasp", fmt(maasp, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
