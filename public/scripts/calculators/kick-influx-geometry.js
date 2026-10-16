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
  const kv = num("kig-kv"), ac = num("kig-ac"), inc = num("kig-inc");
  const loiah = ac > 0 ? kv / ac : 0;
  const ivh = loiah * Math.cos(inc * Math.PI / 180);
  set("out-loiah", fmt(loiah, 1) + " ft");
  set("out-ivh", fmt(ivh, 1) + " ft");
  const mw = num("kig-mw"), sidpp = num("kig-sidpp"), ig = num("kig-ig"), ivh2 = num("kig-ivh2");
  const mudGrad = mw * 0.052;
  const sicp = sidpp + ivh2 * (mudGrad - ig);
  set("out-sicp", fmt(sicp, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
