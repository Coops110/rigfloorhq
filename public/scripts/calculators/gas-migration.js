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
  const pinc = num("pinc"), mw = num("mw");
  const grad = mw * 0.052;
  const rate = grad > 0 ? pinc / grad : 0;
  set("out-grad", fmt(grad, 4) + " psi/ft");
  set("out-rate", fmt(rate, 1) + " ft/hr");
  const pbleed = num("pbleed"), acap = num("acap");
  const bleedvol = grad > 0 ? pbleed / grad * acap : 0;
  set("out-bleedvol", fmt(bleedvol, 2) + " bbls");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
