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
  const mw = num("tm-mw"), sm = num("tm-sm"), tvd = num("tm-tvd");
  const tmsf = mw + sm / (0.052 * tvd);
  set("out-tmsf", fmt(tmsf, 2) + " ppg");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
