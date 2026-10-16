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
  const maasp = num("kt-maasp"), mw = num("kt-mw"), hif = num("kt-hif"), tvd = num("kt-tvd");
  const loss = hif * mw * 0.052;
  const kt = tvd > 0 ? (maasp - loss) / (0.052 * tvd) : 0;
  set("out-loss", fmt(loss, 0) + " psi");
  set("out-kt", fmt(kt, 2) + " ppg");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
