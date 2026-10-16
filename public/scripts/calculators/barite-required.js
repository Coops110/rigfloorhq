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
  const mw1 = num("br-mw1"), mw2 = num("br-mw2");
  const denom = 35.5 - mw2;
  const barite = denom > 0 ? 1500 * (mw2 - mw1) / denom : 0;
  set("out-barite", fmt(barite, 1) + " lb/bbl");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
