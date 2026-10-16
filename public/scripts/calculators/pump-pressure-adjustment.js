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
  const p1 = num("ppa-p1"), spm1 = num("ppa-spm1"), spm2 = num("ppa-spm2");
  const newP = spm1 > 0 ? p1 * Math.pow(spm2 / spm1, 2) : 0;
  set("out-newp", fmt(newP, 0) + " psi");
  const op = num("ppa-op"), mw1 = num("ppa-mw1"), mw2 = num("ppa-mw2");
  const newPl = mw1 > 0 ? op * (mw2 / mw1) : 0;
  set("out-newpl", fmt(newPl, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
